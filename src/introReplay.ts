/* The site bar's logo replays the homepage intro while the homepage is open.
   A window event keeps the bar and the intro independent of each other. */
export const REPLAY_INTRO_EVENT = 'pairlab:replay-intro'

export function replayIntro() {
  window.dispatchEvent(new Event(REPLAY_INTRO_EVENT))
}
