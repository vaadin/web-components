---
allowed-tools: Read,Write(packages/:*),Bash(mkdir -p packages/*/spec),Bash(ls flow-components),Bash(ls ../flow-components),AskUserQuestion
description: Break a Flow component specification into ordered, self-contained implementation tasks
---

This skill takes a component's `flow-spec.md` and produces an ordered list of Flow (Java) implementation tasks. Each task is a self-contained unit of work that includes its own tests, results in a merge-ready branch, and builds on prior tasks. The output follows a test-driven development approach: every task defines the tests first, then the implementation that makes them pass.

This is the Flow analogue of `create-component-tasks`. It is the last planning step in the Flow pipeline. The next step (`create-component-flow-implementation`) uses these tasks to write actual Java code under `flow-components/`.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/flow-spec.md`. This is the primary input — every task must trace back to content in the spec. If the file does not exist, stop and tell the user to run `create-component-flow-spec` first.

2. Read `packages/{component-name}/spec/requirements.md`. Use this for coverage verification in step 8 — every universal/flow requirement must be addressed by at least one task. If the file does not exist, stop and tell the user to run `create-component-requirements` first.

   **Variant filter.** Ignore requirements tagged `Applies to: web` — those are covered by `create-component-tasks` for the web component pipeline. Coverage verification applies only to `universal` and `flow` requirements.

3. Read `packages/{component-name}/spec/flow-developer-api.md`. The spec references this document throughout. Read it to understand the Java API rationale and usage examples behind each spec feature — this context informs how tasks are scoped and described.

4. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "The Flow tasks planning needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill." Read `{FLOW}/CLAUDE.md` to know the build/test commands and module conventions tasks must respect.

5. Parse the spec into implementation units. For each element in the spec, extract:
   - Class declaration (annotations, implemented shared mixin interfaces)
   - Constructors
   - Public methods (properties, events, slots, i18n, variants)
   - `@Synchronize`d properties and their change events
   - Connector (if needed)
   - TestBench element query methods
   - Dependencies between features (e.g., the items API depends on the item class; events depend on the main component class)

6. Break down into ordered tasks following the PHASE STRUCTURE below.

7. Assign explicit dependencies to each task following the DEPENDENCY RULES below.

8. Verify coverage:
   - Every universal/flow requirement number in `requirements.md` must appear in at least one task's Requirements line.
   - Every public class, method, event, i18n field, theme variant, connector, and TestBench query method in `flow-spec.md` must be addressed by at least one task.
   - If `flow-spec.md` lists proposed adjustments to shared `vaadin-flow-components-base` modules, create explicit tasks for those adjustments — they must be completed before the tasks that depend on them.

   If any item is not covered, add it to an existing task or create a new task for it.

9. Read `FLOW_TASKS_TEMPLATE.md` in this skill's directory. Write the tasks at `packages/{component-name}/spec/flow-tasks.md`, following the template structure.

PHASE STRUCTURE:

Organize tasks into these phases, in order. Each phase builds on the previous one.

**Phase 1 — Scaffolding.** One task that creates `vaadin-{name}-flow-parent/` with its three sub-modules:

- `vaadin-{name}-flow/` — `pom.xml` wired into the parent, `src/main/java/...` directory with empty `{Name}.java` (class header only: `@Tag`, `@NpmPackage`, `@JsModule`, `extends Component`, correct implemented interfaces, empty body), empty `{Name}Item.java` / `Has{Name}Items.java` / `{Name}Variant.java` / `{Name}I18n.java` as applicable. License headers following `flow-components` convention (`checkstyle` file at repo root is the authoritative format).
- `vaadin-{name}-flow-integration-tests/` — `pom.xml`, empty `src/main/java/...` test-view package, empty `src/test/java/...` IT package.
- `vaadin-{name}-testbench/` — `pom.xml`, `src/main/java/...` with empty `{Name}Element.java` / `{Name}ItemElement.java`.
- Wire the new module into the top-level `flow-components/pom.xml` and into `flow-components-bom` if that BOM aggregates modules.
- Smoke test: one JUnit test asserts the component is instantiable (`new {Name}()`) without throwing, and one `SerializableTest` verifies the component can be serialised.

This task includes `mvn clean install -DskipTests -pl vaadin-{name}-flow-parent -am` to prove the module compiles.

**Phase 2 — Core component features.** One task per feature or tightly coupled feature group from the spec:

- Main component constructors + properties / slots / i18n / theme variants — one task each, or grouped when tightly coupled.
- Child item class (if applicable) — constructors + properties + `Has{Name}Items` interface, typically grouped.
- Events — one task per event class (or grouped if they are simple variants of each other). Each task includes a unit test verifying that a listener fires with the expected payload when a simulated DOM event arrives.
- i18n class + `setI18n`/`getI18n` serialisation — one task.
- Theme variant enum + tests — one task.

Each task includes unit tests (JUnit 6) beside the implementation.

**Phase 3 — Server/client concerns.**

- `@Synchronize` wiring for any client properties the server must observe — one task.
- Connector (if needed) — one task that adds the connector JS file, the attach-handler wiring, and the client-side regeneration logic. Includes a Mockito-backed unit test and a placeholder IT assertion.
- Signal support (`SignalPropertySupport<T>` + Signal-bound constructors/setters) — one task per property that accepts a Signal.
- Router-agnostic path/URL exposure — typically folded into the properties task; no separate task unless the component has non-trivial URL-building logic.
- Disable-on-click reuse (if applicable) — one task that wires `DisableOnClickController<{Name}>`.

**Phase 4 — TestBench elements.** One task per TestBench class. Each task includes an IT assertion using the new element to prove the query methods resolve.

**Phase 5 — Integration tests.** One task per test view + corresponding `*IT` class. Views sit in `-flow-integration-tests/src/main/java/.../tests/`, ITs in `-flow-integration-tests/src/test/java/.../tests/`. The aggregate must cover every universal/flow requirement end-to-end.

**Phase 6 — Final validation.** One task covering:
- `mvn spotless:apply` and `mvn checkstyle:check` for the new module.
- Unit tests: `mvn test -pl vaadin-{name}-flow-parent/vaadin-{name}-flow`.
- Integration tests: `mvn verify -am -pl vaadin-{name}-flow-parent/vaadin-{name}-flow-integration-tests -DskipUnitTests`.
- Update `flow-components/README.md` and any BOM references if the project convention requires listing new modules.

TASK STRUCTURE:

Every task (except scaffolding) follows a test-driven approach. Each task results in a self-contained, merge-ready branch.

Tasks are pointers into the spec, not a second copy of it. The description says *what* to implement and which spec sections contain the details — the implementer reads the spec for the full picture. Do not repeat class declarations, method tables, or `@Synchronize` lists that the spec already defines.

Each task in the output document must include:

- **Title** — short, descriptive
- **Spec sections** — which sections of `flow-spec.md` the task addresses (by name)
- **Requirements** — which universal/flow requirement numbers from `requirements.md` the task covers
- **Depends on** — prerequisite task numbers (see DEPENDENCY RULES)
- **Description** — what to implement and test, in 2–4 sentences. Name the feature and the spec sections that define it. Do not restate the spec — point to it.
- **Files** — every file to create or modify, with full paths from `flow-components/` root and `(create)` or `(modify)` annotation
- **Tests** — behavioral assertions to verify the feature works. Describe the expected outcome, not implementation details. Keep assertions at the level of "what the Java developer or end user observes".
- **Acceptance criteria** — meta checks: all new tests pass, existing tests still pass, `mvn spotless:apply` + `mvn checkstyle:check` clean, module compiles

DEPENDENCY RULES:

Every task has a `Depends on:` field listing the task numbers it requires to be completed first. Use these rules to assign dependencies:

- Task 1 (scaffolding) has no dependencies.
- A task depends on the scaffolding task if it is the first task to touch its module.
- A task depends on another task if it uses classes, methods, events, or constructors introduced by that task.
- A task depends on another task if its tests require functionality from that task.
- Do not list transitive dependencies. If Task 3 depends on Task 2 and Task 2 depends on Task 1, Task 3 lists only Task 2 — not Task 1.
- When two tasks have no dependency relationship, they can be implemented in parallel on separate branches.
- Tasks that modify shared `vaadin-flow-components-base` code (from `flow-spec.md`'s Reuse section) must come before any task in the new module that depends on the shared change.

TASK GRANULARITY:

- A task should be completable in a single focused session. If a task has more than 8–10 test assertions, consider splitting it.
- A task must be testable after completion. The tests defined in the task must be runnable and passing after the task is done.
- A task should touch at most 2–3 Java classes. If a feature spans all classes (e.g. a shared serialisation contract), keep it as one task only if the changes are uniform. Otherwise, split by class.
- Group tightly coupled behaviors into one task when they cannot function independently — e.g., an item class and the `Has{Name}Items` interface that adds it are one task.
- Keep loosely related behaviors in separate tasks, even if they are in the same spec section.

IMPORTANT GUIDELINES:

- Do not invent features or tasks that the spec does not support. Every task must trace to `flow-spec.md` content.
- Do not modify `flow-spec.md`, `flow-developer-api.md`, `spec.md`, `developer-api.md`, `requirements.md`, or `problem-statement.md`.
- Do not produce implementation code. The output is a task plan, not source code.
- If the spec is ambiguous about implementation order or dependencies, use AskUserQuestion to resolve the ambiguity before writing it into the tasks. Do not guess.
- When the spec has a Reuse and Proposed Adjustments section, reference the specific shared modules to reuse in the relevant task descriptions. If the spec proposes modifications to shared modules, create explicit tasks for those modifications — they must be completed before the tasks that depend on them.
- The output is ONLY the `flow-tasks.md` file — nothing else.
