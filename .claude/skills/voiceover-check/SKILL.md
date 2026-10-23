---
name: voiceover-check
description: Run a key sequence on a dev page with VoiceOver through Guidepup and print what VoiceOver says. Use when asked to check, verify or compare a VoiceOver announcement for a component in Safari or Chrome, or to confirm a screen reader fix on a dev page. macOS only. Not for axe checks or the Chromium accessibility tree.
argument-hint: '<dev page> [--focus <regex>] [--steps <key,key,...>] [--browser safari|chrome]'
---

# VoiceOver Check

This skill runs one key sequence on one dev page with VoiceOver and prints the phrases. It adapts the `sr-run` skill of the cleanslate repository to the monorepo.

## Gotchas

- **Platform**: VoiceOver runs on macOS only. Check the platform before the first command.
- **Free machine**: a run takes the keyboard and the screen. Ask the user to confirm Do Not Disturb and a free machine first.
- **Phrase clean-up**: Guidepup folds runs of whitespace into one space. The `raw` column keeps the VoiceOver phrase as it is.
- **Caption panel**: the caption panel can show commas and line breaks that the phrase does not have. Quote the phrase.
- **Silent step**: a silent step repeats the previous phrase.
- **Open announcement**: the phrase log misses the option announcement on open. Use the item text.
- **Late phrase**: a short or empty phrase moves to the next step. Repeat such a run.
- **Safari tabs**: each run opens a new Safari tab. The script quits only a Safari that it started.
- **Page changes**: Safari blocks `do JavaScript` from Apple Events. To try a DOM or CSS change, write a temporary page in `dev/`.
- **Playwright WebKit**: its accessibility tree can differ from Safari. Check Safari for a VoiceOver question.

## Setup

Run this once per machine. VoiceOver Utility and the Guidepup cache keep it.

1. Quit VoiceOver.
2. In VoiceOver Utility, General, tick "Allow VoiceOver to be controlled with AppleScript".
3. In System Settings, Privacy and Security, add the terminal app to Accessibility and to Full Disk Access.
4. Run `npx @guidepup/setup setup --macos-ignore-tcc-db`.
5. Run `npx @guidepup/setup install`. It downloads the VoiceOver profile to `~/Library/Caches/guidepup/`.
6. Allow the Automation prompts for VoiceOver, Safari and System Events on the first run.

## Steps

### 1. Start the dev server

1. If the user runs `yarn start`, use its origin. The default is `http://localhost:8000`.
2. Otherwise, run `npx web-dev-server --node-resolve` in the background. It serves on port 8000.
3. Check that the page exists in `dev/`.

### 2. Run

```sh
node .claude/skills/voiceover-check/scripts/voiceover.mjs --page select.html --focus "combo box" --steps ArrowDown,ArrowDown,Enter
```

1. Run one command per shell call.
2. Put the focus report, `VO+describeItemWithKeyboardFocus`, last.
3. To keep the log, pass `--out` with a path outside the repository.

The script header lists the options and the step syntax.

### 3. Read

1. Read the table that the script prints. The `raw` column is the last VoiceOver phrase of the step.
2. Quote the phrases. Never paraphrase them.
3. To compare a change, run the same steps on both pages.
4. Delete the temporary pages in `dev/`.
