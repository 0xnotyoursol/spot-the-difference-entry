# Lantern Market — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/0xnotyoursol/spot-the-difference-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/0xnotyoursol/spot-the-difference-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two near-identical pictures, seven hidden differences, one ticking clock. **Lantern Market** is a complete spot-the-difference game in plain HTML, CSS and JavaScript — no libraries, no network, every pixel drawn in code.

Three hand-drawn scenes, seven differences each: a lantern-lit night market, a harbour at dawn, and a moonlit garden with koi. Click a difference on either picture to ring it in gold; the counter up top always shows how many are found and how many are still to go. A wrong click costs 25 points, a hint (H) costs 50, and clearing a round banks a time bonus. Find all 21 and the lanterns light up the win screen.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `game/index.html` directly in a desktop browser — the game is static files and plays offline. Node 22.18+ runs the entrypoint:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How to play

- **Click** a difference on either picture — a gold ring marks it on both sides.
- **Space** starts and advances, **H** hints at a hidden difference, **P** pauses, **R** retries the round, **M** mutes the chimes.
- 120 seconds per round, 7 differences per round, 3 rounds. Clear all three to win.

## Screenshots

Real renders of the game's own code, staged through `?shot=` (`shots.json`): the title screen, mid-round with three differences ringed and four still hidden, the harbour round in progress, and the win screen.

---

<sub>Entered on [make.fun](https://make.fun/?ref=cpetny9f&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
