---
name: component-api-explore
description: Read-only cross-repo investigation of an existing component's conventions and data-path before designing a new API surface
argument-hint: <component(s)> <capability>
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(ls:*), Bash(find:*), Bash(mkdir -p packages/*/spec/api-design), Write(packages/*/spec/api-design/*)
---

Investigate how the capability $1 should attach to the existing component(s) $0, by sampling live conventions and tracing the closest existing mechanism across the **web-components** (WC) and **flow-components** (Flow) repos.

This is the **pre-spec API-discovery phase**. Unlike the SDD `create-component-*-api` skills — which deliberately design from a blank slate and forbid reading source — this skill *evolves an existing* component, so reading WC + Flow source is the whole point. The output is the input to SDD's API design step.

This skill is **read-only**. It produces exactly one artifact and changes no source.

## Steps

1. **Frame the change.** Restate the capability $1 in one sentence and name the component(s) $0 it attaches to. Note any scope boundaries (e.g. "sorter and selection, but not filter — Flow doesn't use filter"). If the scope is unclear, state your assumption explicitly in the output rather than guessing silently.

2. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "Cross-repo exploration needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill."

3. **Sample live conventions (WC).** For each component in $0, read the relevant `packages/{component}/src/` files and find:
   - the reference component(s) and the mixins in play (e.g. `ElementMixin`, `ThemableMixin`, component-specific mixins);
   - the naming family for the WC property class this capability falls into (e.g. per-item value functions use `xxxGenerator` like `cellPartNameGenerator`; per-item predicates use an `isXxx` / `xxxFilter` function like `isItemSelectable` or `dropFilter`);
   - the shape of the test files (`packages/{component}/test/`) and theme/style files;
   - recent related moves: `git log --oneline -20 -- packages/{component}/src` (and the specific area file) to see how similar capabilities landed.

4. **Sample live conventions (Flow).** In the located flow-components repo, find the matching Java class(es) and:
   - the naming family for the Flow side (e.g. per-item value functions use `setXxxGenerator` like `setPartNameGenerator`; per-item predicates use `setXxxProvider` like `setItemSelectableProvider`);
   - whether the relevant config is reachable publicly (e.g. `GridSelectionColumn` is not — selection config is exposed via `GridMultiSelectionModel`, with `setDragSelect` as a precedent);
   - read only class declarations and public signatures, not method bodies.

5. **Trace the closest existing data-path end-to-end.** Pick the nearest existing analog to $1 and trace every hop from the public API down to the rendered consumer, recording `file:line` for each. The hops depend on the component's architecture:
   - **Data-bound components (Grid, ComboBox)** — the path usually crosses repos: **Java setter / `DataGenerator`** writes a value (e.g. `generateSelectableData`) → **JSON key (per-item)** (e.g. `"selectable"`) → **connector wiring** reads the key (e.g. `grid.isItemSelectable`) → **WC consumer** applies it (e.g. `__isItemSelectable`).
   - **Non-data-bound components (fields like date-picker)** — there may be **no Java transport at all**. The path is a pure WC fan-out from the host property down to the rendered element (e.g. `isDateDisabled`: host → overlay content → each month-calendar → cell), and the Flow side is a single-property field with no `DataProvider` / `DataGenerator` / per-item connector channel. Trace the WC fan-out hops, and read the Flow class to confirm whether any per-item transport exists.
   - **Decide explicitly: does an existing per-item transport exist?** If **yes**, `component-api-contract` *maps* it. If **no**, `component-api-contract` must *define a new channel* — record that conclusion here so compare/contract know it up front. This is often the single most important finding for a non-data-bound component.
   - Note other precedents that travel the same path (e.g. `tooltipGenerator`, `cellPartNameGenerator`, `dropFilter`) and where the connector wires per-item functions.

6. **Write the artifact.** Create the directory with `mkdir -p packages/{component}/spec/api-design` and write `packages/{component}/spec/api-design/explore.md` in the format below. Use the primary component for the path when $0 names several. Do not edit any source file.

## Output format — `explore.md`

```markdown
# API exploration — {component(s)}: {capability}

## (a) Conventions snapshot

- **Reference component(s):** {names + paths}
- **Mixins in play:** {ElementMixin, ThemableMixin, ...} — file:line
- **WC naming family:** {e.g. `xxxGenerator` for per-item values like `cellPartNameGenerator`; `isXxx` / `xxxFilter` for predicates like `isItemSelectable`} — examples with file:line
- **Flow naming family:** {e.g. `setXxxGenerator` like `setPartNameGenerator`; `setXxxProvider` like `setItemSelectableProvider`} — examples with file:line
- **Public reachability (Flow):** {what is/isn't publicly reachable, and the precedent for exposing it} — file:line
- **Test file shape:** {path + how a similar feature is tested}
- **Theme/style file shape:** {path}
- **Recent related moves:** {git log --oneline highlights for the area}

## (b) End-to-end data-path trace

Closest existing analog: `{e.g. setItemSelectableProvider; or isDateDisabled for a non-data-bound field}`

**Existing per-item transport?** {YES — the contract maps it / NO — the contract must define a NEW channel}

| Hop | Mechanism | Location |
| --- | --- | --- |
| {Java setter / DataGenerator — omit row if no Java transport} | `{generateSelectableData}` | `{file:line}` |
| {JSON key (per-item) — omit row if none} | `"{selectable}"` | `{file:line}` |
| {Connector wiring — omit row if none} | `{grid.isItemSelectable}` | `{file:line}` |
| {WC consumer / rendered element} | `{__isItemSelectable}` | `{file:line}` |

(For a non-data-bound component, drop the Java/JSON/connector rows and list the WC fan-out hops instead: host property → overlay/child → … → rendered element.)

**Reusable pattern:** {one paragraph — how this transport already exists and how the new capability rides it, OR why no transport exists and what a new channel would need}

**Other precedents on the same path:** {tooltipGenerator, cellPartNameGenerator, dropFilter — file:line each}

## Candidate shapes & open questions for the decision gate

- **Candidate shapes:** {list the ≥2 genuinely viable API shapes — these are the direct input to component-api-compare. If only one obvious shape exists, say so and skip compare.}
- **Placement:** {column-level vs grid-level? host-level vs sub-element? per-item vs default-only?}
- **Cross-repo scope:** {if no existing transport, is the Flow side in scope now or deferred? Flag as gate-blocking.}
```

## Next step

If **two or more genuinely viable API shapes** emerged (e.g. concatenate-vs-fallback, grid-level-vs-column-level placement, `i18n`-object-vs-flat-props), run **`/component-api-compare`** to drive a decision gate. If there is **one obvious shape**, skip the compare step and go straight to **`/component-api-contract`** to lock the cross-repo contract.
