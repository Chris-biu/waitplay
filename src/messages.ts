import type { Settings } from './types';

export type RuntimeMessage =
  | { type: 'get_dashboard' }
  | { type: 'start_wait' }
  | { type: 'end_wait' }
  | { type: 'open_game'; gameId: string }
  | { type: 'return_to_task' }
  | { type: 'record_card_shown' }
  | { type: 'disable_recommendations' }
  | { type: 'save_settings'; settings: Settings }
  | { type: 'clear_local_data' };

