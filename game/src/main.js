// Lantern Market — Spot the Difference: boot and the frame loop. With no
// ?shot= query the game runs live (Space to start, click the differences,
// H for a hint). With one, the matching scene is staged frozen and a
// single frame is drawn, then window.__shotReady is raised so the
// screenshot tooling knows the frame is final.
import { createAudio } from './audio.js';
import { attachInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { createWorld } from './world.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const audio = createAudio();
attachInput(canvas, renderer, world, audio);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
let lastStatus = '';

function announce() {
  const s = world.state;
  const text = `Round ${s.sceneIndex + 1} of 3. Found ${world.foundCount()} of ${s.phase === 'play' ? 7 : 7} differences. ${Math.ceil(s.timeLeft)} seconds left. Score ${s.score}.`;
  if (text !== lastStatus) {
    lastStatus = text;
    status.textContent = text;
  }
}

function frame(now) {
  world.tick(1 / 60);
  renderer.draw(world.state, world, audio.muted);
  announce();
  if (shot === null) requestAnimationFrame(frame);
  else window.__shotReady = true;
  void now;
}

if (shot !== null) {
  stageShot(shot, world);
  renderer.draw(world.state, world, audio.muted);
  announce();
  requestAnimationFrame(() => {
    renderer.draw(world.state, world, audio.muted);
    window.__shotReady = true;
  });
} else {
  requestAnimationFrame(frame);
  // The screenshot tooling also waits on this flag when no shot is staged.
  window.__shotReady = true;
}
