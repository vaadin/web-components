---
allowed-tools: Read(packages/*/spec/*),Read(flow-components/**),Read(../flow-components/**),Agent,Bash(ls flow-components),Bash(ls ../flow-components),Bash(cd flow-components && git *),Bash(cd ../flow-components && git *),AskUserQuestion
description: Implement all tasks from a component's flow-tasks.md, one subagent and one commit per task, inside the flow-components repository
---

This skill implements a Flow component by iterating through its `flow-tasks.md` and spawning one subagent per task. Each subagent gets a fresh context with only the information it needs — avoiding context rot across many tasks. After each subagent completes, the orchestrator commits the changes. The result is one commit per task on the current branch of the `flow-components` repository, with no push to remote.

This is the final step in the Flow variant of the spec-driven development pipeline. Steps 1–5 produced the problem statement, requirements, web developer API, Flow developer API, Flow specification, and Flow task breakdown. This step writes actual Java code.

Arguments: [ComponentName] [StartFromTask?]

`ComponentName` is required. `StartFromTask` is optional (default: 1) — use it to resume after a failure.

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/flow-tasks.md`. If the file does not exist, stop and tell the user to run `create-component-flow-tasks` first.

2. Parse all tasks from the file. For each task, extract: task number, title, spec sections, requirements, dependencies, description, files list, test assertions, and acceptance criteria.

3. Read `packages/{component-name}/spec/flow-spec.md` and `packages/{component-name}/spec/flow-developer-api.md` to understand the component and build informed subagent prompts. Do NOT read source code of other components — codebase research is the subagent's responsibility.

4. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "The Flow implementation needs the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill." The located path is referred to as `{FLOW}` below. All subsequent commits must be made from inside this directory (`cd {FLOW} && git ...`).

5. Starting from task 1 (or `StartFromTask`), process tasks respecting their dependency graph:

   a. **Respect task dependencies.** Each task has a `Depends on:` field listing prerequisite task numbers. A task may only begin after all its dependencies are committed. Tasks with no dependency relationship between them may be spawned as parallel agents in a single message. Build a simple dependency graph from the parsed tasks to determine which tasks can run concurrently and which must be sequential.

   b. **Verify prerequisites** (only when using `StartFromTask`). Before spawning a task, check that the files its dependencies listed with `(create)` exist inside `{FLOW}/` using Glob. If prerequisites are missing, stop and tell the user — earlier tasks must be completed before resuming from this point. When running from task 1, the orchestrator satisfies dependencies naturally by processing tasks in graph order.

   c. **Spawn an Agent** with a self-contained prompt. The agent has no prior context — include everything it needs. Follow the SUBAGENT PROMPT STRUCTURE below.

   d. **After the agent completes**, run `cd {FLOW} && git status` and `cd {FLOW} && git diff` to review changes. Verify that the files listed in the task were actually created or modified inside `{FLOW}/`. If critical files are missing, report the issue to the user via AskUserQuestion before continuing.

   e. **Commit** the changes. Stage only files relevant to the task using `cd {FLOW} && git add {files}`. Commit with message `feat({component}-flow): task {N} — {title}`. Do NOT push!

   f. **Continue** to the next eligible task(s).

6. After all tasks are complete, report a summary: which tasks were committed and total commit count inside `{FLOW}/`.

SUBAGENT PROMPT STRUCTURE:

Each subagent prompt must be self-contained. Include:

- The full task text from `flow-tasks.md` (title, spec sections, description, files, tests, acceptance criteria)
- The absolute path of the `flow-components/` repository (`{FLOW}`) and an instruction that ALL paths in the Files list are relative to that directory
- Paths to reference files (still inside the web-components monorepo): `packages/{component-name}/spec/flow-spec.md` (with the specific sections to focus on), `packages/{component-name}/spec/flow-developer-api.md`, `packages/{component-name}/spec/developer-api.md`, `packages/{component-name}/spec/spec.md` (if it exists), and `{FLOW}/CLAUDE.md`
- Implementation instructions:
  1. Read the referenced Flow spec sections for implementation details
  2. Read `{FLOW}/CLAUDE.md` for build/test commands and module conventions
  3. Study existing similar components in `{FLOW}/` using Glob and Grep to match patterns — in particular the ones called out in `flow-spec.md`'s Key Design Decisions as analogues (e.g. `vaadin-side-nav-flow-parent` for hierarchical items, `vaadin-menu-bar-flow-parent` for data-driven items with connector)
  4. Study shared mixin interfaces under `{FLOW}/vaadin-flow-components-shared-parent/vaadin-flow-components-base/src/main/java/com/vaadin/flow/component/shared/` when the spec calls for composing them
  5. Write tests first — translate every test assertion from the task into a JUnit 6 test case. For integration tests, follow the `AbstractComponentIT`-based pattern
  6. Implement the Java code to make tests pass
  7. Run `cd {FLOW} && mvn spotless:apply && mvn checkstyle:check -pl vaadin-{name}-flow-parent -am` and fix until clean
  8. Run `cd {FLOW} && mvn test -pl vaadin-{name}-flow-parent/vaadin-{name}-flow` (or the sub-module the task touches) and fix until all pass
  9. For tasks in Phase 5 (integration tests) or any task producing an `*IT` class, additionally run `cd {FLOW} && mvn verify -am -pl vaadin-{name}-flow-parent/vaadin-{name}-flow-integration-tests -DskipUnitTests` and fix until all pass
- Rules: follow the Flow spec exactly, match existing component patterns, do not implement work belonging to other tasks, do not modify spec pipeline files (anything under `packages/{name}/spec/`), do not add features not in the spec, all fields must be `Serializable`, do not embed router calls (`RouteConfiguration`) inside the component, do not push commits

IMPORTANT GUIDELINES:

- Do not write implementation code directly — delegate to subagents.
- Do not push to remote — local commits only, inside `{FLOW}/`.
- Do not modify spec pipeline files (`flow-spec.md`, `flow-tasks.md`, `flow-developer-api.md`, `spec.md`, `developer-api.md`, `requirements.md`, `problem-statement.md`, `figma-design.md`).
- If a subagent fails or produces incomplete work, stop and report the issue to the user via AskUserQuestion. Do not skip tasks.
- If the spec is ambiguous about implementation details, use AskUserQuestion to resolve the ambiguity before passing instructions to the subagent. Do not guess.
- Commits are made inside `{FLOW}/` (the Flow components repo), not inside the web-components monorepo. Verify with `cd {FLOW} && git status` before each commit.
