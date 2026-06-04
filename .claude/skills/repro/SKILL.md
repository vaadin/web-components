---
name: repro
description: Create a minimal Vaadin view that reproduces a reported issue/bug, drive it in a browser until the bug shows, then strip it down to the smallest reproducing case
disable-model-invocation: true
---

# /repro — Build a minimal reproduction view for a reported issue

You are given a free-form description of an issue or bug in `$ARGUMENTS`. It may
be plain prose, a numbered list of steps, and/or contain a link (e.g. a GitHub
issue, a forum post, a gist). Your job is to build a **minimal Vaadin view that
reproduces the issue inside the currently open Vaadin application**, confirm the
reproduction in a real browser, shrink it to the smallest case that still
reproduces, and report exact steps — or report that you could not reproduce it.

Work autonomously. Only stop to ask the user when truly blocked (see "When to
stop and ask").

## 1. Understand the issue

1. Read `$ARGUMENTS` carefully. Extract: which component(s) are involved, the
   expected vs. actual behavior, the trigger (user action, attach/detach,
   specific property combination, etc.), and any version constraints.
2. If `$ARGUMENTS` contains any URL, fetch it with `WebFetch` (GitHub issues,
   forum threads, gists). Pull out the reproduction steps, code snippets, stack
   traces, and comments that narrow down the cause. Follow obvious linked
   sub-resources (e.g. a gist or a linked PR) when they add reproduction detail.
3. If the issue references Vaadin component behavior you're unsure about, use the
   Vaadin MCP / docs tools to confirm the intended API and behavior. Knowing the
   _intended_ behavior is what lets you tell a real bug from a misuse.
4. Form an explicit hypothesis: "The bug is X, triggered by Y, observable as Z."
   You will test this hypothesis in the view.

## 2. Locate the target application and create the view

The "currently open Vaadin application" is the project in the working directory.

- **In the flow-components repo** (this repo): create the view in the relevant
  component's integration-tests module, since those are runnable Vaadin apps:
  `vaadin-{component}-flow-parent/vaadin-{component}-flow-integration-tests/src/main/java/com/vaadin/flow/component/{component}/tests/`.
  Match the package and style of existing views in that folder. Pick the module
  matching the primary component in the issue.
- **In a generic Vaadin app**: find the package that holds existing `@Route`
  views (search for `@Route(` and existing `extends VerticalLayout`/`Div`
  classes) and add the new view alongside them.

Create one new view class:

- Give it a **descriptive, unique `@Route`** that ties it to the issue, e.g.
  `@Route("repro-grid-detach-2345")` or `@Route("repro-upload-i18n")`. Include the
  issue number when known. The route must not collide with an existing one.
- Keep the class small and self-contained. Start from the reproduction steps in
  the issue — don't over-engineer; add only what the issue describes.
- Add a short class-level comment with a one-line description of the issue and the
  source link (if any), so the view is self-documenting. Do not paste large
  excerpts of external content.

## 3. Reproduce in a browser

1. Start the integration-test server for the chosen module. Poll the background
   task output for "Frontend compiled successfully" rather than sleeping. If port
   8080 is already in use, stop and ask the user before killing anything.
2. Drive the view with the Playwright MCP browser (`browser_navigate` to
   `http://localhost:8080/<your-route>`, then `browser_snapshot`,
   `browser_click`, `browser_type`, etc.). Reproduce the exact user actions from
   the issue.
3. Check for the failure signal the issue describes: wrong rendering, an
   exception (check `browser_console_messages` and the server log), a missing
   update, a thrown error, etc.
4. **Iterate.** If it doesn't reproduce, refine the view against your hypothesis:
   add the missing trigger, match the version/property combination, add the
   attach/detach cycle, etc. The server must be restarted after Java changes —
   restart, recompile, re-test. Keep a brief log of what you tried.

Treat "the bug reproduces" as confirmed only once you've **observed the failure
yourself in the browser or server log** — not merely reasoned that it should
happen.

## 4. Minimize

Once it reproduces, strip the view down to the smallest case that _still_
reproduces:

- Remove every component, property, listener, style, and data item that isn't
  required for the failure. Re-test in the browser after each meaningful removal
  (restart the server as needed) to confirm it still reproduces.
- Prefer the simplest layout and the least data that triggers the bug.
- The end state should be a view a maintainer can read in seconds and see exactly
  what triggers the problem.

## 5. Report

When you reproduce it, report:

- The view file path and its `@Route`.
- The exact steps to reproduce in the browser (numbered, including the URL).
- The observed failure (the error message / wrong behavior) and what was expected
  instead.
- A one-line note on what minimal condition triggers it (the key insight).

If you **cannot** reproduce it after a genuine effort, say so clearly. Report:

- What you tried (the variations of the view / steps).
- What you observed instead (the behavior that _did_ happen).
- Your best guess at why it doesn't reproduce (e.g. already fixed in this
  version, missing detail in the report, environment-specific) and what
  additional information would help.
- Leave the view in place so the user can take it further, and tell them its path
  and route.

## Cleanup

If you started the server, shut it down at the end (`mvn jetty:stop -pl ...`; do
not use TaskStop on the `jetty:run` task — it leaves the forked Jetty holding
port 8080). Leave the repro view file in place unless the user asks to remove it.

## When to stop and ask

- Port 8080 is occupied by a process you didn't start.
- The issue is ambiguous about which component or which version, and you can't
  infer it from context.
- Reproducing would require destructive actions, external services, or
  credentials you don't have.

Otherwise, keep going until the bug reproduces and is minimized, or you've
exhausted reasonable variations.
