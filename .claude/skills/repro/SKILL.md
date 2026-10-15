---
name: repro
description: Reproduce a Vaadin web component bug from a GitHub issue in vaadin/web-components. Builds a minimal dev-page reproduction, confirms the bug in a running browser with playwright-cli, points at the likely root cause, pushes a shareable repro/<issue> branch, and (after confirmation) posts a verification-pending summary comment on the issue.
argument-hint: <issue-url>
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(gh:*), Bash(yarn:*), Bash(playwright-cli:*), Bash(npx:*), Bash(git:*), Bash(curl:*), Bash(lsof:*), Bash(kill:*)
---

You are a tester reproducing a Vaadin web component bug. Input `$0` is a GitHub issue URL in `vaadin/web-components`. Work the phases in order. **Never claim a bug is reproduced until you have seen it in a running browser.**

Detailed instructions live in references — read each one the **first time** a phase needs it. They stay in context: on later runs in the same session, do not re-read them.

| Reference | Covers |
| --- | --- |
| [`references/issue-analysis.md`](references/issue-analysis.md) | Phase 1 in full |
| [`references/reproduce.md`](references/reproduce.md) | Phases 2–3: dev page, dev server, maintenance branches |
| [`references/verify.md`](references/verify.md) | browser-observation discipline |
| [`references/share.md`](references/share.md) | Phases 4–6 and cleanup |

## Phase 0 — Setup (once per session)

- Resolve `<ROOT>` = `git rev-parse --show-toplevel` (this web-components checkout). Prefix every later command with absolute paths (`git -C <ROOT> …`) — env vars don't persist between shell calls.
- Optional sibling checkout, used only for root-cause pointers: `<FC_ROOT>` = `<dirname of ROOT>/flow-components` (the Flow integration layer). When absent, note it and read that source on GitHub instead (`gh api` / permalinks).
- Preflight: `playwright-cli --version 2>/dev/null || npx --no-install playwright-cli --version 2>/dev/null` (if neither prints a version, stop and ask the user to run `npm install -g @playwright/cli@latest && playwright-cli install --skills`, resume once confirmed) and `gh auth status`.
- Record the starting branch and `git status --porcelain` as the **baseline** — cleanup compares against it, not against an empty tree.

Skip all of this when already done earlier in this session.

## Phase 1 — Understand the bug

Follow issue-analysis.md: fetch issue + comments in one `gh` call, note the affected version, **classify the regression** (`worked in <ver> / broke in <ver>` | `not a regression` | `unknown`), resolve every named component to its real source, run **fix archaeology** on old issues, write the hypothesis line — **"The bug is X, triggered by Y, observable as Z"** — and search for duplicates.

## Phase 2 — Build the reproduction

The smallest page that exercises the hypothesis, starting from the reporter's example, named after the issue (never overwrite an existing file): `dev/repro-<issue>.html` per reproduce.md. Give elements `id`s for playwright targeting, and prefer a **minimal pair**: the failing case plus a control that isolates the trigger.

## Phase 3 — Run and reproduce

1. Start the dev server in the background and confirm readiness per reproduce.md — pick the theme variant (`base` / `lumo` / `aura`) that matches the issue. The server does **not** hot-reload: after editing the page, reload it in the browser — no server restart needed.
2. Drive the browser per verify.md. Look for the exact signal Z; the verdict comes from what you **saw** — snapshot, console, screenshot — not the issue text.
3. **Iterate before concluding "not reproduced"** — the trigger is often precise (gesture, attach/detach cycle, property combination, timing). Record every attempted variation.
4. Minimize, re-verify after each removal, and capture the demo artifact: screenshot for static failures, short video for motion (recipes in verify.md).

## Phase 4 — Report

Fill `assets/summary-template.md` → `<ROOT>/repro-<issue>-summary.md` with **every** field. Chat reply = verdict + regression + branch + 3–5 essential bullets + pointer to the file; do **not** restate the full summary. Details in share.md.

## Phase 5 — Locate the root cause

Point at the suspected cause as a **permalink pinned to a commit SHA** (format in share.md), searching the layer the evidence implicates — the component's `packages/<component>/src/`, shared mixins, or theme packages (repo layout is in the root CLAUDE.md). If the bug only manifests through the Flow integration, say so and point at `vaadin/flow-components` source (read it at `<FC_ROOT>` when present, otherwise on GitHub) — reproducing there is out of scope. Don't fix the bug unless asked.

## Phase 6 — Decide the disposition (always ask)

**End every run with an `AskUserQuestion` — never a prose "want me to…?".** Options per verdict are in share.md. Never close an issue yourself.

## Cleanup

Follow share.md. Not reproduced → no branch: archive the scaffold to your scratchpad, delete it from the repo.
