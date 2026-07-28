import { createEvent } from '@/src/analytics';
import { findGame } from '@/src/games';
import type { RuntimeMessage } from '@/src/messages';
import {
  appendEvent,
  getDeepSeekDetection,
  getEvents,
  getSession,
  getSettings,
  saveDeepSeekDetection,
  saveSession,
  saveSettings,
} from '@/src/storage';
import type { AnalyticsEventName, Settings, WaitSession } from '@/src/types';

const thresholdAlarm = 'waitplay-threshold';
const completionNotification = 'waitplay-wait-ended';

async function record(name: AnalyticsEventName, session?: WaitSession): Promise<void> {
  const settings = await getSettings();
  if (settings.analyticsEnabled) {
    await appendEvent(createEvent(name, session?.id));
  }
}

async function focusOriginalTab(session?: WaitSession): Promise<boolean> {
  if (!session) return false;
  try {
    const tab = await browser.tabs.get(session.originalTabId);
    await browser.windows.update(tab.windowId, { focused: true });
    await browser.tabs.update(tab.id, { active: true });
    await record('original_tab_focused', session);
    return true;
  } catch {
    return false;
  }
}

async function reachThreshold(): Promise<void> {
  const session = await getSession();
  const settings = await getSettings();
  if (!session || session.status !== 'waiting' || !settings.recommendationsEnabled || session.recommendationDisabled) return;
  await saveSession({ ...session, status: 'recommendation_ready' });
  await record('threshold_reached', session);
}

async function restoreWaitingSession(): Promise<void> {
  const session = await getSession();
  if (!session || session.status !== 'waiting') return;
  const dueAt = session.startedAt + session.thresholdSeconds * 1000;
  if (Date.now() >= dueAt) {
    await reachThreshold();
    return;
  }
  await browser.alarms.create(thresholdAlarm, { when: dueAt });
}

async function startWait(): Promise<void> {
  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!activeTab?.id) throw new Error('找不到当前标签页。');

  const settings = await getSettings();
  const session: WaitSession = {
    id: crypto.randomUUID(),
    originalTabId: activeTab.id,
    startedAt: Date.now(),
    thresholdSeconds: settings.thresholdSeconds,
    status: 'waiting',
    recommendationDisabled: false,
  };
  await saveSession(session);
  await browser.alarms.create(thresholdAlarm, { when: session.startedAt + session.thresholdSeconds * 1000 });
  await record('wait_started', session);
}

async function endWait(): Promise<{ notificationSent: boolean }> {
  const session = await getSession();
  await browser.alarms.clear(thresholdAlarm);
  if (!session) return { notificationSent: false };
  await saveSession({ ...session, status: 'ended' });
  await record('wait_ended', session);
  try {
    await browser.notifications.create(completionNotification, {
      type: 'basic',
      iconUrl: browser.runtime.getURL('/icon.svg'),
      title: 'AI 任务可能已完成',
      message: '点击“回到任务”继续处理原标签页。',
      buttons: [{ title: '回到任务' }],
    });
    return { notificationSent: true };
  } catch {
    return { notificationSent: false };
  }
}

async function dashboard() {
  await restoreWaitingSession();
  return {
    session: await getSession(),
    settings: await getSettings(),
    deepSeekDetection: await getDeepSeekDetection(),
  };
}

async function handleMessage(message: RuntimeMessage) {
  switch (message.type) {
    case 'get_dashboard': return dashboard();
    case 'start_wait': await startWait(); return dashboard();
    case 'end_wait': {
      const completion = await endWait();
      return { ...(await dashboard()), ...completion };
    }
    case 'record_card_shown': {
      const session = await getSession();
      if (session) await record('card_shown', session);
      return dashboard();
    }
    case 'disable_recommendations': {
      const session = await getSession();
      if (session) {
        await saveSession({ ...session, recommendationDisabled: true });
        await record('recommendation_disabled', session);
      }
      return dashboard();
    }
    case 'open_game': {
      const session = await getSession();
      if (!findGame(message.gameId)) throw new Error('该游戏不可用。');
      try {
        await browser.tabs.create({ url: browser.runtime.getURL(`/game.html?gameId=${message.gameId}`), active: true });
        if (session) await record('game_opened', session);
        return dashboard();
      } catch {
        if (session) await record('game_load_failed', session);
        throw new Error('游戏页无法打开，请返回任务或稍后重试。');
      }
    }
    case 'return_to_task': {
      const session = await getSession();
      if (session) await record('return_clicked', session);
      return { focused: await focusOriginalTab(session) };
    }
    case 'save_settings': await saveSettings(message.settings as Settings); return dashboard();
    case 'clear_local_data': await browser.storage.local.clear(); return dashboard();
    case 'get_local_events': return getEvents();
    case 'deepseek_state_observed':
      await saveDeepSeekDetection({ state: message.state, observedAt: message.observedAt });
      return dashboard();
  }
}

export default defineBackground(() => {
  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === thresholdAlarm) void reachThreshold();
  });
  browser.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === completionNotification) void getSession().then(focusOriginalTab);
  });
  browser.notifications.onButtonClicked.addListener((notificationId) => {
    if (notificationId === completionNotification) void getSession().then(focusOriginalTab);
  });
  browser.runtime.onMessage.addListener((message) => handleMessage(message as RuntimeMessage));
  browser.runtime.onStartup.addListener(() => { void restoreWaitingSession(); });
  void restoreWaitingSession();
});
