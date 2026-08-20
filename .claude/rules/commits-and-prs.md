# Git commits

Write commit messages terse and exact, no fluff.

## Subject line

- Format: `<type>: <summary>` (Conventional Commits)
- Length: under 72 chars
- Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Breaking changes: append `!` before the colon (`feat!`, `fix!`)
- Start with an imperative verb — "add", "fix", "remove" — not "added", "adds", "adding"
- Use English articles only when omitting them would be ambiguous
  - Good: `fix: handle null in parser`
  - Avoid: `fix: handle null in the parser`
- Don't repeat the type in the summary: avoid `fix: fix...`, `refactor: refactor...`,

## Body

- Skip when the subject is self-explanatory
- Add a body only for: non-obvious _why_, breaking changes, migration notes

# Github Pull Requests

## Title

Use the same rules as for Git commit subject lines (above).

## Description

The goal is a description a reviewer can read in under a minute: issue links, a bullet
list of what changed, a type label, and concrete steps to verify by hand. Bullets are
the default; prose is the exception.

Use this template, in this fixed section order:

```markdown
## Description

Fixes https://github.com/vaadin/web-components/issues/951

- <What changed, one behavior per bullet>
- <…>
  - <Sub-bullet: a detail or the reason, only when the parent bullet needs it>

## Type of change

- <Feature | Bugfix | Refactor | Documentation | Tests | Internal change>

## How to test

1. <Open a dev page: `dev/split-layout.html`>
2. <Do the thing>
3. <What you should see>

### Issue links

- Links first, one per line, no bullet. Omit the block when there is nothing to link.
- Full URLs for cross-repo links, bare `#NNNN` only within the same repo.
- Pick the most specific relation; combine when both genuinely fit: `Fixes #123, Part of #456`.

| Relation         | When to use                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Fixes #`        | Resolves a bug. Don't use for features — they usually span multiple PRs or repos and are closed manually.           |
| `Part of #`      | One slice of a feature/task that spans multiple PRs or repos. Always add when there's a platform ticket with a PRD. |
| `Depends on #`   | Must be merged after another PR.                                                                                    |
| `Follow-up to #` | Addresses something missed or deferred by a previously merged PR.                                                   |
| `Related to #`   | Touches the same area as another issue/PR without fixing or implementing it.                                        |

### Bullets

- Past tense, one behavior per bullet, identifiers in backticks.
  - Good: `Added role="slider" and tabindex="0" to the splitter element making it focusable`
  - Avoid: `Updated vaadin-split-layout.js` — a bullet per file restates the diff.
- Group related edits into one bullet: three CSS files that got the same rule are one bullet.
- Sub-bullets carry detail or reason, not more changes.
- Tests and dev pages get their own bullets when they are part of the deliverable.
- Cap at ~10 bullets. Past that, either the bullets are too granular or the PR should be split.
- No vague verbs (`Improved`, `Enhanced`, `Various fixes`) and no hedging (`Should now work`).

### Prose

One short paragraph between the links and the bullets, only when the bullets cannot carry
the _why_: a non-obvious root cause, a rejected alternative a reviewer would otherwise
propose, a constraint that shaped the approach. A subtle bug fix usually earns one;
a feature almost never does.

Use plain, common English. Most Vaadin readers are non-native English speakers, so avoid
advanced or uncommon vocabulary.

- Avoid: "gated", "predicated", "obviate", "subsume", "short-circuit", "surface" (as a verb or noun for "expose" / "API").
- Prefer: "only runs when", "based on", "remove the need for", "include", "skip" or "exit early", "API" or "expose".
- Technical terms (API names, identifiers, library names) stay exact. Only the surrounding prose needs to be plain.

### Type of change

One plain bullet, not a checkbox. Map from the PR title prefix: `feat` → Feature,
`fix` → Bugfix, `refactor` → Refactor, `docs` → Documentation, `test` → Tests,
`chore` → Internal change. Mixed branches take the type a reviewer cares about most —
a `fix` with supporting test cleanup is still a Bugfix.

### How to test

- Numbered steps a reviewer can follow without reading the diff. Each step is one action.
- Step 1 names a page that exists in the repo (`dev/<component>.html`) — verify the file is there.
- The last step states what should happen — a run with no observable result is not a test.
- Keyboard keys as `<kbd>Enter</kbd>`.
- A preamble line for a prerequisite: `On a touch device, or with touch emulation:`.
- Omit the whole section when the change cannot be exercised by hand — dependency bumps,
  types-only changes, internal refactors. A missing section is better than "run the tests".

### Optional extras

Only when the change genuinely needs them, always after `How to test`:

- A behavior table — `| Case | Before | After |` — when the change alters several distinct
  cases and a list would not make the pattern clear.
- `> [!NOTE]` — a single callout for a side effect a reviewer should know about but that
  is not the point of the PR.
- `> [!WARNING]` — for breaking changes, explaining what breaks and why.
```
