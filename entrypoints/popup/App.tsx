import { useEffect, useState } from 'react';
import { getRecommendedGames } from '@/src/games';
import type { AiDetection, AnalyticsEvent, Settings, WaitSession } from '@/src/types';
import './style.css';

interface Dashboard {
  session?: WaitSession;
  settings: Settings;
  deepSeekDetection?: AiDetection;
}

const defaultDashboard: Dashboard = {
  settings: { thresholdSeconds: 90, recommendationsEnabled: true, analyticsEnabled: false },
};

async function send(message: unknown): Promise<Dashboard> {
  return browser.runtime.sendMessage(message) as Promise<Dashboard>;
}

function elapsedLabel(session?: WaitSession): string {
  if (!session) return '尚未开始等待';
  const seconds = Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000));
  return `已等待 ${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
}

export function App() {
  const [dashboard, setDashboard] = useState<Dashboard>(defaultDashboard);
  const [notice, setNotice] = useState('');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const session = dashboard.session;

  const refresh = () => send({ type: 'get_dashboard' }).then(setDashboard);
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setDashboard((value) => ({ ...value })), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (session?.status === 'recommendation_ready') void send({ type: 'record_card_shown' });
  }, [session?.status]);

  async function act(message: unknown, successMessage: string) {
    try {
      setDashboard(await send(message));
      setNotice(successMessage);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '操作失败，请重试。');
    }
  }

  async function showLocalEvents() {
    const result = await browser.runtime.sendMessage({ type: 'get_local_events' }) as AnalyticsEvent[];
    setEvents(result);
  }

  async function updateSettings(next: Settings) {
    await act({ type: 'save_settings', settings: next }, '设置已保存。');
  }

  const canStart = !session || session.status === 'ended';
  const showRecommendation = session?.status === 'recommendation_ready' && !session.recommendationDisabled;
  const recommendedGames = getRecommendedGames(session?.thresholdSeconds ?? dashboard.settings.thresholdSeconds);

  return (
    <main>
      <header>
        <h1>Waitplay</h1>
        <p>{elapsedLabel(session)}</p>
      </header>

      <section className="controls" aria-label="等待控制">
        {canStart ? (
          <button className="primary" onClick={() => void act({ type: 'start_wait' }, '已开始等待。')}>
            开始等待
          </button>
        ) : (
          <button className="primary" onClick={() => void act({ type: 'end_wait' }, '等待已结束；如通知不可用，请直接返回原任务标签页。')}>
            结束等待
          </button>
        )}
      </section>

      {showRecommendation && (
        <section className="recommendation" aria-label="等待推荐">
          <h2>现在适合短暂休息</h2>
          <p>游戏不会自动打开；选择后将在独立标签页中启动。</p>
          {recommendedGames.map((game) => (
            <article className="game" key={game.id}>
              <div>
                <strong>{game.name}</strong>
                <span>{game.durationLabel} · {game.pausable ? '可暂停' : '退出可能丢失进度'}</span>
              </div>
              <button onClick={() => void act({ type: 'open_game', gameId: game.id }, '已在新标签页打开占位游戏。')}>
                立即游玩
              </button>
            </article>
          ))}
          <div className="secondary-actions">
            <button onClick={() => void act({ type: 'disable_recommendations' }, '本次等待将不再推荐。')}>本次不提醒</button>
            <button onClick={() => void act({ type: 'disable_recommendations' }, '已跳过本次推荐。')}>跳过</button>
          </div>
        </section>
      )}

      <section className="settings" aria-label="设置">
        <h2>设置</h2>
        <label>
          推荐阈值
          <select
            value={dashboard.settings.thresholdSeconds}
            onChange={(event) => void updateSettings({ ...dashboard.settings, thresholdSeconds: Number(event.target.value) as Settings['thresholdSeconds'] })}
          >
            <option value={60}>60 秒</option><option value={90}>90 秒</option><option value={120}>120 秒</option>
          </select>
        </label>
        <label className="check"><input type="checkbox" checked={dashboard.settings.recommendationsEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, recommendationsEnabled: event.target.checked })} /> 启用游戏推荐</label>
        <label className="check"><input type="checkbox" checked={dashboard.settings.analyticsEnabled} onChange={(event) => void updateSettings({ ...dashboard.settings, analyticsEnabled: event.target.checked })} /> 启用匿名体验分析（仅本地）</label>
        <button className="link" onClick={() => void act({ type: 'clear_local_data' }, '本地数据已清除。')}>清除本地数据</button>
        <button className="link" onClick={() => void showLocalEvents()}>查看本地事件</button>
        {events.length > 0 && <output className="event-output">仅本地：{events.map((event) => event.name).join('、')}</output>}
      </section>
      <section className="settings" aria-label="DeepSeek Beta 状态">
        <h2>DeepSeek Beta</h2>
        <p>仅在 chat.deepseek.com 观察页面控件状态：{dashboard.deepSeekDetection?.state ?? 'unknown'}。</p>
        <p>此隔离 PoC 不读取对话内容，也不会自动开启游戏或结束等待。</p>
      </section>
      {notice && <p className="notice" role="status">{notice}</p>}
    </main>
  );
}
