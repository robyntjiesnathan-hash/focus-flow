import { sessionCountEl, totalMinutesEl, logList } from "./dom.js";

const todayKey = () => new Date().toISOString().slice(0, 10);

export function loadState() {
  const raw = localStorage.getItem("focusFlow:" + todayKey());
  return raw ? JSON.parse(raw) : { sessions: 0, minutes: 0, log: [] };
}

export function saveState(state) {
  localStorage.setItem("focusFlow:" + todayKey(), JSON.stringify(state));
}

export function renderStats() {
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

export function addLogEntry(type, totalSeconds) {
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
