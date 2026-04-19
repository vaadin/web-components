---
allowed-tools: Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Read,Glob,Grep,Write(packages/:*),Bash(mkdir -p packages/*/spec),Bash(grep *),Bash(find *)
description: Reconcile an ideal developer API with existing source code to produce a full implementation specification for a Vaadin web component
---

This skill takes a component's `web-component-api.md` — an ideal API designed from pure developer ergonomics — and reconciles it with the actual source code of the Vaadin web-components monorepo. The output is a full implementation specification: shadow DOM structure, mixin chains, properties, slots, parts, events, CSS custom properties, and accessibility behavior.

This is step 4 in the spec-driven development pipeline. Steps 1–3 defined the problem, researched requirements, and designed an ideal API without implementation constraints. This step grounds that API in the codebase: identifying reusable mixins, matching naming conventions, and noting where existing shared modules may need adjustment.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/web-component-api.md`. This is the primary input — the ideal developer-facing API from step 3. If the file does not exist, stop and tell the user to run `create-component-web-component-api` first.

2. Read `packages/{component-name}/spec/requirements.md`. Use this for coverage verification in step 8 — every requirement must be addressed in the spec. If the file does not exist, stop and tell the user to run `create-component-requirements` first.

   **Variant filter.** A requirement may carry an optional visible `**Applies to:** universal | web | flow` line directly under its title (default: `universal` when the line is absent). This skill produces the web component spec, so ignore any requirement tagged `**Applies to:** flow` — those are covered by `create-component-flow-spec`. Coverage verification in step 8 applies only to `universal` and `web` requirements.

3. Read `packages/{component-name}/spec/problem-statement.md`. Use it as a scope boundary. If the file does not exist, stop and tell the user to run `create-component-problem-statement` first.

4. Read `WEB_COMPONENT_GUIDELINES.md` in the project root. This defines the mixin pattern, file structure, styling conventions, implementation standards, and CSS pitfalls the spec must follow. **The document is 2000+ lines — read it in batches** (e.g., 500 lines at a time using offset/limit) to ensure you cover ALL relevant sections. Do not skip any section that is relevant to the component being specified. The styling rules in particular contain constraints that must be reflected in the spec (e.g. how cross-shadow-DOM styling works, dropdown positioning, DOM order requirements).

5. Study existing source code. Extract Vaadin component names mentioned in `web-component-api.md` rationale sections (e.g., "follows vaadin-side-nav pattern") and use those as starting points. Read their entry files, mixins, and `.d.ts` files. Expand the search to other components with similar concerns (e.g., list-like, selection-like, navigation-like, overlay-like). Use Grep across the monorepo for naming patterns. Check shared base packages (`component-base`, `a11y-base`, `field-base`, `overlay`) for reusable mixins and controllers. For external libraries named in `web-component-api.md` (e.g., "Shoelace uses the same separator slot pattern"), fetch their documentation to verify the referenced pattern. See SOURCE CODE ANALYSIS below for what to look for.

6. Reconcile the ideal API with source code findings. For each feature in `web-component-api.md`: can it be implemented as-is using existing patterns? Does naming need adjustment for consistency with existing components? Can an existing mixin be reused or extended? Would a shared module need modification? Document every deviation from `web-component-api.md` in the Key Design Decisions section with rationale.

7. Read `SPEC_TEMPLATE.md` in this skill's directory. Write the spec at `packages/{component-name}/spec/web-component-spec.md`, following the template structure.

8. Verify coverage. Cross-reference the spec against `requirements.md` — every requirement must be addressed in the spec. Cross-reference against `web-component-api.md` — every API feature is either present in the spec or has a documented deviation in Key Design Decisions.

SOURCE CODE ANALYSIS:

When studying existing components in step 5, focus on:

1. **Mixin chains.** Read the class declaration of similar components to see which mixins they apply and in what order. Use Grep to find all usages of a mixin across the monorepo. The new component's mixin chain should follow established patterns.

2. **Naming conventions.** Use Grep to check how similar concepts are named across components. For any property the new component needs, search for how it is named, typed, and documented in existing components. Match the existing convention.

3. **Shared controllers and utilities.** Check `packages/component-base/src/`, `packages/a11y-base/src/`, and `packages/overlay/src/` for controllers (e.g., `SlotController`, `TooltipController`, `FocusTrapController`) that the new component can reuse directly.

4. **Event patterns.** Check how existing components name and dispatch events. Check whether similar events use `CustomEvent` detail objects and what shape those objects take.

5. **CSS custom property conventions.** Search for how existing components expose theming hooks. Check whether similar properties follow a naming scheme.

6. **Shadow DOM patterns.** Study similar components to see how shadow DOM is structured, which parts are exposed, and how slots are used.

REUSE AND PROPOSED ADJUSTMENTS:

If the source code analysis reveals that an existing component, mixin, controller, or shared module can be reused — either directly or with modification — document this in the Reuse and Proposed Adjustments section of the spec. For each entry:
- Name the file and whether it is used as-is or needs modification.
- If modification is needed, describe the specific change.
- Explain why the new component needs it.
- List other components that use the same code and could be affected.

This section is informational — it flags work that extends beyond the new component's own package.

API DESIGN PRINCIPLES:

- **Consistency over novelty.** If an existing Vaadin component solves a similar problem, match its naming, structure, and mixin usage. Deviate only when a requirement genuinely demands it.
- **Completeness over minimalism.** Every requirement must be covered. Missing API is worse than extra API when a real requirement is at stake.
- **No bloat.** Every property, slot, event, part, and CSS custom property must trace to at least one requirement. If no requirement needs it, remove it.
- **Composition over reimplementation.** If a requirement can be fulfilled by slotting an existing Vaadin component or reusing an existing mixin, prefer that over new code.

OUTPUT:

Follow `SPEC_TEMPLATE.md` in this skill's directory. Key rules for each section:

- **Key Design Decisions** — One entry for each significant choice. Include deviations from `web-component-api.md` with rationale. Reference web-component-api.md sections by number/name when discussing the API feature that motivated the decision. Include decisions about mixin selection, slot design, and event naming.
- **Implementation / Elements** — For each custom element: shadow DOM structure, properties table, slots table, parts table, events table, CSS custom properties table. Every entry must trace to a requirement. Add Internal Behavior and other subsections when the component's logic warrants them.
- **Reuse and Proposed Adjustments to Existing Modules** — Only if step 5 identified shared code that can be reused or needs modification. Omit if no adjustments are needed.

IMPORTANT GUIDELINES:

- Do not invent features that no requirement in `requirements.md` supports.
- Do not modify `web-component-api.md`, `requirements.md`, or `problem-statement.md`.
- Do not perform broad web searches. External library documentation may be fetched only when `web-component-api.md` explicitly names a specific component from that library.
- If a requirement is ambiguous, stop and ask the user for clarification. Do not guess.
- The output is only the spec file.

