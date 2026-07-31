# Focus Flow

A minimal, browser-based Pomodoro-style focus timer. No build step, no dependencies — just open it and start a session.

Repository: https://github.com/robyntjiesnathan-hash/focus-flow

## Features

- **Three modes** — Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Animated progress ring** that fills as time counts down
- **Session log** with a timestamp for every completed session
- **Daily stats** — sessions completed and total focus minutes, tracked per day
- **Browser notifications** when a session finishes (if permission is granted)
- **Persistent state** via `localStorage`, so your stats survive a page reload

## Usage

Just open `index.html` in a browser — no build tools or server required.

If you'd rather serve it locally (e.g. for notifications to work reliably in some browsers):

```bash
npx serve .
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App markup and layout |
| `style.css` | Entry point that imports the files below |
| `styles/tokens.css` | Color/shadow/radius custom properties, incl. dark theme |
| `styles/base.css` | Reset, page layout, heading |
| `styles/timer.css` | Mode tabs, progress ring, time display, buttons |
| `styles/stats-log.css` | Stats cards and session log |
| `script.js` | Entry point that imports the modules below |
| `js/dom.js` | Element references and shared constants |
| `js/storage.js` | `localStorage` persistence, stats and log rendering |
| `js/timer.js` | Timer state machine, chime, notifications, event wiring |
