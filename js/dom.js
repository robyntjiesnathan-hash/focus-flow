export const RADIUS = 108;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const modeButtons = document.querySelectorAll(".mode-btn");
export const timeEl = document.getElementById("time");
export const statusEl = document.getElementById("status");
export const startPauseBtn = document.getElementById("startPause");
export const resetBtn = document.getElementById("reset");
export const ringProgress = document.querySelector(".ring-progress");
export const ringWrap = document.querySelector(".ring-wrap");
export const sessionCountEl = document.getElementById("sessionCount");
export const totalMinutesEl = document.getElementById("totalMinutes");
export const logList = document.getElementById("logList");
export const clearLogBtn = document.getElementById("clearLog");

ringProgress.style.strokeDasharray = `${CIRCUMFERENCE}`;
