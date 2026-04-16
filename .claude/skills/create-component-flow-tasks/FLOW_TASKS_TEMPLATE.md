# {ComponentName} Flow Implementation Tasks

<!--
Ordered implementation tasks derived from flow-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch in the flow-components repository.

Primary input: packages/{component-name}/spec/flow-spec.md
API context: packages/{component-name}/spec/flow-developer-api.md
Traceability: packages/{component-name}/spec/requirements.md (universal + flow)

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate class declarations, method tables, or `@Synchronize` lists here.

Each task:
- Has a short descriptive title
- References spec sections and requirements (the implementer reads the spec for details)
- Lists explicit dependencies on prior tasks (enables parallel work)
- Lists files to create or modify (full paths from flow-components/ root)
- Defines test assertions (observable behavior, not implementation details)
- Includes acceptance criteria (tests pass, spotless + checkstyle clean, module compiles)

Tasks are organized in phases:
1. Scaffolding — module setup, class shells, smoke + serialisation tests
2. Core component features — constructors, properties, items, events, i18n, variants with unit tests
3. Server/client concerns — @Synchronize, connector, Signal support, disable-on-click
4. TestBench elements — query helpers
5. Integration tests — Route views + `*IT` classes mirroring unit-test assertions end-to-end
6. Final validation — spotless, checkstyle, mvn tests

Do NOT reorder tasks without verifying the dependency graph.
Do NOT add tasks for features not in the spec.
-->

## Spec References

- [flow-spec.md](flow-spec.md)
- [flow-developer-api.md](flow-developer-api.md)
- [requirements.md](requirements.md) — universal + flow
- [developer-api.md](developer-api.md) — web component API being wrapped
- [spec.md](spec.md) — web component spec (if present)

---

## Task 1: Scaffold vaadin-{name}-flow-parent module

**Spec sections:** Module / Package Layout
**Requirements:** —
**Depends on:** —

Create the three sub-modules (`-flow`, `-flow-integration-tests`, `-testbench`) with pom.xml wiring, empty class shells matching the spec's class declarations (annotations only, empty bodies), and a smoke/serialisation test. Wire the module into `flow-components/pom.xml` and BOM if applicable. See the Module / Package Layout section of flow-spec.md for the exact file list.

**Files:**
- `vaadin-{name}-flow-parent/pom.xml` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-flow/pom.xml` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-flow/src/main/java/com/vaadin/flow/component/{packageName}/{Name}.java` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-flow/src/test/java/com/vaadin/flow/component/{packageName}/tests/{Name}SerializableTest.java` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-flow-integration-tests/pom.xml` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-testbench/pom.xml` (create)
- `vaadin-{name}-flow-parent/vaadin-{name}-testbench/src/main/java/com/vaadin/flow/component/{packageName}/testbench/{Name}Element.java` (create)
- `pom.xml` (modify — add new module)

**Tests:**
- [ ] `new {Name}()` returns a non-null instance whose element tag is `vaadin-{name}`
- [ ] `{Name}SerializableTest` round-trips a `new {Name}()` through Java serialisation without throwing

**Acceptance criteria:**
- [ ] `mvn clean install -DskipTests -pl vaadin-{name}-flow-parent -am` succeeds
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` on the new module both clean
- [ ] All new tests pass; existing tests still pass

---

## Task 2: {Title}

**Spec sections:** ...
**Requirements:** ...
**Depends on:** 1

{What to implement and test in 2–4 sentences. Name the feature and point to the flow-spec.md sections that define it — do not restate the spec.}

**Files:**
- `vaadin-{name}-flow-parent/vaadin-{name}-flow/src/main/java/.../{Name}.java` (modify)
- `vaadin-{name}-flow-parent/vaadin-{name}-flow/src/test/java/.../{Name}Test.java` (create)

**Tests:**
- [ ] {Concrete behavioural test assertion}
- [ ] {Another assertion}

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes (no formatting changes required)
- [ ] `mvn checkstyle:check` passes

---

## Task 3: {Title}

...
