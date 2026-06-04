---
name: repro
description: Reproduce a bug in Vaadin web components or Flow components from a GitHub issue link or a plain-text description. Fetches the issue, builds a minimal reproduction (a dev/*.html page for web components, or an integration-test View for Flow components), runs it, drives the browser with playwright-cli to confirm the bug, points at the likely root cause, pushes a shareable repro/<issue> branch, and (after confirmation) posts a verification-pending summary comment on the issue.
argument-hint: <issue-url | bug description>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(gh:*), Bash(yarn:*), Bash(mvn:*), Bash(playwright-cli:*), Bash(npx:*), Bash(git:*), Bash(curl:*)
---

You are a tester reproducing a bug in Vaadin web components or Flow components. The input `$0` is either a GitHub issue URL or a plain-text bug description. Work through the phases below in order. Do not claim a bug is reproduced until you have observed it in a running browser.

## Repositories

The two repos are sibling folders. **At launch your working directory is the skill's own folder, not a repo root — relative paths like `../flow-components` break. Resolve absolute roots once via git, then use those literal paths in every later command** (env vars do not persist between shell calls, so substitute the actual paths):

```bash
git rev-parse --show-toplevel        # → WC_ROOT: the web-components checkout (this skill lives inside it)
# FLOW_ROOT is the sibling: <dirname of WC_ROOT>/flow-components
```

Run that, note the two absolute paths, and prefix subsequent git/file commands accordingly (`git -C <WC_ROOT> …`, write to `<FLOW_ROOT>/…`).

| Flavor | Repo root | Reproduce with | Run with |
| --- | --- | --- | --- |
| Web component (Lit) | `<WC_ROOT>` (this checkout) | a new `dev/*.html` page | `yarn start` (web-dev-server, port 8000) |
| Flow component (Java) | `<FLOW_ROOT>` (sibling) | a new integration-test `View` | `mvn jetty:run` (port 8080) |

**Reproduce in the flavor that matches the issue's repository — and for a `flow-components` issue, reproduce on the Flow side first.** Flow adds server-side behavior the web component never exercises on its own: lazy `DataProvider` loading and server-side filtering in combo-box and grid, value sync across the server round-trip, attach/detach lifecycle, bean/converter handling. Reproducing such a bug as a plain web-component `dev/*.html` page gives a **false negative** — the web component works in isolation while the bug actually lives in the Flow ↔ client integration. So: a `flow-components` issue → build the Flow `View` first; a `web-components` issue → build the `dev/*.html` page. **Only fall back to the other flavor after the first genuinely fails to reproduce** (see Phase 3) and the evidence points there — e.g. a Flow reproduction that does not show the bug, with a root cause that is clearly in the shared web component. Never substitute a web-component reproduction for a Flow issue just because it is faster; state any cross-over and why in the report.

## Preflight — required tooling

Reproduction is only valid when observed in a running browser, which this skill drives with `playwright-cli`. **Check it is available before doing any work** (so you fail fast, before building scaffolds or starting a slow server):

```bash
playwright-cli --version 2>/dev/null || npx --no-install playwright-cli --version 2>/dev/null
```

If the global command works, use `playwright-cli` in all later commands; if only the `npx` form works, use `npx playwright-cli` everywhere. If **neither** prints a version, **stop and ask the user to install it** — do not proceed with the reproduction. Suggest:

```bash
npm install -g @playwright/cli@latest
# then register its Claude Code skills so the browser-automation reference is available:
playwright-cli install --skills
```

Resume only once the user confirms it is installed.

## Phase 1 — Understand the bug

1. **If `$0` is a GitHub issue URL** (`github.com/vaadin/<repo>/issues/<n>`):
   - Fetch the body and the comments as JSON — `gh issue view --comments` prints nothing in a non-interactive shell, so use the `--json` form:
     ```bash
     gh issue view <n> --repo vaadin/<repo> --json number,title,state,body,labels
     gh issue view <n> --repo vaadin/<repo> --json comments --jq '.comments[] | .author.login + ": " + .body'
     ```
   - **Keep `--jq` expressions simple — no nested double quotes.** A double-quoted `--jq` string inside a double-quoted shell command breaks (e.g. `"\(.x) \([.labels[].name]|join(\", \"))"` fails to parse). Build strings with `+` and only single quotes around the whole `--jq` arg, or drop `--jq` and let `gh` print the JSON, then read fields separately (`--json labels --jq '.labels[].name'`).
   - Read the description and comments for a code example, reproduction steps, and the expected vs. actual behavior.
   - **A "could not reproduce" / "works for me" comment does NOT cancel the attempt.** Always build and run the reproduction yourself — such comments are common and frequently wrong (the commenter used a different version, theme, browser, data set, or missed the precise trigger). Treat them as extra signal: mine them for what was tried so you can vary it (different version/branch per Phase 1.3, exact gesture, larger data set) and aim to succeed where they failed. Only after your own genuine effort (Phase 3 iteration) may you report not-reproduced — and then note the conflicting comment and exactly what you tried.
2. **If `$0` is plain text**: search for an existing issue before building anything.
   - `gh search issues "<keywords>" --repo vaadin/web-components --repo vaadin/flow-components --state all`
   - If you find a matching issue, switch to the issue-URL flow above. If not, work from the text alone.
3. **Identify the affected version** if stated (e.g. `24.10`). Note it in the summary, then decide where to reproduce:
   - Check the current checkout's line — Flow: `<flow.version>` in `<FLOW_ROOT>/pom.xml`; Web: `version` in `<WC_ROOT>/packages/<component>/package.json`.
   - If the affected range is **within** the current line, reproduce against the current checkout (the default).
   - If the report says the bug is fixed in a newer line, or the affected range is **below** the current checkout (e.g. "up to 24.10.1, fixed in 25.x" while you are on 25.x), do **not** settle for a negative run on the current line. Switch to the matching maintenance branch and validate that it really reproduces there — follow [references/version-specific.md](references/version-specific.md). A claim is only "version-specific" once you have seen it reproduce on the old branch.
4. **Identify the flavor** (web vs. Flow) and where to reproduce first. The flavor follows the **repository the issue is filed against** and the code example language (`.html`/JS → web; `.java` → Flow). Reproduce in that flavor first: a `flow-components` issue is reproduced as a Flow `View` **before** any web-component attempt — Flow-only behavior (lazy data provider / server-side filtering in combo-box and grid, value sync, attach/detach) will not show on a plain `dev/*.html` page. Cross-flavor fallback happens only in Phase 3, after the primary flavor genuinely fails to reproduce.
5. **Confirm the intended behavior**, then form a hypothesis:
   - Check what the component is *supposed* to do (component docs, the `src/` API, or existing tests) — not just what the reporter expected. The reporter can be wrong; if the code works as designed, the verdict is "works as designed — likely misuse", which is as valuable as a confirmed bug.
   - Write a one-line hypothesis you will test: **"The bug is X, triggered by Y, observable as Z."** Z is the exact failure signal you will look for in the browser (a wrong attribute, a console error, a missing update, a mis-sized region).

## Phase 2 — Build the reproduction

Build the smallest view that exercises your hypothesis. Prefer the reporter's code example as the starting point; include only what the hypothesis needs (the real minimization happens in Phase 3, once it reproduces). If there is no example, construct one from the description and the trigger Y.

Name the reproduction after the issue so nothing existing is clobbered:
- Web: `dev/repro-<issue>.html` (or `dev/repro-bug.html` when there is no issue number).
- Flow: a `Repro<issue>View.java` with `@Route("repro-<issue>")`.

Never overwrite an existing `dev/*.html` page or an existing View.

- **Web component** → follow [references/web-component.md](references/web-component.md).
- **Flow component** → follow [references/flow-component.md](references/flow-component.md).

## Phase 3 — Run and reproduce

1. Start the server (see the flavor reference) in the **background**, and wait until it is actually ready before driving the browser:
   - Web: web-dev-server is ready almost immediately; poll `curl -sf http://localhost:8000/dev/repro-<issue>.html`.
   - Flow: run jetty with `CI=true` (see [references/flow-component.md](references/flow-component.md)) and poll the background task output for `Frontend compiled successfully` (compilation takes a while on first run). The wait must **also** break on failure markers (`BUILD FAILURE|ERR_PNPM|Dependency ERROR|does not exist|Address already in use`) or it hangs forever on a broken build — and a listening port 8080 alone is not readiness.
2. Drive the browser with the `playwright-cli` skill — open the page, `snapshot`, perform the reproduction steps, and observe:
   ```bash
   playwright-cli open http://localhost:8000/dev/repro-<issue>.html   # web
   playwright-cli snapshot
   # ... click / type / press to follow the repro steps ...
   playwright-cli console          # check for JS errors
   playwright-cli screenshot --filename=/tmp/repro-<issue>.png   # for visual bugs
   playwright-cli close
   ```
3. **Inspect the component's actual DOM before asserting anything.** Vaadin components render into shadow DOM and often slot content into the light DOM, and "hidden" is rarely a plain `hidden` attribute — it may be a slot assignment, a `part`, `display: none`, or an internal property. Do not guess a selector. First dump the real structure once, then build your state check from what you see:
   ```bash
   # see where the relevant elements actually live
   playwright-cli --raw eval "() => document.querySelector('vaadin-<component>').shadowRoot.innerHTML.replace(/\s+/g,' ').slice(0,800)"
   ```
   Prefer the component's own state (a public/observed property, an `abbr`/badge text, `getComputedStyle(...).display`, `offsetWidth > 0`) over the bare `hidden` attribute when deciding what is visible. Look specifically for the failure signal Z from your hypothesis.
4. **Iterate before concluding "not reproduced".** A single naive attempt missing the bug is common — the trigger is often precise (an exact drag gesture, an attach/detach cycle, a specific property combination, a timing). On a miss, refine the view against your hypothesis — add the missing trigger, match the version/property combination, follow a comment that narrows it — and retry. Restart the server after Java changes (web pages hot-reload). Keep a short log of what you tried; it goes in the report's Notes if it ultimately does not reproduce. Only call it not-reproduced after a genuine effort.
   - **Cross-flavor fallback (last, not first).** If a `flow-components` issue still will not reproduce as a Flow `View` after genuine iteration, and the suspected root cause is in the shared web component, *then* try a web-component `dev/*.html` reproduction. Do this only after the Flow attempt has failed — never skip the Flow attempt because the web one is faster. Record both attempts in the report. (The reverse — a web-components issue that only manifests through Flow — is rare; pursue it only with a concrete reason.)
5. **Minimize, then re-verify.** Once it reproduces, strip the view to the smallest case that *still* reproduces — remove every component, property, listener, style, and data item not required for the failure. Re-run the reproduction after each meaningful removal (restart the server as needed) to confirm Z still shows. The end state should be a view a maintainer reads in seconds. This minimized view is what gets shared in Phase 6.
6. Decide the verdict from what you actually saw — the DOM snapshot, console output, or screenshot — not from the issue text. Compare observed behavior against the **intended** behavior from Phase 1: a confirmed bug (differs from intended), works-as-designed/misuse (matches intended, reporter expectation was wrong), or not reproduced.
7. **Record a demo video — when the bug is visible on screen (most UI bugs).** A short clip of the failure is the most convincing artifact for maintainers (e.g. a combo-box overlay whose spinner never stops). Re-run the *minimized* reproduction as a polished take with the `playwright-cli` screencast hero-script approach (see the `playwright-cli` skill's video-recording reference) — write a small JS script and run it with `playwright-cli run-code --filename <script>.js`:
   ```js
   async page => {
     await page.screencast.start({ path: '/tmp/repro-<issue>-<symptom>.webm', size: { width: 1000, height: 700 } });
     await page.goto('http://localhost:<port>/<route>');
     await page.screencast.showChapter('<what this shows>', { description: '<the bug>', duration: 1800 });
     // perform the minimal steps; pressSequentially(text, { delay: 60 }) for natural typing,
     // waitForTimeout(...) pauses so the failure is watchable
     // annotate the failure: showOverlay(html, { duration }) to box/label the stuck spinner or wrong value
     await page.waitForTimeout(4000);            // hold on the failure state
     await page.screencast.stop();
   }
   ```
   Keep each clip short (≈10–20s), one symptom per clip (or use chapters). The `.webm` becomes part of the shared artifact (committed in Phase 6) and is referenced in the report. Skip only for non-visual bugs where a clip adds nothing.

## Phase 4 — Report

Copy [assets/summary-template.md](assets/summary-template.md) to `<repo-root>/repro-<issue>-summary.md` and fill it in. It is committed alongside the scaffold in Phase 6, so others get a self-documenting branch. Cover:
- **Verdict**: reproduced / not reproduced / partially reproduced / works as designed (likely misuse).
- **Branch**: the `repro/<issue>` branch you will push (Phase 6) and the repo it goes to. Only a confirmed reproduction gets a pushed branch and an issue comment; a works-as-designed/misuse or not-reproduced result is reported (with your iteration log) but not pushed.
- **Environment**: repo, version/branch, theme, browser. If asked "is it fixed on main?", state the answer here.
- **Observed behavior**: what actually happened (cite the snapshot / console / screenshot).
- **Expected behavior**: from the issue or description.
- **Steps to reproduce**: numbered, minimal.
- **Reproduction**: embed the minimal markup/View source inline (a fenced code block) and name the route/scaffold.
- **Demo video(s)**: path(s) to the recorded `.webm` (one per symptom), committed on the branch in Phase 6.
- **Root cause**: filled after Phase 5.

Also give this summary in your chat reply, and always include the pushed branch name so the user can share it. If the bug does **not** reproduce, say so plainly and note likely reasons (already fixed on `main`, version-specific, missing context) — do not force a positive result.

## Phase 5 — Locate the root cause

Once reproduced, search the source for the problematic area:
- Web: `packages/<component>/src/` (and shared mixins in `packages/*-base/`, `packages/component-base/`).
- Flow: `vaadin-<component>-flow-parent/vaadin-<component>-flow/src/main/java/`.

Use `Grep`/`Glob` for the relevant property, method, event, or CSS part. Name the file(s) and the likely cause (`file_path:line`). Do not fix the bug unless asked — the goal is a confirmed reproduction and a root-cause pointer.

## Phase 6 — Share the reproduction branch

When the bug **reproduced**, push a branch so others can run it. Do this in the repo that holds the scaffold (`<WC_ROOT>` for web, `<FLOW_ROOT>` for Flow), **before** cleanup. (If it did **not** reproduce, skip this — there is nothing to share; just report.)

1. Note the starting branch to restore later: `git -C <ROOT> rev-parse --abbrev-ref HEAD`.
2. Create the reproduction branch **from the current HEAD** (the exact state you reproduced on — e.g. the maintenance branch for a version-specific run):
   ```bash
   git -C <ROOT> checkout -b repro/<issue>
   ```
3. Stage **only** the files you created/edited — the scaffold, the summary, any demo `*.webm` you recorded, and (Flow) any IT-pom dependency you added. Never `git add -A`. Copy the videos from `/tmp` into the repo first so they can be committed:
   ```bash
   git -C <ROOT> add dev/repro-<issue>.html repro-<issue>-summary.md repro-<issue>-*.webm                       # web
   git -C <ROOT> add <…>/Repro<issue>View.java <…>/integration-tests/pom.xml repro-<issue>-summary.md repro-<issue>-*.webm   # flow
   git -C <ROOT> commit -m "test: reproduce #<issue> (<component>)"
   ```
4. Push and set upstream:
   ```bash
   git -C <ROOT> push -u origin repro/<issue>
   ```
   If the remote branch already exists, append a short suffix (`repro/<issue>-2`) rather than force-pushing someone else's branch. Capture the branch name and the URL `git push` prints — both go in the summary and your chat reply.

Committing the IT-pom edit and the summary on this branch is what makes it self-contained and runnable by others — so, unlike before, you do **not** revert those; they live on `repro/<issue>`.

5. **Post the summary as a comment on the issue.** The summary file already carries the `> [!WARNING]` disclaimer ("Automated reproduction … needs human verification") from [assets/summary-template.md](assets/summary-template.md) — keep it as the first thing in the comment, and make sure the **Branch** line links the pushed `repro/<issue>` branch. **This posts to a public upstream issue, so show the rendered comment and get explicit confirmation before posting** (skip the post if the user declines). Post the file as-is via `gh api` (file input avoids all the multi-line quoting traps):
   ```bash
   gh api repos/vaadin/<repo>/issues/<issue>/comments -F body=@repro-<issue>-summary.md
   ```
   `-F body=@<file>` reads the body from the file. After posting, capture the returned comment `html_url` and include it in your chat reply. Only post when the bug reproduced; never post a comment for a non-reproduction unless the user asks.
   - **Video in the comment:** `gh api` cannot upload an inline video attachment — GitHub only renders a video player for files uploaded through its attachment service, which the comments API does not expose. So the comment links the `.webm` on the branch (downloadable), and the demo plays inline only if a human drags the file into the comment. Since posting is human-approved anyway, surface the local `.webm` path(s) in your chat reply so the approver can drag-drop them for inline playback when they post.

## Cleanup

The remote `repro/<issue>` branch is the shared artifact — leave it. Now return each repo you touched to the state you found it in:

1. Stop any server you started:
   - Web: stop the background `yarn start` task.
   - Flow: `cd "<FLOW_ROOT>" && mvn jetty:stop -pl vaadin-<component>-flow-parent/vaadin-<component>-flow-integration-tests` (do **not** kill the background task — that leaves the forked Jetty JVM holding port 8080).
2. Switch back to the starting branch: `git -C <ROOT> checkout <starting-branch>`. Because the scaffold/summary/pom edits were committed on `repro/<issue>`, this leaves the working tree clean automatically — no manual file deletion needed. Optionally drop the local branch: `git -C <ROOT> branch -D repro/<issue>` (it is preserved on the remote).
3. Delete any screenshot you saved under `/tmp`.
4. If you switched `<WC_ROOT>` to another line for a version-specific run, re-run `yarn install` after switching back — see [references/version-specific.md](references/version-specific.md).

Confirm `git -C <ROOT> status --porcelain` is empty (ignoring unrelated pre-existing untracked files) and the repo is on its original branch.

If the bug did **not** reproduce (no branch pushed), instead delete the untracked scaffold you created and revert any pom edit, so the tree is clean.
