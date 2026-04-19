---
allowed-tools: Read(packages/*/spec/*),Agent,Bash(git add *),Bash(git diff *),Bash(git status),Bash(git commit *),AskUserQuestion
description: Implement all tasks from a component's web-component-tasks.md, one subagent and one commit per task
---

This skill implements a component by iterating through its `web-component-tasks.md` and spawning one subagent per task. Each subagent gets a fresh context with only the information it needs — avoiding context rot across many tasks. After each subagent completes, the orchestrator commits the changes. The result is one commit per task on the current branch, with no push to remote.

Arguments: [ComponentName] [StartFromTask?]

`ComponentName` is required. `StartFromTask` is optional (default: 1) — use it to resume after a failure.

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/web-component-tasks.md`. If the file does not exist, stop and tell the user to run `create-component-tasks` first.

2. Parse all tasks from the file. For each task, extract: task number, title, spec sections, requirements, dependencies, description, files list, test assertions, and acceptance criteria.

3. Read `packages/{component-name}/spec/web-component-spec.md` and `packages/{component-name}/spec/web-component-api.md` to understand the component and build informed subagent prompts. Do NOT read source code of other components — codebase research is the subagent's responsibility.

4. Starting from task 1 (or `StartFromTask`), process tasks respecting their dependency graph:

   a. **Respect task dependencies.** Each task has a `Depends on:` field listing prerequisite task numbers. A task may only begin after all its dependencies are committed. Tasks with no dependency relationship between them may be spawned as parallel agents in a single message. Build a simple dependency graph from the parsed tasks to determine which tasks can run concurrently and which must be sequential.

   b. **Verify prerequisites** (only when using `StartFromTask`). Before spawning a task, check that the files its dependencies listed with `(create)` exist using Glob. If prerequisites are missing, stop and tell the user — earlier tasks must be completed before resuming from this point. When running from task 1, the orchestrator satisfies dependencies naturally by processing tasks in graph order.

   c. **Spawn an Agent** with a self-contained prompt. The agent has no prior context — include everything it needs. Follow the SUBAGENT PROMPT STRUCTURE below.

   d. **After the agent completes**, run `git status` and `git diff` to review changes. Verify that the files listed in the task were actually created or modified. If critical files are missing, report the issue to the user via AskUserQuestion before continuing.

   e. **Commit** the changes. Stage only files relevant to the task using `git add {files}`. Commit with message `feat({component}): task {N} — {title}`. Do NOT push!

   f. **Continue** to the next eligible task(s).

5. After all tasks are complete, report a summary: which tasks were committed and total commit count.

SUBAGENT PROMPT STRUCTURE:

Each subagent prompt must be self-contained. Include:

- The full task text from web-component-tasks.md (title, spec sections, description, files, tests, acceptance criteria)
- Paths to reference files: `packages/{component-name}/spec/web-component-spec.md` (with the specific sections to focus on), `packages/{component-name}/spec/web-component-api.md`, and `WEB_COMPONENT_GUIDELINES.md`
- Implementation instructions:
  1. Read the referenced spec sections for implementation details
  2. Read `WEB_COMPONENT_GUIDELINES.md` in batches (500 lines at a time) for conventions. The styling pitfalls section (cross-shadow-DOM styling, dropdown positioning, inline button padding) and the testing section (vacuous assertions, DOM-order assumptions in index tests) contain constraints that directly affect correctness — pay particular attention to those.
  3. Study existing similar components using Glob and Grep to match patterns
  4. Write tests first — translate every test assertion from the task into a test case
  5. Implement the code to make tests pass
  6. Run `yarn test --group {component-name}`, `yarn lint`, `yarn lint:types` and fix until all pass
- For Phase 4 styling tasks: also run `yarn update:{base|lumo|aura} --group {component-name}` to generate reference screenshots
- For Phase 5 integration task: also run `yarn update:snapshots --group {component-name}`
- Rules: follow the spec exactly, match existing component patterns, do not implement work belonging to other tasks, do not modify spec pipeline files, do not add features not in the spec

IMPORTANT GUIDELINES:

- Do not write implementation code directly — delegate to subagents.
- Do not push to remote — local commits only.
- Do not modify spec pipeline files (`web-component-spec.md`, `web-component-tasks.md`, `requirements.md`, `web-component-api.md`, `problem-statement.md`, `figma-design.md`).
- If a subagent fails or produces incomplete work, stop and report the issue to the user via AskUserQuestion. Do not skip tasks.
- If the spec is ambiguous about implementation details, use AskUserQuestion to resolve the ambiguity before passing instructions to the subagent. Do not guess.
