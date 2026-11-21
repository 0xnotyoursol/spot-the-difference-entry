// Drawing only: the world's state in, pixels out. The 1280x720 playfield
// is scaled to fit the window and centred. Both picture panels are drawn
// from the same scene painter (variant 0 left, variant 1 right), so the
// only visible differences are the ones the scene declares; found ones get
// a gold ring on both panels, and the HUD carries the counter the
// requirements ask for: how many are found, and how many are still to go.
import { FIELD, FONT, GAME, HUD_HEIGHT, FOOTER_Y, PALETTE, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';
import { SCENES } from './scenes.js';
import { PHASE_OVER, PHASE_PAUSED, PHASE_ROUND_CLEAR, PHASE_TITLE, PHASE_WIN } from './world.js';

const HINT_BUTTON = { x: 1060, y: 660, w: 200, h: 44 };
const PANEL_LABELS = ['A · ORIGINAL', 'B · TWIN'];

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  function text(value, x, y, size, color, align, weight) {
    context.font = `${weight || ''} ${size}px ${FONT}`.trim();
    context.fillStyle = color;
    context.textAlign = align || 'left';
    context.textBaseline = 'alphabetic';
    context.fillText(value, x, y);
  }

  function drawPanel(state, panelX, variant) {
    const scene = SCENES[state.sceneIndex];
    context.save();
    context.beginPath();
    context.rect(panelX, PANEL.y, PANEL.width, PANEL.height);
    context.clip();
    context.translate(panelX, PANEL.y);
    scene.draw(context, variant);
    context.restore();
    // Found markers ring the difference on BOTH panels.
    for (const index of state.found) {
      const d = scene.diffs[index];
      const ring = state.rings.find((r) => r.index === index);
      const pulse = ring ? 1 + Math.sin(ring.left * 12) * 0.08 : 1;
      context.strokeStyle = PALETTE.gold;
      context.lineWidth = 5;
      context.beginPath();
      context.arc(panelX + d.x, PANEL.y + d.y, (d.r + 6) * pulse, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = '#7a5200';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(panelX + d.x, PANEL.y + d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
      context.stroke();
      // Check mark across the ring.
      context.strokeStyle = PALETTE.gold;
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(panelX + d.x - 10, PANEL.y + d.y);
      context.lineTo(panelX + d.x - 3, PANEL.y + d.y + 8);
      context.lineTo(panelX + d.x + 12, PANEL.y + d.y - 8);
      context.stroke();
    }
    // A hinted difference gets a dashed pulsing ring instead.
    if (state.hintReveal !== null) {
      const d = scene.diffs[state.hintReveal.index];
      const pulse = 1 + Math.sin(state.elapsed * 8) * 0.1;
      context.save();
      context.setLineDash([10, 8]);
      context.strokeStyle = '#7ee787';
      context.lineWidth = 4;
      context.beginPath();
      context.arc(panelX + d.x, PANEL.y + d.y, (d.r + 8) * pulse, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
    // Frame and label tab.
    context.strokeStyle = PALETTE.panelFrame;
    context.lineWidth = 4;
    context.strokeRect(panelX, PANEL.y, PANEL.width, PANEL.height);
    context.fillStyle = PALETTE.hud;
    context.fillRect(panelX + 12, PANEL.y - 14, 132, 26);
    context.strokeStyle = PALETTE.panelFrame;
    context.lineWidth = 2;
    context.strokeRect(panelX + 12, PANEL.y - 14, 132, 26);
    text(PANEL_LABELS[variant], panelX + 78, PANEL.y + 4, 14, PALETTE.muted, 'center', 'bold');
  }

  function drawMissFlash(state) {
    const flash = state.missFlash;
    if (flash === null) return;
    const panelX = flash.panel === 'right' ? PANEL_RIGHT_X : PANEL_LEFT_X;
    const x = panelX + flash.x;
    const y = PANEL.y + flash.y;
    context.strokeStyle = PALETTE.red;
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(x - 12, y - 12);
    context.lineTo(x + 12, y + 12);
    context.moveTo(x + 12, y - 12);
    context.lineTo(x - 12, y + 12);
    context.stroke();
  }

  function drawHud(state, world) {
    context.fillStyle = PALETTE.hud;
    context.fillRect(0, 0, FIELD.width, HUD_HEIGHT);
    context.fillStyle = PALETTE.hudLine;
    context.fillRect(0, HUD_HEIGHT - 2, FIELD.width, 2);
    text('LANTERN MARKET', 24, 34, 26, PALETTE.text, 'left', 'bold');
    text('Spot the Difference', 24, 60, 15, PALETTE.muted, 'left');
    const scene = SCENES[state.sceneIndex];
    text(`Round ${state.sceneIndex + 1}/${SCENES.length} — ${scene.name}`, FIELD.width / 2, 30, 19, PALETTE.text, 'center', 'bold');
    const found = world.foundCount();
    const total = scene.diffs.length;
    const left = total - found;
    text(`FOUND ${found} / ${total}  ·  ${left} TO GO`, FIELD.width / 2, 60, 19, left === 0 ? PALETTE.green : PALETTE.gold, 'center', 'bold');
    const timeColor = state.timeLeft <= 15 && state.phase === 'play' ? PALETTE.red : PALETTE.text;
    text(`TIME ${formatTime(state.timeLeft)}`, FIELD.width - 220, 34, 24, timeColor, 'right', 'bold');
    text(`SCORE ${state.score}`, FIELD.width - 220, 60, 16, PALETTE.muted, 'right');
  }

  function drawFooter(state, world) {
    const foundNames = state.found.map((i) => SCENES[state.sceneIndex].diffs[i].name);
    text('Click a difference on either picture  ·  H hint  ·  P pause  ·  M sound', 24, FOOTER_Y + 28, 16, PALETTE.muted, 'left');
    if (foundNames.length > 0) {
      text(`Found: ${foundNames.join(' · ')}`, 24, FOOTER_Y + 52, 14, PALETTE.gold, 'left');
    }
    const hintsLeft = GAME.maxHintsPerRound - state.hintsUsed;
    context.fillStyle = hintsLeft > 0 ? PALETTE.button : '#3a2b52';
    context.beginPath();
    context.roundRect(HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.w, HINT_BUTTON.h, 10);
    context.fill();
    text(`Hint (H) · ${hintsLeft} left`, HINT_BUTTON.x + HINT_BUTTON.w / 2, HINT_BUTTON.y + 29, 17, '#ffffff', 'center', 'bold');
  }

  function drawOverlayPanel(title, lines, prompt, titleColor) {
    context.fillStyle = 'rgba(12, 8, 24, 0.72)';
    context.fillRect(0, 0, FIELD.width, FIELD.height);
    const width = 640;
    const height = 170 + lines.length * 36;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;
    context.fillStyle = '#2b2144';
    context.beginPath();
    context.roundRect(x, y, width, height, 16);
    context.fill();
    context.strokeStyle = PALETTE.gold;
    context.lineWidth = 3;
    context.stroke();
    text(title, FIELD.width / 2, y + 72, 44, titleColor || PALETTE.text, 'center', 'bold');
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], FIELD.width / 2, y + 122 + i * 36, 20, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 30, 20, PALETTE.gold, 'center', 'bold');
  }

  function draw(state, world, muted) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawHud(state, world);
    drawPanel(state, PANEL_LEFT_X, 0);
    drawPanel(state, PANEL_RIGHT_X, 1);
    // The VS badge between the panels.
    context.fillStyle = PALETTE.hud;
    context.beginPath();
    context.arc(PANEL_LEFT_X + PANEL.width + PANEL.gap / 2, PANEL.y + PANEL.height / 2, 22, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = PALETTE.panelFrame;
    context.lineWidth = 2;
    context.stroke();
    text('VS', PANEL_LEFT_X + PANEL.width + PANEL.gap / 2, PANEL.y + PANEL.height / 2 + 7, 18, PALETTE.gold, 'center', 'bold');
    drawMissFlash(state);
    drawFooter(state, world);
    if (muted) text('Muted (M)', FIELD.width - 24, FOOTER_Y + 28, 14, PALETTE.muted, 'right');

    if (state.phase === PHASE_TITLE) {
      const lines = [
        'Two pictures. Seven differences. Find them all before the clock runs out.',
        '3 rounds · 120 seconds each · a wrong click costs 25 points · a hint costs 50',
        state.best > 0 ? `Best score so far: ${state.best}` : 'Every scene is drawn fresh — no two rounds look alike.',
      ];
      drawOverlayPanel('LANTERN MARKET', lines, 'Click or press Space to start');
    } else if (state.phase === PHASE_ROUND_CLEAR) {
      drawOverlayPanel('Round clear!', [
        `You found all ${SCENES[state.sceneIndex].diffs.length} differences in ${SCENES[state.sceneIndex].name}.`,
        `Time bonus +${state.roundBonus}  ·  Score ${state.score}`,
        state.mistakes === 0 ? 'Not a single wrong click. Sharp eyes!' : `${state.mistakes} wrong click${state.mistakes === 1 ? '' : 's'} — still a clear.`,
      ], 'Press Space for the next round', PALETTE.green);
    } else if (state.phase === PHASE_WIN) {
      const stars = state.mistakes === 0 && state.hintsUsed === 0 ? 3 : state.mistakes <= 3 ? 2 : 1;
      drawOverlayPanel('You found them all!', [
        `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}   All ${SCENES.length} rounds cleared.`,
        `Final score ${state.score}  ·  Best ${state.best}`,
        'Thanks for playing Lantern Market.',
      ], 'Press R to play again', PALETTE.gold);
    } else if (state.phase === PHASE_OVER) {
      drawOverlayPanel("Time's up!", [
        `You found ${world.foundCount()} of ${SCENES[state.sceneIndex].diffs.length} differences in ${SCENES[state.sceneIndex].name}.`,
        `Score ${state.score} — the hidden ones stay hidden this round.`,
      ], 'Press R to retry this round', PALETTE.red);
    } else if (state.phase === PHASE_PAUSED) {
      drawOverlayPanel('Paused', ['The clock is waiting for you.'], 'Press P to resume');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, view, hintButton: HINT_BUTTON };
}
