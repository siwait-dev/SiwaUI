export const DEFAULT_IDLE_TIMEOUT_MINUTES = 30;
export const ACTION_TRAIL_MAX_ENTRIES = 50;
export const IDLE_ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
export const SECONDS_TO_MILLISECONDS = 1000;
export const MINUTES_TO_MILLISECONDS = 60 * SECONDS_TO_MILLISECONDS;
export const DEFAULT_IDLE_POLICY = {
  enabled: false,
  userCanDisable: true,
  timeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
} as const;
