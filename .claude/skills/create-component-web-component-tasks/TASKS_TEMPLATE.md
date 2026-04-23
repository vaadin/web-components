# {ComponentName} Implementation Tasks

<!--
Ordered implementation tasks derived from web-component-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch.

Primary input: packages/{component-name}/spec/web-component-spec.md
API context: packages/{component-name}/spec/web-component-api.md
Traceability: packages/{component-name}/spec/requirements.md

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate shadow DOM structures, property tables, or behavioral logic here.

Each task:
- Has a short descriptive title
- References spec sections and requirements (the implementer reads the spec for details)
- Lists explicit dependencies on prior tasks (for ordering clarity)
- Defines test assertions (observable behavior, not implementation details)

The implementation skill always runs `yarn test`, `yarn lint`, and `yarn lint:types` after each task — do not add a per-task acceptance-criteria block for those.

Tasks are organized in phases:
1. Scaffolding — package setup, element shells, smoke tests
2. Core features — one per feature with unit tests
3. Cross-cutting — accessibility, keyboard, RTL with tests
4. Styling — base styles, Lumo, Aura with visual tests
5. Integration — dev page, snapshots, type tests, final validation

Do NOT reorder tasks without verifying the dependency graph.
Do NOT add tasks for features not in the spec.
-->

## Spec References

- [web-component-spec.md](web-component-spec.md)
- [requirements.md](requirements.md)
- [web-component-api.md](web-component-api.md)
- [figma-design.md](figma-design.md) *(if exists)*

---

## Task 1: {Title}

**Spec sections:** {which sections of web-component-spec.md this addresses}
**Requirements:** {requirement numbers, e.g., "1, 2" or "—" if none}
**Depends on:** —

{What to implement and test in 2-4 sentences. Name the feature and point to the spec sections that define it — do not restate the spec.}

**Tests:**
- {Concrete test assertion — what the user or developer observes, e.g., "the element is defined as a custom element with tag name `vaadin-{name}`"}
- {Another assertion — what the user or developer observes, e.g., "the element renders a shadow root containing a `<slot>`"}

---

## Task 2: {Title}

**Spec sections:** ...
**Requirements:** ...
**Depends on:** 1

...
