# Git commits

Write commit messages terse and exact, no fluff.

## Subject line

- Format: `<type>: <summary>` (Conventional Commits)
- Length: under 60 chars
- Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Breaking changes: append `!` before the colon (`feat!`, `fix!`)
- Start with an imperative verb — "add", "fix", "remove" — not "added", "adds", "adding"
- Use English articles only when omitting them would be ambiguous
- Don't repeat the type in the summary: avoid `fix: fix...`, `refactor: refactor...`, etc.

## Body

- Skip when the subject is self-explanatory
- Add a body only for: non-obvious _why_, breaking changes, migration notes, linked issues
- Reference issues/PRs at the end: `Closes #42`, `Refs #17`

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

<!-- Fixes #123, Part of #789, Follow-up to #101, etc. -->
{relation}

---

🤖 Generated with Claude Code
```

### Writing guidelines

- Motivation: focus on _why_, not _how_ — the _how_ should be obvious from the code.
- Omit anything that is already obvious from the diff.
- Bugs: describe the issue and how to reproduce it.
- Implementation decisions: explain only the non-obvious ones.
- Context: link related issues and PRs; add background as needed.
- Use only well-established abbreviations (e.g. DOM, PR, API). Spell out anything project-specific on first use.

### Type mapping (commit -> PR)

| Commit prefix | PR type     |
|---------------|-------------|
| `feat`        | Feature     |
| `fix`         | Bugfix      |
| `refactor`    | Refactor    |
| `docs`        | Docs        |
| `test`        | Test        |
| `chore`       | Chore       |
