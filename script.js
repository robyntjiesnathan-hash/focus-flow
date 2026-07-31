const RADIUS = 108;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const modeButtons = document.querySelectorAll(".mode-btn");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const ringProgress = document.querySelector(".ring-progress");
const ringWrap = document.querySelector(".ring-wrap");
const sessionCountEl = document.getElementById("sessionCount");
const totalMinutesEl = document.getElementById("totalMinutes");
const logList = document.getElementById("logList");
const clearLogBtn = document.getElementById("clearLog");

ringProgress.style.strokeDasharray = `${CIRCUMFERENCE}`;

let mode = "focus";
let totalSeconds = 25 * 60;
let secondsLeft = totalSeconds;
let running = false;
let timerId = null;

const todayKey = () => new Date().toISOString().slice(0, 10);

function loadState() {
  const raw = localStorage.getItem("focusFlow:" + todayKey());
  return raw ? JSON.parse(raw) : { sessions: 0, minutes: 0, log: [] };
}

function saveState(state) {
  localStorage.setItem("focusFlow:" + todayKey(), JSON.stringify(state));
}

function renderStats() {
  const state = loadState();
  sessionCountEl.textContent = state.sessions;
  totalMinutesEl.textContent = state.minutes;
  logList.innerHTML = "";
  state.log.slice().reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="log-type">${entry.type}</span><span>${entry.time}</span>`;
    logList.appendChild(li);
  });
}

function addLogEntry(type) {
  const state = loadState();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  state.log.push({ type, time });
  if (type === "Focus") {
    state.sessions += 1;
    state.minutes += Math.round(totalSeconds / 60);
  }
  saveState(state);
  renderStats();
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function updateDisplay() {
  timeEl.textContent = formatTime(secondsLeft);
  const progress = 1 - secondsLeft / totalSeconds;
  ringProgress.style.strokeDashoffset = `${CIRCUMFERENCE * progress}`;
}

function setMode(newMode, minutes) {
  mode = newMode;
  pause();
  totalSeconds = minutes * 60;
  secondsLeft = totalSeconds;
  statusEl.textContent = "Ready";
  ringWrap.classList.toggle("break-mode", mode !== "focus");
  modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
  updateDisplay();
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    /* audio unsupported, ignore */
  }
}

function tick() {
  secondsLeft -= 1;
  updateDisplay();
  if (secondsLeft <= 0) {
    complete();
  }
}

function notify(label) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const body = mode === "focus" ? "Time for a break." : "Time to get back to focus.";
  new Notification(`${label} session complete`, { body });
}

function complete() {
  pause();
  playChime();
  const label = mode === "focus" ? "Focus" : mode === "short" ? "Short Break" : "Long Break";
  addLogEntry(label);
  notify(label);
  statusEl.textContent = "Done!";
  secondsLeft = 0;
  updateDisplay();
}

function start() {
  if (running) return;
  running = true;
  startPauseBtn.textContent = "Pause";
  statusEl.textContent = mode === "focus" ? "Focusing" : "On Break";
  timerId = setInterval(tick, 1000);
}

function pause() {
  running = false;
  clearInterval(timerId);
  startPauseBtn.textContent = "Start";
  if (statusEl.textContent === "Focusing" || statusEl.textContent === "On Break") {
    statusEl.textContent = "Paused";
  }
}

function reset() {
  pause();
  secondsLeft = totalSeconds;
  statusEl.textContent = "Ready";
  updateDisplay();
}

startPauseBtn.addEventListener("click", () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  if (secondsLeft <= 0) reset();
  running ? pause() : start();
});

resetBtn.addEventListener("click", reset);

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setMode(btn.dataset.mode, Number(btn.dataset.minutes));
  });
});

clearLogBtn.addEventListener("click", () => {
  saveState({ sessions: 0, minutes: 0, log: [] });
  renderStats();
});

setMode("focus", 25);
renderStats();
