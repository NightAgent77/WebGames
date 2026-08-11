# Web Games — Agent Log

Living record of every add-on and change in this folder.  
**Agents must update this file whenever they add, change, remove, or restructure anything here.**

---

## How to log a change

Add a new entry at the **top** of the Changelog (newest first):

```markdown
### YYYY-MM-DD — Short title
- **What:** one-line summary
- **Why:** reason / goal
- **Where:** paths or areas touched
- **Notes:** anything a future agent should know (optional)
```

Rules:
- One entry per meaningful change set (not every tiny edit mid-task).
- Be concrete: name games, files, and behaviors — not vague “updates.”
- If you create a new game/add-on, start an entry under **Add-ons** as well.
- Do not delete old entries; append/prepend only.

---

## Add-ons

Catalog of games and features in this folder. Update when something new ships or is removed.

| Name | Path | Status | Notes |
|------|------|--------|-------|
| Snake Run | `snake-run/` | Playable scaffold | Phaser 3.90 + Vite 6; 4:3 (1024×768); keyboard + mouse |

---

## Changelog

### 2026-08-11 — Snake Run aspect ratio → 4:3
- **What:** Changed game canvas from portrait 720×1280 to landscape 1024×768 (4:3)
- **Why:** Match requested aspect ratio while keeping FIT + CENTER_BOTH scaling
- **Where:** `snake-run/src/main.js`
- **Notes:** Scene layouts use scale width/height, so UI adapts without a full rewrite

### 2026-08-11 — Add Snake Run (Phaser 3 + Vite)
- **What:** New endless-runner web game: snake steers between lanes to avoid obstacles
- **Why:** First game in the Web Games portfolio folder
- **Where:** `snake-run/` (`src/scenes/*`, `src/main.js`, `assets/`, `index.html`, `vite.config.js`)
- **Notes:** Responsive `Scale.FIT` + `CENTER_BOTH`; relative `./assets/...` paths; Boot → Preload (progress bar) → Menu → Game → GameOver. Controls: ←→ / A D / mouse. Run with `npm run dev` inside `snake-run/`.

### 2026-08-11 — Create agent.md
- **What:** Added `agent.md` as the project’s agent log for every add-on and change
- **Why:** Keep a durable record so future agents know what exists and what changed
- **Where:** `agent.md`, `.cursor/rules/update-agent-md.mdc`
- **Notes:** Empty Web Games workspace; no games yet
