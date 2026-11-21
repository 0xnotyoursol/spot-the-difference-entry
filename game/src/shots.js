// The screenshot scenes behind ?shot=start|play|play2|win. Each one puts
// the world in a fixed, deterministic state — no timer running, no
// animation mid-flight — so the same shot always renders the same frame,
// and the frame is what a real game really looks like at that moment:
// the title over the market, mid-round with three differences ringed and
// four still hidden, a second round in progress, and the win screen.
import { GAME } from './config.js';
import { PHASE_PLAY, PHASE_ROUND_CLEAR, PHASE_TITLE, PHASE_WIN } from './world.js';

/**
 * Set the world to the named scene and freeze it. Unknown names are the
 * title screen. The caller draws one frame after this returns.
 */
export function stageShot(name, world) {
  const state = world.state;
  state.frozen = true;
  state.rings = [];
  state.missFlash = null;
  state.hintReveal = null;
  if (name === 'play') {
    world.start();
    state.found = [0, 2, 4]; // the moon, the cat, a star — ringed in gold
    state.score = 300;
    state.timeLeft = 87;
    state.mistakes = 1;
    state.phase = PHASE_PLAY;
    return;
  }
  if (name === 'play2') {
    world.start();
    state.sceneIndex = 1; // Harbour Dawn
    state.found = [1, 3]; // a gull, the sail
    state.score = 540;
    state.timeLeft = 64;
    state.mistakes = 0;
    state.phase = PHASE_PLAY;
    return;
  }
  if (name === 'win') {
    world.start();
    state.sceneIndex = 2; // Moon Garden
    state.found = [0, 1, 2, 3, 4, 5, 6];
    state.score = 2450;
    state.totalScore = 2450;
    state.best = 2450;
    state.timeLeft = 41;
    state.mistakes = 1;
    state.hintsUsed = 1;
    state.phase = PHASE_WIN;
    return;
  }
  if (name === 'roundClear') {
    world.start();
    state.found = [0, 1, 2, 3, 4, 5, 6];
    state.roundBonus = 205; // 41 seconds left x 5 points a second
    state.score = 905;
    state.timeLeft = 41;
    state.mistakes = 0;
    state.phase = PHASE_ROUND_CLEAR;
    return;
  }
  world.start();
  state.phase = PHASE_TITLE;
  state.score = 0;
  state.timeLeft = GAME.secondsPerRound;
}
