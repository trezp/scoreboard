// Minimal JS to power the scoreboard interactions.
(function () {
  const state = {
    A: 0,
    B: 0,
    history: [],
    timeSeconds: 12 * 60,
    timerId: null,
  };

  // DOM elements
  const scoreA = document.getElementById("scoreA");
  const scoreB = document.getElementById("scoreB");
  const timeDisplay = document.getElementById("timeDisplay");
  const period = document.getElementById("period");
  const resetBtn = document.getElementById("resetBtn");
  const undoBtn = document.getElementById("undoBtn");

  // Utils
  function render() {
    scoreA.textContent = state.A;
    scoreB.textContent = state.B;
    timeDisplay.textContent = formatTime(state.timeSeconds);
  }

  function formatTime(s) {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return mm + ":" + ss;
  }

  // Wire up buttons
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const team = btn.dataset.team;
      const action = btn.dataset.action;
      if (action === "inc") addPoints(team, 1);
      if (action === "big") addPoints(team, 3);
    });
  });

  function addPoints(team, points) {
    state.history.push({ team, points });
    state[team] += points;
    render();
  }

  undoBtn.addEventListener("click", () => {
    const last = state.history.pop();
    if (!last) return;
    state[last.team] -= last.points;
    if (state[last.team] < 0) state[last.team] = 0;
    render();
  });

  resetBtn.addEventListener("click", () => {
    state.A = 0;
    state.B = 0;
    state.history = [];
    state.timeSeconds = 12 * 60;
    render();
  });

  // Simple countdown timer (start/stop on click)
  const timerArea = timeDisplay;
  timerArea.addEventListener("click", () => {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
      timerArea.style.opacity = 1;
      return;
    }
    state.timerId = setInterval(() => {
      if (state.timeSeconds > 0) {
        state.timeSeconds -= 1;
        render();
      } else {
        clearInterval(state.timerId);
        state.timerId = null;
      }
    }, 1000);
    timerArea.style.opacity = 0.95;
  });

  // initial render
  render();

  // Accessibility: keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "a") addPoints("A", 1);
    if (e.key === "s") addPoints("A", 3);
    if (e.key === "k") addPoints("B", 1);
    if (e.key === "l") addPoints("B", 3);
    if (e.key === "u") undoBtn.click();
    if (e.key === "r") resetBtn.click();
  });
})();
