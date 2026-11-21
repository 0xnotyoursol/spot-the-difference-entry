// Input only: pointer clicks and keys in, world actions out. A click is
// mapped from window pixels to the 1280x720 field, then to scene
// coordinates when it lands inside a picture panel; the world decides
// whether that spot is a difference. Keys: Space starts / advances,
// H hints, P pauses, R retries or replays, M mutes.
import { PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';
import { PHASE_OVER, PHASE_PAUSED, PHASE_PLAY, PHASE_ROUND_CLEAR, PHASE_TITLE, PHASE_WIN } from './world.js';

export function attachInput(canvas, renderer, world, audio) {
  const state = world.state;

  function fieldFromClient(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const view = renderer.view;
    return {
      x: (clientX - rect.left - view.x) / view.scale,
      y: (clientY - rect.top - view.y) / view.scale,
    };
  }

  function inside(rect, x, y) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  function panelAt(x, y) {
    if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
    if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL.width) return { panel: 'left', x: x - PANEL_LEFT_X, y: y - PANEL.y };
    if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL.width) return { panel: 'right', x: x - PANEL_RIGHT_X, y: y - PANEL.y };
    return null;
  }

  function advance() {
    if (state.phase === PHASE_TITLE) {
      world.start();
      audio.found();
    } else if (state.phase === PHASE_ROUND_CLEAR) {
      world.nextRound();
      audio.found();
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    audio.unlock();
    const { x, y } = fieldFromClient(event.clientX, event.clientY);
    if (state.phase === PHASE_PLAY && inside(renderer.hintButton, x, y)) {
      const result = world.hint();
      if (result === 'hint') audio.hint();
      return;
    }
    const hit = panelAt(x, y);
    if (hit !== null && state.phase === PHASE_PLAY) {
      const result = world.clickAt(hit.x, hit.y);
      if (result === 'miss' && state.missFlash !== null) state.missFlash.panel = hit.panel;
      if (result === 'found') audio.found();
      else if (result === 'miss') audio.miss();
      else audio.click();
      if (state.phase === PHASE_ROUND_CLEAR) audio.roundClear();
      if (state.phase === PHASE_WIN) audio.win();
      return;
    }
    if (state.phase === PHASE_TITLE || state.phase === PHASE_ROUND_CLEAR) {
      advance();
    } else if (state.phase === PHASE_WIN) {
      world.playAgain();
    } else if (state.phase === PHASE_OVER) {
      world.retryRound();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'Space') {
      event.preventDefault();
      audio.unlock();
      if (state.phase === PHASE_TITLE || state.phase === PHASE_ROUND_CLEAR) advance();
      else if (state.phase === PHASE_WIN) world.playAgain();
      else if (state.phase === PHASE_OVER) world.retryRound();
    } else if (event.code === 'KeyH') {
      const result = world.hint();
      if (result === 'hint') audio.hint();
    } else if (event.code === 'KeyP') {
      if (state.phase === PHASE_PLAY || state.phase === PHASE_PAUSED) world.pause();
    } else if (event.code === 'KeyR') {
      if (state.phase === PHASE_WIN) world.playAgain();
      else if (state.phase === PHASE_OVER || state.phase === PHASE_PLAY || state.phase === PHASE_PAUSED) world.retryRound();
    } else if (event.code === 'KeyM') {
      audio.toggleMute();
    }
  });
}
