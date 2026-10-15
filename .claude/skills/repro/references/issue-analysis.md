# Phase 1 — Understanding the bug

Tracker in scope: `vaadin/web-components`. The tracker doesn't decide the owning layer; the reproducing code path does.

## 1. Fetch the issue

One call (`gh issue view --comments` prints nothing non-interactively):

```bash
gh issue view <n> --repo vaadin/web-components --json number,title,state,body,labels,comments
```

- Keep any `--jq` simple — no nested double quotes inside a double-quoted command; build strings with `+`.
- Read for a code example, reproduction steps, expected vs. actual behavior, and the theme in use.
- A "works for me" / "could not reproduce" comment does **not** cancel the attempt — build and run it yourself, and mine the comment for variations (version, theme, browser, data set, exact gesture). Report not-reproduced only after genuine Phase 3 iteration.
- **Fetch attached reproduction projects** — they can decide the verdict (misuse vs. bug). Zips linked as `github.com/.../files/...` download with `curl -sL`; linked repos read via `gh api "repos/<user>/<repo>/git/trees/HEAD?recursive=1" --jq '...'` and `gh api repos/<user>/<repo>/contents/<path> --jq .content | base64 -d`.

## 2. Affected version + regression classification

Note the affected version if stated. Check the current line (`version` in `packages/<component>/package.json`). If the bug is reportedly fixed in a newer line or the range is below the checkout, switch to the matching maintenance branch — see [reproduce.md](reproduce.md).

**Classify the regression:** `worked in <ver> / broke in <ver>` when there is evidence of both ends; `not a regression` when broken since the feature shipped; `unknown` otherwise. Recorded in the report for the team — informational only.

## 3. Resolve every named component to its real source — never assume markup or API from memory

Tags, attributes, slots, and parts drift across versions; a wrong guess sends the reproduction at the wrong artifact. Find `packages/<name>/`, its element (`grep -rln "customElements.define\|static get is" packages/<name>/src`), the `@vaadin/<name>` import, and any existing `dev/<name>.html` — build from the real element and current API. Check the reported API still exists; a removed API trends the verdict toward "obsolete".

## 4. Fix archaeology (issues more than ~2 years old)

Old issues are often already fixed, the fix never linked back. Before scaffolding:

1. Grep `packages/<component>/test/` for an existing regression test matching the symptom.
2. `git log --oneline -S "<distinctive symbol or error string>" -- <suspect paths>` to find the fixing commit/PR; record `fixing PR: <#N | none found>` for the summary. Many fixes are broad reworks with no single greppable PR — "none found" is a normal answer.
3. When a fixing PR is found, **resolve the issue it closed** — `gh pr view <n> --repo vaadin/web-components --json closingIssuesReferences,body`. That issue is usually the duplicate that got fixed while the triaged report stayed open; record it in the summary's `Duplicate of:` field.
4. Before citing a candidate fixing PR, confirm it touched the relevant package — `git show <sha> --stat`. A matching title can mislead.

A found fix does **not** skip browser verification, but it lets the page stay minimal and the report cite "duplicate of #N, fixed by #PR (with regression test)" — far more closeable than "could not reproduce".

## 5. Intended behavior, then hypothesis

Check what the component should do (docs, `src/` API, JSDoc contracts, tests), not just what the reporter expected — if it works as designed, the verdict is "works as designed (likely misuse)". Write one line: **"The bug is X, triggered by Y, observable as Z"**, where Z is the exact failure signal to look for.

## 6. Duplicates

Search open and closed issues for the component plus a distinctive symptom across the trackers:

```bash
gh search issues "<component> <distinctive token>" --repo vaadin/web-components --repo vaadin/flow-components --repo vaadin/flow
```

The Flow trackers are included on purpose — the same client bug is often reported through the Flow integration. Confirm a real match only after reproducing — same root cause, stack trace, and trigger, not a similar title. A confirmed match makes the verdict "duplicate of #N".
