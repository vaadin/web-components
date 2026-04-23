---
allowed-tools: Read,Write(packages/:*),Bash(mkdir -p packages/*/spec),AskUserQuestion
description: Break a component specification into ordered, self-contained implementation tasks
user-invocable: false
---

This skill takes a component's `web-component-spec.md` and produces an ordered list of implementation tasks. Each task is a self-contained unit of work that includes its own tests, results in a merge-ready branch, and builds on prior tasks. The output follows a test-driven development approach: every task defines the tests first, then the implementation that makes them pass.

This is the last planning step in the spec-driven development pipeline. The next step (`create-component-web-component-implementation`) uses these tasks to write actual code. Steps 1–4 defined the problem, researched requirements, designed the developer API, and produced a full implementation specification. Step 5 (Figma design) is optional. This step translates the specification into an actionable implementation plan.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/web-component-spec.md`. This is the primary input — every task must trace back to content in the spec. If the file does not exist, stop and tell the user to run `create-component-web-component-spec` first.

2. Read `packages/{component-name}/spec/requirements.md`. Use this for coverage verification in step 9 — every requirement must be addressed by at least one task. If the file does not exist, stop and tell the user to run `create-component-requirements` first.

   **Variant filter.** A requirement may carry an optional visible `**Applies to:** universal | web | flow` line directly under its title (default: `universal` when the line is absent). This skill produces web component implementation tasks, so ignore any requirement tagged `**Applies to:** flow` — those are covered by `create-component-flow-tasks`. Coverage verification in step 9 applies only to `universal` and `web` requirements.

3. Read `packages/{component-name}/spec/web-component-api.md`. The spec references this document by section number/name in Key Design Decisions and throughout the implementation details. Read it to understand the API rationale and usage examples behind each spec feature — this context informs how tasks are scoped and described.

4. Check if `packages/{component-name}/spec/figma-design.md` exists. If present, read it and reference the Figma design in theme styling tasks as visual guidance. If absent, proceed without it — Figma designs are optional.

5. Read the sections of `WEB_COMPONENT_GUIDELINES.md` that matter for task planning. The document is 2362 lines; do not read it end to end. Read these sections directly using offset/limit:
   - **File Structure (§4)** — drives the file list the scaffolding task must produce
   - **Component Implementation (§5)** — mixin chains and render patterns that shape Phase 2 tasks
   - **Styling (§6)** — styling constraints that must appear in task descriptions
   - **Testing (§9)**, especially the "Avoid vacuous assertions" subsection — every test assertion written into a task must pass this bar
   - **Accessibility (§14)** — drives the cross-cutting ARIA / keyboard / RTL task
   - **Checklist (§17, from ~line 2136)** — the completeness reference; every checklist item must be covered by at least one task

   Skip Installation, Packaging, Theme Comparison appendices, and Notes — they are not relevant to task planning. Open them only if a specific task genuinely needs them.

6. Parse the spec into implementation units. For each element in the spec, extract:
   - Mixin chain
   - Shadow DOM structure
   - Properties, slots, parts, events, CSS custom properties
   - Internal behavior subsections
   - Dependencies between behaviors (e.g., overflow depends on the list container, mobile mode depends on overflow)

7. Break down into ordered tasks following the PHASE STRUCTURE below.

8. Assign explicit dependencies to each task following the DEPENDENCY RULES below.

9. Verify coverage:
   - Every requirement number in `requirements.md` must appear in at least one task's Requirements line.
   - Every element, property, slot, part, event, and CSS custom property in `web-component-spec.md` must be addressed by at least one task.
   - Every item in the `WEB_COMPONENT_GUIDELINES.md` Checklist must be covered by at least one task.

   If any item is not covered, add it to an existing task or create a new task for it.

10. Self-review the task list before writing. Pass through the full list once more and check for:
    - **Dependency cycles.** No task transitively depends on itself.
    - **Unnecessary serialization.** Two tasks that don't actually share data/structure should have independent `Depends on:` lines — don't chain them just because they sit next to each other.
    - **Vague test assertions.** Every assertion must describe an observable outcome specific enough to fail if the behavior regresses. Reject phrasing like "component works correctly" or "renders as expected".
    - **Oversized tasks.** A task with more than ~10 test assertions should be split, unless the assertions are genuinely one tightly-coupled feature.
    - **Missed coverage** (second pass over step 9, with fresh eyes).

    Fix in place before proceeding.

11. Read `TASKS_TEMPLATE.md` in this skill's directory. Write the tasks at `packages/{component-name}/spec/web-component-tasks.md`, following the template structure.

PHASE STRUCTURE:

Organize tasks into these phases, in order. Each phase builds on the previous one.

**Phase 1 — Scaffolding.** One task that creates the package directory, `package.json`, `LICENSE`, `README.md`, root export files, root `.d.ts` files, source files with empty element classes (correct mixin chains, empty `render()`, `static get is()`, `static get styles()`), TypeScript definitions for source files, base styles files (structural CSS only), the test directory structure, and a minimal dev page at `dev/{component-name}.html` that imports the main entry and shows a default instance of the component. The dev page exists from Phase 1 so that visual verification in later phases has something to render; subsequent feature tasks extend it with additional variants. This task includes a basic smoke test: the element registers and renders without errors. The goal is a clean package that passes `yarn lint` and `yarn lint:types`.

**Phase 2 — Core features.** One task per feature or tightly coupled feature group. Each task adds behavior to the component and includes unit tests that verify that behavior. Order tasks by dependency — properties before behaviors that depend on them, child element features before container features that observe children. Group tightly coupled behaviors into one task when they cannot function independently (e.g., a property and the rendering logic that uses it). Keep loosely related behaviors in separate tasks.

**Phase 3 — Cross-cutting concerns.** Focused tasks for behaviors that span multiple elements:
- Accessibility: ARIA roles, attributes, and live-region announcements across all elements. Include accessibility tests.
- Keyboard navigation: Tab order, key handlers, focus management. Include keyboard interaction tests.
- RTL support: Verify logical CSS properties, separator/icon mirroring. Include RTL-specific tests.

These may be combined into fewer tasks when they are tightly coupled for the specific component.

**Phase 4 — Styling.** Three tasks:
1. Base styles completion — full state selectors (`:host([disabled])`, `:host([current])`, etc.), forced-colors mode, all CSS custom property hookups. Includes base visual tests.
2. Lumo theme — public CSS file (`packages/vaadin-lumo-styles/components/{name}.css`), implementation CSS file (`packages/vaadin-lumo-styles/src/components/{name}.css`), token bindings, import registration. Includes Lumo visual tests. Reference `figma-design.md` for visual alignment if it exists.
3. Aura theme — component CSS file (`packages/aura/src/components/{name}.css`), import in `packages/aura/aura.css`, token bindings. Includes Aura visual tests. Reference `figma-design.md` for visual alignment if it exists.

**Phase 5 — Integration.** One task covering:
- Final review of the dev page (created in Phase 1, extended by feature tasks) — ensure every major variant is exercised
- DOM snapshot tests
- TypeScript type tests
- Final validation: `yarn lint`, `yarn lint:types`, `yarn test --group {name}`, `yarn test:snapshots --group {name}`, `yarn test:base --group {name}`, `yarn test:lumo --group {name}`, `yarn test:aura --group {name}`

TASK STRUCTURE:

Every task (except scaffolding) follows a test-driven approach. Each task results in a self-contained, merge-ready branch.

Tasks are pointers into the spec, not a second copy of it. The description says *what* to implement and which spec sections contain the details — the implementer reads the spec for the full picture. Do not repeat shadow DOM structures, property tables, mixin chains, or behavioral logic that the spec already defines.

Each task in the output document must include:

- **Title** — short, descriptive
- **Spec sections** — which sections of `web-component-spec.md` the task addresses (by name). This is how the implementer finds the details.
- **Requirements** — which requirement numbers from `requirements.md` the task covers
- **Depends on** — prerequisite task numbers (see DEPENDENCY RULES)
- **Description** — what to implement and test, in 2–4 sentences. Name the feature and the spec sections that define it. Do not restate the spec — point to it.
- **Tests** — a plain bullet list of behavioral assertions that verify the feature works. Describe the expected outcome, not implementation details. Keep assertions at the level of "what the user or developer observes." No checkboxes.

Do NOT include a `Files` list. The implementation agent infers files from the spec and codebase patterns; an explicit list constrains it unhelpfully and adds no value for a human reader.

Do NOT include a generic `Acceptance criteria` section (tests pass, lint clean, types compile). Those checks run as standard post-task steps in the implementation skill — restating them on every task is noise. Only include task-specific acceptance notes in the Description if the task has a genuinely unique gate.

DEPENDENCY RULES:

Every task has a `Depends on:` field listing the task numbers it requires to be completed first. Use these rules to assign dependencies:

- Task 1 (scaffolding) has no dependencies.
- A task depends on the scaffolding task if it is the first task to touch that element.
- A task depends on another task if it uses properties, slots, DOM structure, or behaviors introduced by that task.
- A task depends on another task if its tests require functionality from that task.
- Do not list transitive dependencies. If Task 3 depends on Task 2 and Task 2 depends on Task 1, Task 3 lists only Task 2 — not Task 1.
- When two tasks have no dependency relationship, they can be implemented in parallel on separate branches.

TASK GRANULARITY:

- A task should be completable in a single focused session. If a task has more than 8–10 test assertions, consider splitting it.
- A task must be testable after completion. The tests defined in the task must be runnable and passing after the task is done.
- A task should touch at most 2–3 elements. If a feature spans all elements, keep it as one task only if the changes are uniform. Otherwise, split by element.
- Group tightly coupled behaviors into one task when they cannot function independently. For example: a `path` property and the link rendering logic that uses it are one task because `path` is meaningless without the `<a>` element.
- Keep loosely related behaviors in separate tasks, even if they are in the same spec section.

IMPORTANT GUIDELINES:

- Do not invent features or tasks that the spec does not support. Every task must trace to spec content.
- Do not modify `web-component-spec.md`, `requirements.md`, `web-component-api.md`, or `problem-statement.md`.
- Do not produce implementation code. The output is a task plan, not source code.
- If the spec is ambiguous about implementation order or dependencies, use AskUserQuestion to resolve the ambiguity before writing it into the tasks. Do not guess.
- Include the experimental feature flag setup in the scaffolding task (referencing the pattern from `@vaadin/component-base/src/define.js`).
- When the spec has a Reuse and Proposed Adjustments section, reference the specific shared modules to reuse in the relevant task descriptions. If the spec proposes modifications to existing shared modules, create explicit tasks for those modifications — they must be completed before the tasks that depend on them.
- The output is ONLY the tasks file — nothing else.
