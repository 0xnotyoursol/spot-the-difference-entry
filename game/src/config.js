// Lantern Market — Spot the Difference: tuning and layout constants.
// One file holds every number the rest of the game shares, so a balance
// change (timer, points, panel size) is a one-line edit here.
export const FIELD = { width: 1280, height: 720 };

// The two picture panels, in field coordinates. Each scene is drawn in a
// 600x560 scene space and translated into its panel; a click inside either
// panel maps back to the same scene coordinates, so a difference can be
// spotted on either side.
export const PANEL = { width: 600, height: 560, y: 84, gap: 40 };
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = PANEL_LEFT_X + PANEL.width + PANEL.gap;
export const HUD_HEIGHT = 76;
export const FOOTER_Y = 652;

export const GAME = {
  differencesPerRound: 7,
  rounds: 3,
  secondsPerRound: 120,
  pointsPerFind: 100,
  timeBonusPerSecond: 5,
  wrongClickPenalty: 25,
  hintCost: 50,
  maxHintsPerRound: 3,
  // Click tolerance in scene pixels around a difference centre.
  findRadius: 34,
  // A wrong click flashes a red cross for this long (seconds).
  missFlashSeconds: 0.7,
  // A found difference rings for this long before settling (seconds).
  ringSeconds: 0.9,
};

export const FONT = "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif";

export const PALETTE = {
  backdrop: '#171226',
  hud: '#241b3d',
  hudLine: '#3d2f66',
  text: '#fff7e6',
  muted: '#cbbcf0',
  gold: '#ffc93c',
  goldDark: '#e09e00',
  green: '#7ee787',
  red: '#ff6b6b',
  panelFrame: '#4a3670',
  panelFrameFound: '#ffc93c',
  button: '#6c4fd8',
  buttonHover: '#7d63e0',
};
