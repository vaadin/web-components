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

Use this template:

```
<!-- Why this change was made. Focus on the problem and context. -->
{motivation}

<!-- A small example showing the problem (for bug fixes). Skip if not applicable. -->
{reproduction}

<!-- The non-obvious parts of what changed. Skip if the diff speaks for itself. -->
{changes}

<!-- For breaking changes, add a warning explaining what breaks and why. -->
> [!WARNING]
> {breaking change}

<!-- Fixes #123, Part of #789, etc. -->
{relation}

---

🤖 Generated with Claude Code
```

### Writing guidelines

- Motivation: focus on _why_, not _how_ — the _how_ should be obvious from the code.
- Omit anything already obvious from the diff.
- Bugs: describe the issue and how to reproduce it.
- Implementation decisions: explain only the non-obvious ones.
- Use only well-established abbreviations (e.g. DOM, PR, API).

### Relation mapping

- Pick the most specific relation; omit `{relation}` if none apply.
- Combine relations when both genuinely fit: `Fixes #123, Part of #456`.

| Type             | When to use                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Fixes #`        | Resolves a bug. Don't use for features — they usually span multiple PRs or repos and are closed manually.           |
| `Part of #`      | One slice of a feature/task that spans multiple PRs or repos. Always add when there's a platform ticket with a PRD. |
| `Follow-up to #` | Addresses something missed or deferred by a previously merged PR.                                                   |
| `Related to #`   | Touches the same area as another issue/PR without fixing or implementing it.                                        |
