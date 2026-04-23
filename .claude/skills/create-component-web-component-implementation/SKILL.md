---
allowed-tools: Read,Write(packages/*/spec/implementation-notes.md),Edit(packages/*/spec/implementation-notes.md),Edit(packages/*/spec/web-component-spec.md),Edit(packages/*/spec/web-component-tasks.md),Agent,Bash(git add *),Bash(git diff *),Bash(git status),Bash(git commit *),Bash(git log *),AskUserQuestion
description: Implement one task from a component's web-component-tasks.md as a chain of specialized subagents, ending in a single commit
user-invocable: false
---

This skill implements **one task** from a component's `web-component-tasks.md`. It runs a sequential chain of specialized subagents — a test agent, an implementation agent, a review agent, and (for styling / integration tasks) a visual-verify agent — each starting with a fresh context so their work does not contaminate each other's. After the chain completes, the orchestrator commits the result and appends an entry to the implementation log. The user or the parent `create-component` skill invokes this skill again to run the next task.

Arguments: [ComponentName] [TaskNumber?]

`ComponentName` is required. `TaskNumber` is optional — if omitted, the skill determines the next uncommitted task from `implementation-notes.md`.

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/web-component-tasks.md`. If the file does not exist, stop and tell the user to run `create-component-web-component-tasks` first.

2. Determine which task number N to process:
   - If `TaskNumber` was supplied, use it.
   - Else, read `packages/{component-name}/spec/implementation-notes.md`. Use the highest-numbered task block in that file + 1. If the notes file does not exist, N = 1.
   - If the resolved N is ambiguous (notes file disagrees with recent commits in `git log --oneline -20`), use AskUserQuestion to confirm the starting task.

3. Extract only task N from `web-component-tasks.md`: its title, spec sections, requirements, description, and test assertions. Ignore other tasks — they are not this invocation's concern.

4. Read `packages/{component-name}/spec/web-component-spec.md` and `packages/{component-name}/spec/web-component-api.md` to build informed subagent prompts. Do NOT read source code of other components — codebase research is the subagent's responsibility.

5. If N = 1 and `implementation-notes.md` does not exist, create it with a single-line header (see PROGRESS LOG FORMAT below).

6. Run the subagent chain for task N:

   a. **Test agent.** Spawn an Agent (`subagent_type: general-purpose`) with a self-contained prompt containing: the task's Title, Spec sections, Requirements, Description, Tests; paths to `web-component-spec.md` and `web-component-api.md`; and a pointer into the Testing section (§9) of `WEB_COMPONENT_GUIDELINES.md`, with emphasis on the "Avoid vacuous assertions" subsection. The agent writes ONLY test files — no implementation, no running tests. After it returns, run `git status` to confirm only test files were touched.

   b. **Implementation agent.** Spawn a second Agent with the same task text, the paths of the test files the previous agent wrote (as an external contract), and targeted pointers into `WEB_COMPONENT_GUIDELINES.md`: File Structure (§4), Component Implementation (§5), Styling (§6), plus Accessibility (§14) for cross-cutting tasks. The agent implements until the tests pass, then runs `yarn test --group {component-name}`, `yarn lint`, and `yarn lint:types`. These three commands are the implicit acceptance criteria for every task. For Phase 4 styling tasks, the agent also runs `yarn update:{base|lumo|aura} --group {component-name}`. For Phase 5 integration, also `yarn update:snapshots --group {component-name}`.

   c. **Review agent.** Spawn a third Agent with the uncommitted `git diff` and the task description. The prompt instructs it to challenge assumptions — "is there a simpler way?", "any duplication introduced?", "does this match the patterns of existing components?". It returns a short list of concerns or the word "none". Decide:
      - No concerns → proceed to the visual-verify step.
      - Purely stylistic concerns (renaming, minor restructuring, low-impact duplication) → spawn a small fix agent autonomously, then proceed. Do not ask.
      - Behavioral concerns (possible bug, mismatch with spec, missing edge case) → use AskUserQuestion: apply the suggestions via a fix agent, skip them, or stop for user intervention.

   d. **Visual-verify agent — Phase 4 and Phase 5 only.** For styling and integration tasks, spawn a fourth Agent (general-purpose; it has access to Playwright MCP). The agent ensures `yarn start` is running (start it in the background if needed), navigates to `/dev/{component-name}.html`, resizes to at least one narrow and one wide viewport, takes screenshots, and inspects for rendering / layout / pseudo-element / forced-colors / RTL / direction issues. If the dev page does not yet exercise the states the current task introduced, the agent may extend the dev page with additional variants before capturing screenshots. If it reports problems, use AskUserQuestion: dispatch a fix agent, stop for the user, or treat as a false positive and proceed. Reference screenshots were already refreshed by the implementation agent via `yarn update:*` — do NOT regenerate them here.

7. Commit. Run `git diff` for a final review, stage the changed files with explicit `git add {paths}` (avoid `git add -A`), and commit with message `feat({component}): task {N} — {title}`. Do NOT push.

8. Append a block for task N to `implementation-notes.md` per PROGRESS LOG FORMAT.

9. Report: task N complete, the commit hash, any spec adjustments made, any deferred review concerns. Tell the user to invoke this skill again to continue with task N+1.

SUBAGENT PROMPT STRUCTURE:

Each subagent starts with no prior context — the prompt must be fully self-contained. For every agent, include:

- The agent's role and what it must and must not do (test agent writes only tests; implementation agent writes code to satisfy existing tests; review agent returns a concerns list; visual-verify agent only inspects and reports).
- The full task text: Title, Spec sections, Requirements, Description, Tests.
- Paths to reference files: `packages/{component-name}/spec/web-component-spec.md` (with the specific sections to focus on), `packages/{component-name}/spec/web-component-api.md`, and `WEB_COMPONENT_GUIDELINES.md` with the list of sections relevant to the agent's role.
- Role-specific context:
  - Implementation agent: the paths of the test files written by the test agent.
  - Review agent: the current `git diff` output (pass it as text in the prompt — do not ask the agent to regenerate it).
  - Visual-verify agent: the dev page URL, the viewport widths to test, and the specific visual concerns for that task (e.g., "confirm separators are visible, confirm RTL flips the chevron").
- Spec-issue escape hatch: "if the task cannot be done as written (ambiguity, impossibility, contradiction, missing detail), stop and report the problem — do not guess, do not silently work around it."

HANDLING SPEC ISSUES:

When an agent reports that the task cannot be done as written, use AskUserQuestion with three options:

1. **Adjust spec in place** — for small corrections (typo, clarifying a name, fixing a local contradiction). The orchestrator edits `web-component-spec.md` directly, then re-spawns the agent. Log the adjustment in `implementation-notes.md`.

2. **Append a new task** — for larger gaps (missed feature, new behavior needed). The orchestrator appends a new task at the end of `web-component-tasks.md` describing the needed work. The current task either proceeds with what is doable, or is skipped pending the appended task. Log what was added and why.

3. **Stop for user** — bail out cleanly. The user inspects and resumes later with an explicit `TaskNumber`.

This is the only situation in which this skill is allowed to modify `web-component-spec.md` or `web-component-tasks.md`.

PROGRESS LOG FORMAT (`implementation-notes.md`):

On first run, create the file with a single header line:

```
# {ComponentName} Implementation Notes
```

After the task's commit, append:

```

## Task {N} — {Title}

- **Commit:** {hash}
- **Date:** {YYYY-MM-DD}
- **Decisions:** {short bullets, de-duplicated from the review agent's output}
- **Surprises:** {anything unexpected, or "—"}
- **Spec adjustments:** {what was changed or appended, or "—"}
```

The file is the source of truth for resume points and the audit trail of how the spec evolved during implementation.

IMPORTANT GUIDELINES:

- Do not write implementation, test, or review code directly — delegate to subagents.
- Do not push to remote — local commits only.
- Do not modify `requirements.md`, `web-component-api.md`, `problem-statement.md`, or `figma-design.md`. `web-component-spec.md` and `web-component-tasks.md` are modifiable only via the HANDLING SPEC ISSUES flow.
- If a subagent fails or produces incomplete work, stop and report the issue to the user via AskUserQuestion. Do not skip tasks.
- **Never auto-modify a previously-committed task.** If an agent suggests an earlier task needs revision, do NOT edit that task in `web-component-tasks.md`. Use AskUserQuestion: reopen the old task (user explicitly confirms, with the understanding that committed work loses its review protection) or append a new task at the end. Default recommendation: append.
