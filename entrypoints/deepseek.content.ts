import { deriveDeepSeekState, readDeepSeekSignals, type AiTaskState } from '@/src/deepseek-adapter';

export default defineContentScript({
  matches: ['https://chat.deepseek.com/*'],
  runAt: 'document_idle',
  main() {
    let previousState: AiTaskState = 'unknown';

    const observe = () => {
      const signals = readDeepSeekSignals(document, location.hostname === 'chat.deepseek.com');
      const state = deriveDeepSeekState(signals, previousState);
      if (state === previousState) return;
      previousState = state;
      void browser.runtime.sendMessage({ type: 'deepseek_state_observed', state, observedAt: Date.now() });
    };

    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-disabled', 'contenteditable', 'disabled', 'role', 'title'],
    });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  },
});
