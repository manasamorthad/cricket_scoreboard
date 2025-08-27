# Cricket Scoreboard Web Application

## Overview
This is a responsive Cricket Scoreboard web application built with plain **HTML**, **CSS**, and **JavaScript** for the Enterprise Application Development assignment.

It simulates scoring for two players — **Rahul** and **Rohit** — and supports runs, extras, wickets, overs counting, striker switching, free hits, and reset functionality.


## Files
- `index.html` — UI structure
- `styles.css` — Styling & responsive layout
- `script.js` — All scoring logic and interactions
- `README.md` — This file

## How to run
1. Place all files in a single folder.
2. Open `index.html` in a modern browser, or use VS Code Live Server for testing.
3. Click buttons to update score. Use Reset to clear.

## Key implementation notes
- **Runs (1,2,3,4,6):** add to team and striker; valid deliveries increment ball.
- **Odd runs (1 or 3):** automatically switch striker.
- **Wide:** +1 to team, no ball increment.
- **No Ball:** +1 to team and striker, no ball increment.
- **Bye / Leg Bye:** +1 to team, counts as a valid delivery (increments ball).
- **Free Hit:** pressing the Free Hit button adds +1 to team and sets the next delivery as a free hit — meaning: the next valid delivery will not increment the ball and no wicket will be permitted on that next delivery.
- **Wicket / LBW:** increment wicket (max 10), mark striker out, set Rahul as new striker; ignored during a free hit.
- **Overs:** After 6 valid balls the over count increments and ball count resets.
- **Reset:** resets everything to initial state; Rahul is initial striker.

## Assumptions & Clarifications
- After a wicket, per assignment instruction, Rahul is set as the striker (simulates new batsman).
- Free Hit behavior implemented per assignment: pressing the Free Hit button adds 1 run and flags the *next* delivery as a free hit (no wickets, and the next delivery will not increment the ball count).
- No external libraries were used.

## Author
Prepared as a complete solution for the assignment. Use this code to learn and adapt — do not attempt to evade any academic checks.

