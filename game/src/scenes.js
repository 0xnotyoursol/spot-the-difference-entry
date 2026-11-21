// The three scenes of Lantern Market, drawn entirely in code — no image
// files, no network. Each scene is painted twice: variant 0 is the
// original, variant 1 is the altered twin. The two variants share one
// painter; every difference is a single conditional inside it, so the
// panels can only ever differ where a difference says they should.
//
// A difference is { x, y, r, name } in the 600x560 scene space. Clicks in
// either panel map back to these coordinates.
function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** A four-point sparkle star. */
function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 340);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 340);
}

function stars(ctx, points) {
  for (const [x, y, r] of points) sparkle(ctx, x, y, r, '#fff8d6');
}

function paperLantern(ctx, x, y, color, lit) {
  ctx.strokeStyle = '#3a2417';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 34);
  ctx.lineTo(x, y - 18);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, 22 - Math.abs(i) * 4, 26, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, x - 8, y - 30, 16, 6, '#8a5a2b');
  rect(ctx, x - 8, y + 24, 16, 6, '#8a5a2b');
  if (lit) {
    ctx.fillStyle = 'rgba(255, 220, 120, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- scene 1
// Lantern Night Market: dusk sky, a string of lanterns, two stalls, a cat
// on the fruit crate, a kite on the roof, and a moonlit puddle.
function drawMarket(ctx, v) {
  sky(ctx, '#241645', '#8a4a6e');
  stars(ctx, [[60, 50, 5], [210, 36, 4], [330, 60, 5], [430, 34, 4], [90, 120, 4], [560, 130, 4]]);
  if (v === 1) sparkle(ctx, 150, 55, 8, '#fff8d6'); // D5: one extra star
  // D1: crescent moon in the original, a full moon in the twin.
  circle(ctx, 505, 68, 30, '#ffeec2');
  if (v === 0) circle(ctx, 517, 60, 26, '#241645');

  // Lantern string.
  ctx.strokeStyle = '#1c1428';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 96);
  ctx.quadraticCurveTo(300, 140, 580, 96);
  ctx.stroke();
  const lanternXs = [70, 170, 270, 370, 470];
  const lanternColors = ['#ff5a4e', '#ffb03c', '#ff5a4e', '#ffb03c', '#ff5a4e'];
  for (let i = 0; i < lanternXs.length; i += 1) {
    if (v === 1 && i === 2) continue; // D2: the middle lantern is gone
    paperLantern(ctx, lanternXs[i], 132, lanternColors[i], true);
  }

  // Rooftops.
  rect(ctx, 0, 250, 600, 14, '#3a2440');
  rect(ctx, 30, 264, 250, 12, '#4a2c50');
  rect(ctx, 330, 264, 240, 12, '#4a2c50');
  // D7: a little diamond kite on the right roof in the original only.
  if (v === 0) {
    ctx.fillStyle = '#7ee787';
    ctx.beginPath();
    ctx.moveTo(480, 246);
    ctx.lineTo(498, 264);
    ctx.lineTo(480, 282);
    ctx.lineTo(462, 264);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d8f7d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(480, 282);
    ctx.lineTo(470, 300);
    ctx.stroke();
  }

  // Left stall: red-and-white awning, fruit crates.
  for (let i = 0; i < 6; i += 1) {
    // D6: the second awning stripe is red in the original, yellow in the twin.
    const color = i % 2 === 0 ? '#f4ead8' : i === 1 && v === 1 ? '#ffd23c' : '#d83a34';
    rect(ctx, 30 + i * 42, 276, 42, 34, color);
  }
  rect(ctx, 30, 310, 252, 10, '#6b4226');
  rect(ctx, 44, 320, 224, 130, '#7a4a2b');
  rect(ctx, 44, 320, 224, 10, '#8a5a34');
  // Crates of oranges.
  rect(ctx, 60, 400, 90, 50, '#5d3a1e');
  circle(ctx, 82, 392, 13, '#ff8c2e');
  circle(ctx, 108, 388, 13, '#ff8c2e');
  if (v === 0) circle(ctx, 134, 392, 13, '#ff8c2e'); // D4: one orange fewer
  circle(ctx, 95, 406, 12, '#ffa94d');
  circle(ctx, 120, 408, 12, '#ffa94d');
  rect(ctx, 170, 410, 80, 40, '#5d3a1e');
  circle(ctx, 190, 402, 11, '#e84a5f');
  circle(ctx, 212, 400, 11, '#e84a5f');
  circle(ctx, 232, 404, 11, '#e84a5f');
  // D3: the grey cat asleep on the left crate in the original only.
  if (v === 0) {
    ellipse(ctx, 120, 436, 26, 14, '#9aa3ad');
    circle(ctx, 142, 426, 10, '#9aa3ad');
    ctx.fillStyle = '#9aa3ad';
    ctx.beginPath();
    ctx.moveTo(136, 420);
    ctx.lineTo(138, 410);
    ctx.lineTo(143, 418);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(146, 419);
    ctx.lineTo(150, 410);
    ctx.lineTo(152, 418);
    ctx.closePath();
    ctx.fill();
  }
  // Stall sign.
  rect(ctx, 96, 336, 120, 34, '#f4ead8');
  ctx.fillStyle = '#a32c26';
  ctx.font = 'bold 20px Trebuchet MS, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEA · FRUIT', 156, 354);

  // Right stall: teal awning, flower pots.
  for (let i = 0; i < 6; i += 1) rect(ctx, 330 + i * 40, 276, 40, 34, i % 2 === 0 ? '#f4ead8' : '#2e8b8b');
  rect(ctx, 330, 310, 240, 10, '#6b4226');
  rect(ctx, 344, 320, 212, 130, '#2f5d50');
  rect(ctx, 344, 320, 212, 10, '#3d7a68');
  for (let i = 0; i < 3; i += 1) {
    const x = 368 + i * 64;
    rect(ctx, x, 408, 40, 42, '#b5651d');
    circle(ctx, x + 20, 392, 16, ['#ff7eb6', '#c77dff', '#ffd23c'][i]);
    circle(ctx, x + 8, 398, 10, '#ff9ecf');
    circle(ctx, x + 32, 398, 10, '#ff9ecf');
  }

  // Cobblestones and the moonlit puddle.
  rect(ctx, 0, 450, 600, 110, '#2e2140');
  ctx.fillStyle = '#3a2b52';
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      ctx.beginPath();
      ctx.ellipse(30 + col * 60 + (row % 2) * 30, 478 + row * 28, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ellipse(ctx, 430, 515, 62, 14, '#8fb8e8');
  ellipse(ctx, 430, 515, 34, 7, '#ffeec2');
}

const MARKET_DIFFS = [
  { x: 505, y: 68, r: 32, name: 'the moon' },
  { x: 270, y: 132, r: 32, name: 'a lantern' },
  { x: 120, y: 430, r: 32, name: 'the cat' },
  { x: 134, y: 392, r: 26, name: 'an orange' },
  { x: 150, y: 55, r: 26, name: 'a star' },
  { x: 93, y: 293, r: 28, name: 'awning stripe' },
  { x: 480, y: 264, r: 30, name: 'the kite' },
];

// ---------------------------------------------------------------- scene 2
// Harbour Dawn: sunrise over the sea, a lighthouse, two sailboats, gulls,
// a striped buoy, a jumping fish and a flag on the pier.
function drawHarbour(ctx, v) {
  sky(ctx, '#f7b267', '#f4845f');
  // D1: the sun wears rays in the original, none in the twin.
  circle(ctx, 120, 90, 34, '#fff3b0');
  if (v === 0) {
    ctx.strokeStyle = '#ffe66d';
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(120 + Math.cos(a) * 44, 90 + Math.sin(a) * 44);
      ctx.lineTo(120 + Math.cos(a) * 58, 90 + Math.sin(a) * 58);
      ctx.stroke();
    }
  }
  ellipse(ctx, 300, 120, 70, 20, '#ffe8d6');
  ellipse(ctx, 380, 90, 56, 16, '#ffe8d6');
  ellipse(ctx, 480, 150, 60, 16, '#ffe8d6');
  // D2: three gulls in the original, two in the twin.
  const gulls = [[240, 80], [300, 70], [360, 92]];
  for (let i = 0; i < gulls.length; i += 1) {
    if (v === 1 && i === 1) continue;
    const [x, y] = gulls[i];
    ctx.strokeStyle = '#5b3a4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.quadraticCurveTo(x - 4, y - 8, x, y);
    ctx.quadraticCurveTo(x + 4, y - 8, x + 12, y);
    ctx.stroke();
  }
  // Sea.
  rect(ctx, 0, 330, 600, 230, '#2e6f9e');
  ctx.fillStyle = '#3d84b5';
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      ctx.beginPath();
      ctx.ellipse(40 + col * 76 + (row % 2) * 38, 360 + row * 48, 30, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Pier.
  rect(ctx, 0, 300, 600, 32, '#8a5a34');
  rect(ctx, 0, 300, 600, 6, '#a06a3e');
  for (let x = 20; x < 600; x += 60) rect(ctx, x, 332, 10, 60, '#6b4226');
  // D7: a little red flag on the pier post in the original only.
  if (v === 0) {
    rect(ctx, 60, 262, 5, 40, '#5b3a1e');
    ctx.fillStyle = '#e83a34';
    ctx.beginPath();
    ctx.moveTo(65, 262);
    ctx.lineTo(95, 270);
    ctx.lineTo(65, 280);
    ctx.closePath();
    ctx.fill();
  }
  // Lighthouse.
  rect(ctx, 500, 150, 56, 152, '#f4ead8');
  rect(ctx, 500, 190, 56, 18, '#d83a34');
  rect(ctx, 500, 240, 56, 18, '#d83a34');
  rect(ctx, 496, 128, 64, 24, '#2e3a4a');
  circle(ctx, 528, 140, 10, '#ffe66d');
  // D3: the lighthouse beam shines in the original, not in the twin.
  if (v === 0) {
    ctx.fillStyle = 'rgba(255, 230, 109, 0.30)';
    ctx.beginPath();
    ctx.moveTo(496, 140);
    ctx.lineTo(360, 96);
    ctx.lineTo(360, 184);
    ctx.closePath();
    ctx.fill();
  }
  // Sailboat one (left), sailboat two (right).
  ctx.fillStyle = '#5b3a1e';
  ctx.beginPath();
  ctx.moveTo(120, 420);
  ctx.lineTo(200, 420);
  ctx.lineTo(185, 440);
  ctx.lineTo(135, 440);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 158, 350, 5, 72, '#5b3a1e');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(163, 352);
  ctx.lineTo(163, 414);
  ctx.lineTo(205, 414);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5b3a1e';
  ctx.beginPath();
  ctx.moveTo(360, 460);
  ctx.lineTo(440, 460);
  ctx.lineTo(425, 480);
  ctx.lineTo(375, 480);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 398, 392, 5, 70, '#5b3a1e');
  // D4: the second boat's sail is white in the original, red in the twin.
  ctx.fillStyle = v === 0 ? '#ffffff' : '#e83a34';
  ctx.beginPath();
  ctx.moveTo(403, 394);
  ctx.lineTo(403, 454);
  ctx.lineTo(445, 454);
  ctx.closePath();
  ctx.fill();
  // D5: the buoy's stripes are red in the original, green in the twin.
  ellipse(ctx, 250, 500, 26, 12, v === 0 ? '#d83a34' : '#2e8b57');
  rect(ctx, 238, 478, 24, 16, '#f4ead8');
  circle(ctx, 250, 474, 6, '#ffb03c');
  // D6: a fish jumps out of the sea in the original only.
  if (v === 0) {
    ctx.fillStyle = '#7ec8e8';
    ctx.beginPath();
    ctx.ellipse(430, 470, 22, 9, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(448, 462);
    ctx.lineTo(462, 452);
    ctx.lineTo(460, 470);
    ctx.closePath();
    ctx.fill();
    ellipse(ctx, 430, 492, 30, 5, '#ffffff');
  }
}

const HARBOUR_DIFFS = [
  { x: 120, y: 90, r: 34, name: 'the sun rays' },
  { x: 300, y: 70, r: 26, name: 'a gull' },
  { x: 430, y: 140, r: 34, name: 'the beam' },
  { x: 424, y: 424, r: 32, name: 'the sail' },
  { x: 250, y: 494, r: 28, name: 'the buoy' },
  { x: 440, y: 470, r: 30, name: 'the fish' },
  { x: 78, y: 272, r: 28, name: 'the flag' },
];

// ---------------------------------------------------------------- scene 3
// Moon Garden: a willow, a pond with koi, an arched bridge, a stone
// lantern, fireflies, flowers and a frog on a lily pad.
function drawGarden(ctx, v) {
  sky(ctx, '#12233d', '#1d4a3a');
  circle(ctx, 90, 80, 30, '#ffeec2');
  stars(ctx, [[200, 50, 4], [320, 40, 5], [450, 60, 4], [540, 90, 4], [260, 110, 4]]);
  // D2: five fireflies in the original, four in the twin.
  const flies = [[180, 200], [240, 160], [420, 180], [480, 240], [300, 220]];
  for (let i = 0; i < flies.length; i += 1) {
    if (v === 1 && i === 0) continue;
    const [x, y] = flies[i];
    circle(ctx, x, y, 8, 'rgba(190, 255, 120, 0.25)');
    circle(ctx, x, y, 3, '#d8ff7a');
  }
  // Willow on the left.
  rect(ctx, 36, 180, 22, 200, '#5b3a1e');
  ctx.fillStyle = '#2e7d4f';
  for (const [x, y, r] of [[60, 170, 46], [110, 200, 40], [30, 220, 36], [90, 140, 34]]) {
    circle(ctx, x, y, r, '#2e7d4f');
  }
  ctx.strokeStyle = '#3d9e63';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(50 + i * 16, 210);
    ctx.quadraticCurveTo(46 + i * 16, 280, 54 + i * 16, 320);
    ctx.stroke();
  }
  // Pond.
  ellipse(ctx, 300, 470, 190, 80, '#1d5a7a');
  ellipse(ctx, 300, 470, 160, 62, '#2a6f92');
  // D7: the moon's reflection shimmers on the pond in the original only.
  if (v === 0) ellipse(ctx, 110, 470, 34, 10, 'rgba(255, 238, 194, 0.75)');
  // Lily pads and the frog.
  ellipse(ctx, 210, 500, 34, 10, '#2e7d4f');
  ellipse(ctx, 300, 505, 40, 12, '#2e7d4f');
  ellipse(ctx, 390, 495, 30, 9, '#2e7d4f');
  // D5: the green frog sits on the middle lily pad in the original only.
  if (v === 0) {
    ellipse(ctx, 300, 492, 16, 11, '#7ee787');
    circle(ctx, 290, 482, 7, '#7ee787');
    circle(ctx, 310, 482, 7, '#7ee787');
    circle(ctx, 288, 480, 2, '#12233d');
    circle(ctx, 312, 480, 2, '#12233d');
  }
  // D1: three koi in the original, two in the twin.
  const koi = [[250, 450, '#ff8c42'], [340, 478, '#ffffff'], [180, 478, '#ffb03c']];
  for (let i = 0; i < koi.length; i += 1) {
    if (v === 1 && i === 2) continue;
    const [x, y, color] = koi[i];
    ellipse(ctx, x, y, 18, 7, color);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 16, y);
    ctx.lineTo(x + 28, y - 7);
    ctx.lineTo(x + 28, y + 7);
    ctx.closePath();
    ctx.fill();
  }
  // Arched bridge.
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(180, 400);
  ctx.quadraticCurveTo(300, 320, 420, 400);
  ctx.stroke();
  ctx.strokeStyle = '#a06a3e';
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i += 1) {
    const t = i / 6;
    const x = 180 + t * 240;
    const y = 400 - Math.sin(t * Math.PI) * 62;
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
  }
  // D6: the middle bridge plank is honey-brown in the original, red in the twin.
  ctx.strokeStyle = v === 0 ? '#c98a3e' : '#d83a34';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(300, 326);
  ctx.lineTo(300, 350);
  ctx.stroke();
  // Stone lantern on the right.
  rect(ctx, 492, 380, 36, 60, '#8a8f96');
  rect(ctx, 484, 360, 52, 20, '#6e7278');
  rect(ctx, 480, 348, 60, 12, '#8a8f96');
  // D3: the lantern's flame burns in the original, not in the twin.
  if (v === 0) {
    ellipse(ctx, 510, 352, 8, 12, '#ffb03c');
    ellipse(ctx, 510, 352, 4, 7, '#ffe66d');
  } else {
    rect(ctx, 500, 344, 20, 16, '#3a3f45');
  }
  // Flowers along the bottom.
  const flowers = [[60, 520, '#ff7eb6'], [120, 532, '#c77dff'], [470, 524, '#ffd23c'], [540, 534, '#ff7eb6']];
  for (const [x, y, color] of flowers) {
    ctx.strokeStyle = '#2e7d4f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 26);
    ctx.stroke();
    circle(ctx, x, y, 9, color);
    circle(ctx, x - 7, y + 4, 5, color);
    circle(ctx, x + 7, y + 4, 5, color);
  }
  // D4: the big flower by the willow is pink in the original, white in the twin.
  circle(ctx, 90, 505, 14, v === 0 ? '#ff7eb6' : '#ffffff');
  circle(ctx, 90, 505, 5, '#ffd23c');
}

const GARDEN_DIFFS = [
  { x: 180, y: 478, r: 28, name: 'a koi' },
  { x: 180, y: 200, r: 26, name: 'a firefly' },
  { x: 510, y: 352, r: 28, name: 'the flame' },
  { x: 90, y: 505, r: 28, name: 'a flower' },
  { x: 300, y: 490, r: 30, name: 'the frog' },
  { x: 300, y: 338, r: 28, name: 'a plank' },
  { x: 110, y: 470, r: 30, name: 'the reflection' },
];

export const SCENES = [
  { name: 'Lantern Night Market', draw: drawMarket, diffs: MARKET_DIFFS, seed: 11 },
  { name: 'Harbour Dawn', draw: drawHarbour, diffs: HARBOUR_DIFFS, seed: 22 },
  { name: 'Moon Garden', draw: drawGarden, diffs: GARDEN_DIFFS, seed: 33 },
];
