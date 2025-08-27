// script.js — Cricket Scoreboard Assignment
// No external libraries. Clean, commented code implementing the required logic.

(() => {
  'use strict';

  // ----- State -----
  const state = {
    runs: 0,
    wickets: 0,              // max 10
    validBalls: 0,           // counts only valid deliveries
    freeHitNext: false,      // If true, next valid delivery is a Free Hit (no wicket, no ball increment)
    striker: 'Rahul',        // 'Rahul' | 'Rohit'
    players: {
      Rahul: { runs: 0, out: false },
      Rohit: { runs: 0, out: false }
    }
  };

  // ----- Helpers -----
  const $ = (sel) => document.querySelector(sel);

  const els = {
    teamScore: $('#team-score'),
    overs: $('#overs'),
    rahulCard: $('#rahul-card'),
    rohitCard: $('#rohit-card'),
    rahulRuns: $('#rahul-runs'),
    rohitRuns: $('#rohit-runs'),
    rahulStrike: $('#rahul-strike'),
    rohitStrike: $('#rohit-strike'),
    rahulStatus: $('#rahul-status'),
    rohitStatus: $('#rohit-status'),
    freeHitPill: $('#free-hit-pill'),
    messages: $('#messages'),

    wicketBtn: $('#wicket-btn'),
    lbwBtn: $('#lbw-btn'),
    wideBtn: $('#wide-btn'),
    noBallBtn: $('#noball-btn'),
    freeHitBtn: $('#freehit-btn'),
    byeBtn: $('#bye-btn'),
    legByeBtn: $('#legbye-btn'),
    switchBtn: $('#switch-btn'),
    resetBtn: $('#reset-btn')
  };

  // Utility to format overs as X.Y where Y in [0..5]
  function formatOvers(validBalls) {
    const overs = Math.floor(validBalls / 6);
    const balls = validBalls % 6;
    return `${overs}.${balls}`;
  }

  function setMessage(msg, isError = false) {
    els.messages.textContent = msg;
    els.messages.style.color = isError ? '#ef9a9a' : 'var(--success)';
    if (!msg) return;
    // Clear after 3 seconds
    window.clearTimeout(setMessage._t);
    setMessage._t = window.setTimeout(() => { els.messages.textContent = ''; }, 3000);
  }

  function updateStrikeFlags() {
    const rahulIsStriker = state.striker === 'Rahul';
    els.rahulStrike.hidden = !rahulIsStriker;
    els.rohitStrike.hidden = rahulIsStriker;

    els.rahulCard.classList.toggle('striker', rahulIsStriker);
    els.rohitCard.classList.toggle('striker', !rahulIsStriker);
  }

  function updateStatuses() {
    els.rahulStatus.textContent = state.players.Rahul.out ? 'Out' : 'On field';
    els.rohitStatus.textContent = state.players.Rohit.out ? 'Out' : 'On field';
  }

  function render() {
    els.teamScore.textContent = `${state.runs}/${state.wickets}`;
    els.overs.textContent = `${formatOvers(state.validBalls)} Overs`;
    els.rahulRuns.textContent = state.players.Rahul.runs;
    els.rohitRuns.textContent = state.players.Rohit.runs;
    updateStrikeFlags();
    updateStatuses();
    els.freeHitPill.hidden = !state.freeHitNext;

    // Disable wicket buttons if 10 wickets down
    const inningsOver = state.wickets >= 10;
    [els.wicketBtn, els.lbwBtn].forEach(btn => btn.disabled = inningsOver);
    // You could also disable run/extras if you want to freeze, but the spec only limits wickets
  }

  function switchStriker() {
    state.striker = state.striker === 'Rahul' ? 'Rohit' : 'Rahul';
  }

  function incrementValidBallIfNeeded() {
    // Per spec: valid deliveries (runs, wickets, LBW, bye, leg bye) increment ball
    // BUT: if next delivery is Free Hit, then "no wickets or ball increment on the next delivery"
    if (state.freeHitNext) {
      // Consume the free hit benefit on this delivery, do not increment ball
      state.freeHitNext = false;
      return;
    }
    state.validBalls += 1;
  }

  // ----- Event Handlers -----

  // Runs: 1,2,3,4,6  -> add to team and striker; odd runs switch striker; increments ball (unless free hit suppresses increment)
  function handleRun(n) {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += n;
    const striker = state.striker;
    state.players[striker].runs += n;

    // Ball count for a run is a valid delivery
    incrementValidBallIfNeeded();

    // Odd runs switch strike
    if (n % 2 === 1) switchStriker();

    render();
  }

  // Wicket (or LBW): increment wicket (max 10), mark current striker out (remove asterisk), set Rahul as new striker, increment ball (unless free hit suppresses both)
  function handleWicket(kind = 'Wicket') {
  if (state.wickets >= 10) {
    setMessage('Max 10 wickets reached — innings closed.', true);
    return;
  }

  if (state.freeHitNext) {
    // On free hit: no wicket and no ball increment (consumed)
    state.freeHitNext = false;
    setMessage(`${kind} attempted on Free Hit: Not out.`);
    render();
    return;
  }

  state.wickets = Math.min(10, state.wickets + 1);

  // Mark current striker as out
  state.players[state.striker].out = true;

  // Ball consumed
  incrementValidBallIfNeeded();

  // Per spec: After dismissal, Rahul is always the new striker
  state.striker = 'Rahul';

  // Simulate a "new batsman Rahul" if Rahul himself got out
  if (state.players.Rahul.out) {
    state.players.Rahul = { runs: 0, out: false };
  }

  render();
}


  // Wide: +1 team, no player run, no ball increment
  function handleWide() {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += 1;
    // no ball increment
    render();
  }

  // No Ball: +1 team AND +1 striker, no ball increment
  function handleNoBall() {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += 1;
    state.players[state.striker].runs += 1;
    // No striker switch mentioned for no-ball single in the spec
    render();
  }

  // Free Hit: +1 team, sets NEXT valid delivery as free hit (no wicket, no ball increment on that next delivery)
  function handleFreeHit() {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += 1;
    state.freeHitNext = true;
    render();
  }

  // Bye: +1 team, no player run, increments ball (unless free hit blocks), odd run -> switch strike
  function handleBye() {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += 1;
    incrementValidBallIfNeeded();
    // odd run: switch strike (applies for running between wickets)
    switchStriker();
    render();
  }

  // Leg Bye: +1 team, no player run, increments ball (unless free hit blocks), odd run -> switch strike
  function handleLegBye() {
    if (state.wickets >= 10) {
      setMessage('Max 10 wickets reached — innings closed.', true);
      return;
    }
    state.runs += 1;
    incrementValidBallIfNeeded();
    switchStriker();
    render();
  }

  // Switch striker manually
  function handleSwitch() {
    switchStriker();
    render();
  }

  function handleReset() {
    state.runs = 0;
    state.wickets = 0;
    state.validBalls = 0;
    state.freeHitNext = false;
    state.striker = 'Rahul';
    state.players.Rahul = { runs: 0, out: false };
    state.players.Rohit = { runs: 0, out: false };
    setMessage('Reset complete.');
    render();
  }

  // ----- Wire up UI -----
  function init() {
    // Run buttons
    document.querySelectorAll('[data-run]')
      .forEach(btn => btn.addEventListener('click', () => handleRun(parseInt(btn.dataset.run, 10))));

    els.wicketBtn.addEventListener('click', () => handleWicket('Wicket'));
    els.lbwBtn.addEventListener('click', () => handleWicket('LBW'));

    els.wideBtn.addEventListener('click', handleWide);
    els.noBallBtn.addEventListener('click', handleNoBall);
    els.freeHitBtn.addEventListener('click', handleFreeHit);
    els.byeBtn.addEventListener('click', handleBye);
    els.legByeBtn.addEventListener('click', handleLegBye);

    els.switchBtn.addEventListener('click', handleSwitch);
    els.resetBtn.addEventListener('click', handleReset);

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
