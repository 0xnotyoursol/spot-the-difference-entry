// The game's rules and state, with no drawing and no browser in it: which
// round is live, which differences are found, the timer, the score, hints
// and mistakes. clickAt() takes scene coordinates (600x560, shared by both
// panels) and returns what happened, so the caller can react — a chime, a
// buzz, a screen change — without the world knowing about sound or pixels.
import { GAME } from './config.js';
import { SCENES } from './scenes.js';

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_ROUND_CLEAR = 'roundClear';
export const PHASE_WIN = 'win';
export const PHASE_OVER = 'over';
export const PHASE_PAUSED = 'paused';

export function createWorld() {
  const state = {
    phase: PHASE_TITLE,
    sceneIndex: 0,
    found: [],
    score: 0,
    totalScore: 0,
    timeLeft: GAME.secondsPerRound,
    mistakes: 0,
    hintsUsed: 0,
    hintReveal: null, // { index, left } — a hinted difference, briefly ringed
    missFlash: null, // { x, y, left } — a wrong click, briefly crossed
    rings: [], // { index, left } — fresh finds, briefly pulsing
    roundBonus: 0,
    best: 0,
    frozen: false, // screenshots: the timer and animations stand still
    elapsed: 0,
  };

  function diffs() {
    return SCENES[state.sceneIndex].diffs;
  }

  function foundCount() {
    return state.found.length;
  }

  function remaining() {
    return diffs().length - state.found.length;
  }

  function resetRound(index) {
    state.sceneIndex = index;
    state.found = [];
    state.timeLeft = GAME.secondsPerRound;
    state.mistakes = 0;
    state.hintsUsed = 0;
    state.hintReveal = null;
    state.missFlash = null;
    state.rings = [];
    state.roundBonus = 0;
    state.phase = PHASE_PLAY;
  }

  function start() {
    state.score = 0;
    state.totalScore = 0;
    resetRound(0);
  }

  function retryRound() {
    state.score = state.totalScore;
    resetRound(state.sceneIndex);
  }

  function playAgain() {
    start();
  }

  function nextRound() {
    if (state.sceneIndex + 1 >= SCENES.length) {
      state.phase = PHASE_WIN;
      return;
    }
    state.totalScore = state.score;
    resetRound(state.sceneIndex + 1);
  }

  function completeRound() {
    state.roundBonus = Math.ceil(state.timeLeft) * GAME.timeBonusPerSecond;
    state.score += state.roundBonus;
    if (state.sceneIndex + 1 >= SCENES.length) {
      state.totalScore = state.score;
      state.best = Math.max(state.best, state.score);
      state.phase = PHASE_WIN;
    } else {
      state.phase = PHASE_ROUND_CLEAR;
    }
  }

  /** A click at scene coordinates. Returns 'found' | 'miss' | 'again' | null. */
  function clickAt(x, y) {
    if (state.phase !== PHASE_PLAY) return null;
    const list = diffs();
    for (let i = 0; i < list.length; i += 1) {
      if (state.found.includes(i)) continue;
      const d = list[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.push(i);
        state.score += GAME.pointsPerFind;
        state.rings.push({ index: i, left: GAME.ringSeconds });
        state.hintReveal = null;
        if (state.found.length === list.length) completeRound();
        return 'found';
      }
    }
    for (const i of state.found) {
      const d = list[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return 'again';
    }
    state.mistakes += 1;
    state.score = Math.max(0, state.score - GAME.wrongClickPenalty);
    state.missFlash = { x, y, left: GAME.missFlashSeconds };
    return 'miss';
  }

  /** Ring one still-hidden difference for a couple of seconds. Costs points. */
  function hint() {
    if (state.phase !== PHASE_PLAY) return null;
    if (state.hintsUsed >= GAME.maxHintsPerRound) return 'none-left';
    const hidden = diffs().map((_, i) => i).filter((i) => !state.found.includes(i));
    if (hidden.length === 0) return null;
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    state.hintsUsed += 1;
    state.score = Math.max(0, state.score - GAME.hintCost);
    state.hintReveal = { index: pick, left: 2.5 };
    return 'hint';
  }

  function pause() {
    if (state.phase === PHASE_PLAY) state.phase = PHASE_PAUSED;
    else if (state.phase === PHASE_PAUSED) state.phase = PHASE_PLAY;
  }

  function tick(dt) {
    if (state.frozen) return;
    state.elapsed += dt;
    for (const ring of state.rings) ring.left -= dt;
    state.rings = state.rings.filter((ring) => ring.left > 0);
    if (state.hintReveal !== null) {
      state.hintReveal.left -= dt;
      if (state.hintReveal.left <= 0) state.hintReveal = null;
    }
    if (state.missFlash !== null) {
      state.missFlash.left -= dt;
      if (state.missFlash.left <= 0) state.missFlash = null;
    }
    if (state.phase !== PHASE_PLAY) return;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.phase = PHASE_OVER;
    }
  }

  return {
    state,
    diffs,
    foundCount,
    remaining,
    start,
    retryRound,
    playAgain,
    nextRound,
    clickAt,
    hint,
    pause,
    tick,
  };
}
