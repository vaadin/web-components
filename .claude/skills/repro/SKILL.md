---
name: repro
description: Reproduce a bug in Vaadin web components or Flow components from a GitHub issue link or a plain-text description. Fetches the issue, builds a minimal reproduction (a dev/*.html page for web components, or an integration-test View for Flow components), runs it, drives the browser with playwright-cli to confirm the bug, points at the likely root cause, pushes a shareable repro/<issue> branch, and (after confirmation) posts a verification-pending summary comment on the issue.
argument-hint: <issue-url | bug description>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(gh:*), Bash(yarn:*), Bash(mvn:*), Bash(playwright-cli:*), Bash(npx:*), Bash(git:*), Bash(curl:*)
---

You are a tester reproducing a bug in Vaadin web components or Flow components. Input `$0` is a GitHub issue URL or a plain-text bug description. Work the phases in order. Never claim a bug is reproduced until you have seen it in a running browser.

## Repositories

The two repos are sibling folders. Your working directory at launch is the skill folder, not a repo root — relative paths break and env vars don't persist between shell calls. Resolve absolute roots once and use literal paths after:

```bash
git rev-parse --show-toplevel        # → WC_ROOT: the web-components checkout (this skill lives inside it)
# FLOW_ROOT is the sibling: <dirname of WC_ROOT>/flow-components
```

Prefix later commands accordingly (`git -C <WC_ROOT> …`, write to `<FLOW_ROOT>/…`).

| Flavor | Repo root | Reproduce with | Run with |
| --- | --- | --- | --- |
| Web component (Lit) | `<WC_ROOT>` (this checkout) | a new `dev/*.html` page | `yarn start` (web-dev-server, port 8000) |
| Flow component (Java) | `<FLOW_ROOT>` (sibling) | a new integration-test `View` | `mvn jetty:run` (port 8080) |

**Reproduce in the flavor matching the issue's repository; reproduce a `flow-components` issue on the Flow side first.** Flow adds behavior the web component never runs alone — lazy `DataProvider` loading, server-side filtering, value sync across the round-trip, attach/detach. A plain `dev/*.html` page misses it and gives a false negative. Fall back to the other flavor only after the first genuinely fails (Phase 3) and the root cause clearly lies there; note any cross-over in the report.

## Preflight — required tooling

Reproduction is only valid when observed in a running browser via `playwright-cli`. Check it before any other work, so you fail fast:

```bash
playwright-cli --version 2>/dev/null || npx --no-install playwright-cli --version 2>/dev/null
```

Use whichever form prints a version (`playwright-cli` or `npx playwright-cli`) in all later commands. If neither works, stop and ask the user to install it, then resume only once they confirm:

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills   # registers the browser-automation reference
```

## Phase 1 — Understand the bug

1. **Issue URL** (`github.com/vaadin/<repo>/issues/<n>`): fetch body and comments as JSON (`gh issue view --comments` prints nothing non-interactively):
   ```bash
   gh issue view <n> --repo vaadin/<repo> --json number,title,state,body,labels
   gh issue view <n> --repo vaadin/<repo> --json comments --jq '.comments[] | .author.login + ": " + .body'
   ```
   - Keep `--jq` simple — no nested double quotes (they break inside a double-quoted command). Build strings with `+`, or drop `--jq` and read fields separately.
   - Read for a code example, reproduction steps, and expected vs. actual behavior.
   - A "works for me" / "could not reproduce" comment does **not** cancel the attempt — build and run it yourself, and mine the comment for variations to try (version, theme, browser, data set, exact gesture). Report not-reproduced only after genuine Phase 3 iteration, noting the conflict and what you tried.
2. **Plain text**: search first — `gh search issues "<keywords>" --repo vaadin/web-components --repo vaadin/flow-components` (omit `--state`; `gh search issues` rejects `--state all`). If a match exists, switch to the URL flow; otherwise work from the text.
3. **Affected version**: note it if stated. Check the current line (Flow: `<flow.version>` in `<FLOW_ROOT>/pom.xml`; Web: `version` in `<WC_ROOT>/packages/<component>/package.json`). If the affected range is within the current line, use the current checkout. If the bug is reportedly fixed in a newer line or the range is below the checkout, switch to the matching maintenance branch and confirm it reproduces there — see [references/version-specific.md](references/version-specific.md). Call it "version-specific" only after seeing it reproduce on the old branch.
4. **Flavor**: web vs. Flow, by repository and example language (`.html`/JS → web; `.java` → Flow). Reproduce in that flavor first; cross-flavor fallback is Phase 3 only.
5. **Resolve every named component to its real source before scaffolding — never assume markup or API from memory.** Tags, attributes, and theme idioms drift across versions; a wrong guess sends the whole reproduction at the wrong artifact. For each component the bug names:
   - **Web:** find `packages/<name>/`, its element (`grep -rln "customElements.define\|static get is" packages/<name>/src`), the `@vaadin/<name>` import, and any `dev/<name>.html`. Build from the real element and current API, copying markup from `dev/<name>.html`.
   - **Flow:** find the Java class under `vaadin-<name>-flow-parent/`, using the API as existing integration-test views use it.
6. **Confirm the intended behavior, then form a hypothesis.** Check what the component should do (docs, `src/` API, tests), not just what the reporter expected — if it works as designed, the verdict is "works as designed (likely misuse)". Write one line: **"The bug is X, triggered by Y, observable as Z"**, where Z is the exact failure signal you will look for.
7. **Look for a duplicate.** Search open and closed issues for the component plus a distinctive symptom (exception + line, unique error string, specific trigger):
   ```bash
   gh search issues "<component> <distinctive token>" --repo vaadin/<repo>
   ```
   Confirm a real match only after reproducing (Phase 5) — same root cause, stack trace, and trigger, not just a similar title. A confirmed match makes the verdict "duplicate of #N" (Phase 6). Common shape: this issue reproduces and an identical one is already closed/fixed, so this one should be closed as a duplicate.

## Phase 2 — Build the reproduction

Build the smallest view that exercises the hypothesis, using the real API from Phase 1.5 and the reporter's example as the starting point (minimize later, in Phase 3). Name it after the issue and never overwrite an existing file:

- Web: `dev/repro-<issue>.html` (or `dev/repro-bug.html` if there is no number).
- Flow: `Repro<issue>View.java` with `@Route("repro-<issue>")`.

Follow [references/web-component.md](references/web-component.md) or [references/flow-component.md](references/flow-component.md).

## Phase 3 — Run and reproduce

1. Start the server in the background and wait for real readiness:
   - Web: poll `curl -sf http://localhost:8000/dev/repro-<issue>.html`.
   - Flow: run jetty with `CI=true` (see [references/flow-component.md](references/flow-component.md)) and poll the task output for `Frontend compiled successfully`. Also break on failure markers (`BUILD FAILURE|ERR_PNPM|Dependency ERROR|does not exist|Address already in use`) — a listening port 8080 is not readiness.
2. Drive the browser:
   ```bash
   playwright-cli open http://localhost:8000/dev/repro-<issue>.html   # web
   playwright-cli snapshot
   # ... click / type / press to follow the repro steps ...
   playwright-cli console          # check for JS errors
   playwright-cli screenshot --filename=/tmp/repro-<issue>.png   # for visual bugs
   playwright-cli close
   ```
3. **Inspect the real DOM before asserting.** Components render into shadow DOM and slot into light DOM; "hidden" is rarely a `hidden` attribute — it may be a slot, a `part`, `display: none`, or a property. Don't guess a selector; dump the structure once, then build the check from what you see:
   ```bash
   playwright-cli --raw eval "() => document.querySelector('vaadin-<component>').shadowRoot.innerHTML.replace(/\s+/g,' ').slice(0,800)"
   ```
   Prefer the component's own state (a public/observed property, computed style, `offsetWidth > 0`) over the bare `hidden` attribute. Look for signal Z.
4. **Iterate before concluding "not reproduced".** The trigger is often precise (an exact gesture, an attach/detach cycle, a property combination, timing). On a miss, refine the view against the hypothesis and retry; restart the server after Java changes (web pages hot-reload). Log what you tried for the report.
   - **Cross-flavor fallback (last resort).** If a `flow-components` issue won't reproduce as a Flow View after genuine iteration and the root cause is clearly in the shared web component, then try a `dev/*.html` reproduction. Record both attempts.
5. **Minimize, then re-verify.** Strip to the smallest case that still reproduces, re-running after each removal. This minimized view is what you share in Phase 6.
6. **Decide the verdict from what you saw** — the snapshot, console, or screenshot, not the issue text: confirmed bug, works-as-designed/misuse, or not reproduced.
7. **Record a demo video for on-screen bugs.** Screencast needs Playwright's ffmpeg (`npx playwright install ffmpeg`; a `screencast.start: Executable doesn't exist … ffmpeg` error means it's missing). If a take errors `Screencast is already started`, `playwright-cli close` then `open`. Run the minimized repro as a polished take with `playwright-cli run-code --filename <script>.js`:
   ```js
   async page => {
     await page.screencast.start({ path: '/tmp/repro-<issue>-<symptom>.webm', size: { width: 1000, height: 700 } });
     await page.goto('http://localhost:<port>/<route>');
     await page.screencast.showChapter('<what this shows>', { description: '<the bug>', duration: 1800 });
     // perform the minimal steps; pressSequentially(text, { delay: 60 }) for natural typing,
     // waitForTimeout(...) to hold on the failure; showOverlay(html, { duration }) to box/label it
     await page.waitForTimeout(4000);
     await page.screencast.stop();
   }
   ```
   Keep clips short (≈10–20s), one symptom each. Commit the `.webm` in Phase 6 and reference it in the report. For menu/overlay components, perform the action with the overlay open so the symptom is on screen, not just its side effects.

## Phase 4 — Report

Copy [assets/summary-template.md](assets/summary-template.md) to `<repo-root>/repro-<issue>-summary.md` and fill it in; it is committed with the scaffold in Phase 6. Cover:

- **Verdict**: reproduced / not reproduced / partially reproduced / works as designed (likely misuse) / duplicate of #N.
- **Branch**: the `repro/<issue>` branch and repo. Only a confirmed reproduction gets a pushed branch and a comment; other verdicts are reported (with the iteration log) but not pushed.
- **Environment**: repo, version/branch, theme, browser. If asked "is it fixed on main?", answer here.
- **Observed behavior**: what happened (cite the snapshot / console / screenshot).
- **Expected behavior**: from the issue or description.
- **Steps to reproduce**: numbered, minimal.
- **Reproduction**: the minimal markup/View inline (fenced) plus the route/scaffold name.
- **Demo video(s)**: path(s) to the `.webm` (one per symptom).
- **Duplicate** (if any): the issue this duplicates and the evidence (same stack trace, root cause, trigger). If that issue is closed/fixed, recommend closing this one as a duplicate.
- **Root cause**: filled after Phase 5.

Give the same summary in your chat reply, including the pushed branch name. If it does not reproduce, say so plainly and note likely reasons (fixed on `main`, version-specific, missing context) — don't force a positive result.

## Phase 5 — Locate the root cause

Once reproduced, search the source for the problem area:
- Web: `packages/<component>/src/` (and shared mixins in `packages/*-base/`, `packages/component-base/`).
- Flow: `vaadin-<component>-flow-parent/vaadin-<component>-flow/src/main/java/`.

Name the file(s) and the likely cause (`file_path:line`). Don't fix the bug unless asked — the goal is a confirmed reproduction and a root-cause pointer.

## Phase 6 — Share the reproduction branch

When the bug **reproduced**, push a branch from the repo holding the scaffold (`<WC_ROOT>` for web, `<FLOW_ROOT>` for Flow), before cleanup. If it did not reproduce, skip this and just report.

1. Note the starting branch: `git -C <ROOT> rev-parse --abbrev-ref HEAD`.
2. Branch from the current HEAD (the exact state you reproduced on, e.g. a maintenance branch): `git -C <ROOT> checkout -b repro/<issue>`.
3. Stage **only** the files you created/edited — scaffold, summary, demo `*.webm` (copy from `/tmp` first), and any Flow IT-pom dependency. Never `git add -A`. These edits stay on the branch (don't revert them) so it's runnable by others:
   ```bash
   git -C <ROOT> add dev/repro-<issue>.html repro-<issue>-summary.md repro-<issue>-*.webm                       # web
   git -C <ROOT> add <…>/Repro<issue>View.java <…>/integration-tests/pom.xml repro-<issue>-summary.md repro-<issue>-*.webm   # flow
   git -C <ROOT> commit -m "test: reproduce #<issue> (<component>)"
   ```
4. Push: `git -C <ROOT> push -u origin repro/<issue>`. If the remote branch exists, use a suffix (`repro/<issue>-2`) rather than force-pushing. Capture the branch name and URL for the summary and chat reply.
5. **Post the summary as a comment.** Keep the `> [!WARNING]` disclaimer (from the template) first, and make the **Branch** line link the pushed branch. **This posts to a public upstream issue — show the rendered comment and get explicit confirmation before posting** (skip if declined). Post via file input:
   ```bash
   gh api repos/vaadin/<repo>/issues/<issue>/comments -F body=@repro-<issue>-summary.md
   ```
   Capture the returned `html_url`. Post only when the bug reproduced. `gh api` can't upload an inline video — the comment links the `.webm` on the branch, and it plays inline only if a human drags the file in; surface the local `.webm` path(s) in your reply so the approver can drag-drop them.
6. **Label `ai repro`** — only after the comment was posted (the label exists in both repos):
   ```bash
   gh issue edit <issue> --repo vaadin/<repo> --add-label "ai repro"
   ```
7. **If it's a duplicate, suggest closing it — never close it yourself.** State the duplication in the comment and recommend closing as a duplicate of #N (link both; note if #N is fixed). Surface the command in your reply and run it only on explicit approval, same gate as posting:
   ```bash
   gh issue close <issue> --repo vaadin/<repo> --reason "not planned" --comment "Duplicate of #N"
   ```

## Cleanup

The remote `repro/<issue>` branch is the shared artifact — leave it. Return each repo you touched to its original state:

1. Stop any server you started:
   - Web: stop the background `yarn start` task.
   - Flow: `cd "<FLOW_ROOT>" && mvn jetty:stop -pl vaadin-<component>-flow-parent/vaadin-<component>-flow-integration-tests` (don't kill the background task — that leaves the forked Jetty JVM holding port 8080).
2. Switch back: `git -C <ROOT> checkout <starting-branch>`. Edits were committed on `repro/<issue>`, so the tree is clean. Optionally drop the local branch: `git -C <ROOT> branch -D repro/<issue>` (preserved on the remote).
3. Delete any `/tmp` screenshot.
4. If you switched `<WC_ROOT>` to another line, re-run `yarn install` after switching back — see [references/version-specific.md](references/version-specific.md).

Confirm `git -C <ROOT> status --porcelain` is empty (ignoring unrelated pre-existing untracked files) and the repo is on its original branch. If the bug did not reproduce (no branch pushed), instead delete the untracked scaffold and revert any pom edit.
