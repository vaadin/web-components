---
name: nvda-check
description: Run a key sequence on a dev page with NVDA through Guidepup and print what NVDA says. Use when asked to check, verify or compare an NVDA announcement for a component in Chrome or Firefox, or to confirm a screen reader fix on a dev page. Windows only. Not for axe checks or the Chromium accessibility tree.
argument-hint: '<dev page> [--focus <regex>] [--steps <key,key,...>] [--browser chrome|firefox]'
---

# NVDA Check

This skill runs one key sequence on one dev page with NVDA and prints the phrases. It adapts the `sr-run` skill of the cleanslate repository to the monorepo.

## Gotchas

- **Platform**: NVDA runs on Windows only. Check the platform before the first command.
- **Free machine**: a run takes the keyboard and the screen. Ask the user to confirm Do Not Disturb and a free machine first.
- **One run per shell call**: in a shell loop, the runs after the first cannot bring the browser to the front, and NVDA reads the terminal. Never run NVDA in the background or in a loop.
- **Leftovers**: a stopped run can leave NVDA, a browser or the shell that started them running. Before the next run, check `Get-Process nvda` and close the leftover processes. Close only the browsers that a run started: Playwright Chrome has `--disable-background-networking` in its command line.
- **Start mode**: NVDA can start in browse mode or in focus mode. Start the steps with `NVDA+browse` or `NVDA+focus`, not `NVDA+Space`.
- **Mode phrases**: the script turns the mode beep off, so a phrase "Focus mode" or "Browse mode" marks a mode change.
- **Browse mode keys**: in browse mode, NVDA takes the arrow keys and the letters. A letter then logs a phrase such as "no next separator".
- **Escape in a popup**: with focus inside a popup in the page, the first <kbd>Escape</kbd> only switches NVDA to browse mode. The page gets the second one. A native `<select>` closes on the first press.
- **Spoken form**: `--focus` matches the spoken form. NVDA says "A 1" for "A1".
- **Late phrase**: a short or empty phrase moves to the next step. Repeat such a run.

## Setup

Run this once per machine.

1. Install Google Chrome and Firefox.
2. Run `npx @guidepup/setup install`. It downloads a portable NVDA with the Guidepup add-on to `%LOCALAPPDATA%\guidepup\`.

Guidepup starts NVDA with its own config, so an installed NVDA and its settings do not apply.

## Steps

### 1. Start the dev server

1. If the user runs `yarn start`, use its origin. The default is `http://localhost:8000`.
2. Otherwise, run `npx web-dev-server --node-resolve` in the background. It serves on port 8000.
3. Check that the page exists in `dev/`. For a theme, add `?theme=lumo` or `?theme=aura` to `--page`.

### 2. Run

```sh
node .claude/skills/nvda-check/scripts/nvda.mjs --page select.html --focus "combo box" --steps ArrowDown,ArrowDown,Enter
```

1. Run one command per shell call, in the foreground.
2. Put the focus report, `NVDA+Tab`, last.
3. To keep the log, pass `--out` with a path outside the repository.

The script header lists the options and the step syntax.

### 3. Read

1. Read the table that the script prints. NVDA puts a period between the speech sequences and a comma between the fields.
2. Quote the phrases. Never paraphrase them.
3. To compare a change, run the same steps on both branches or pages.
4. Delete the temporary pages in `dev/`.

## Troubleshooting

- **"No window ... in front"**: the log lists what NVDA read for each attempt. "Start" or "Search" means a Windows popup kept the focus. The activation closes it on the next attempt. A terminal title means a run in a loop or in the background.
- **Tab presses reach the browser toolbar**: the focus is in the browser frame, not the page. Check that no other key press reached the browser before the run.
