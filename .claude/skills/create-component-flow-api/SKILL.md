---
allowed-tools: Read(packages/*/spec/*),Read(flow-components/**),Read(../flow-components/**),Read(.claude/skills/create-component-flow-api/*),Glob(flow-components/**),Glob(../flow-components/**),Grep,Write(packages/:*),Bash(mkdir -p packages/*/spec),Bash(ls flow-components),Bash(ls ../flow-components)
description: Design the developer-facing Flow (Java) API for a Vaadin component based on its requirements and the already-designed web component API
user-invocable: false
---

This skill takes a component's requirements plus the web component's `web-component-api.md` and produces a Flow (Java) developer API — Java code examples showing the most idiomatic, minimal API a Vaadin Flow developer would use to wrap and use the web component from server-side Java. The result is a `flow-api.md` file — one section per requirement (or group of related requirements), each with a Java code example and a short rationale for the chosen API shape.

This is an intermediate step between requirements research and the full Flow specification. The Flow API is designed from a server-side Java developer's perspective, using conventions already established in the `flow-components` repo, without reading Flow component implementation source code or considering implementation feasibility.

The Flow API ALWAYS wraps the web component, so every piece of web-component API surface from `web-component-api.md` must be reachable from Flow. The Flow API adapts that surface to Java-world conventions: typed setters/getters, `addXxx` methods for children, shared mixin interfaces (`HasPrefix`, `HasSuffix`, `HasTooltip`, `HasThemeVariant`, etc.), Java event listeners, and `Serializable` i18n objects.

You do not have access to Write outside `packages/*/spec/`. You may Read `flow-components/` (or `../flow-components/` if that is where it lives) for conventions only — do NOT read Flow component implementation files in depth to avoid copying behavior. You look at shared interfaces and representative class headers, not method bodies.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read the requirements file at `packages/{component-name}/spec/requirements.md`. This is the primary input — every code example must trace back to at least one requirement. If the file does not exist, stop and tell the user to run the `create-component-requirements` skill first.

   **Variant filter.** A requirement may carry an optional visible `**Applies to:** universal | web | flow` line directly under its title (default: `universal` when the line is absent). This skill designs the Flow API, so ignore any requirement tagged `**Applies to:** web` — those are specific to the web component and have no Flow equivalent. Consider only `universal` and `flow` requirements from here on.

2. Read the web component developer API at `packages/{component-name}/spec/web-component-api.md`. If the file does not exist, stop and tell the user to run the `create-component-web-component-api` skill first. This defines the web component API surface the Flow wrapper must expose. Every attribute, property, slot, event, and CSS custom property developers use from HTML/JS must be reachable from Java.

3. Read the problem statement at `packages/{component-name}/spec/problem-statement.md`. Use the Differentiation section to verify that code examples stay within the component's defined scope. If the file does not exist, stop and tell the user to run the `create-component-problem-statement` skill first.

4. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "The Flow API design needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill."

5. Read `FLOW_API_DESIGN_TEMPLATE.md` in this skill's directory. Use it as the starting point for your output file.

6. **Study flow-components conventions (not implementations).** Read these for reference only:

   - The shared mixins at `flow-components/vaadin-flow-components-shared-parent/vaadin-flow-components-base/src/main/java/com/vaadin/flow/component/shared/` — in particular `HasPrefix`, `HasSuffix`, `HasTooltip`, `HasThemeVariant`, `HasAriaLabel` (Flow core), `HasClearButton`, `HasAutoOpen`, `HasValidationProperties`, `HasAllowedCharPattern`. Know which ones exist so you can compose rather than reinvent.
   - 1–2 comparable components to see class-level conventions. Pick based on the web-component API's shape:
     - Simple button-like (single element, theme variants): `flow-components/vaadin-button-flow-parent/vaadin-button-flow/src/main/java/com/vaadin/flow/component/button/Button.java` and `ButtonVariant.java`.
     - Hierarchical children (component-tree items): `flow-components/vaadin-side-nav-flow-parent/vaadin-side-nav-flow/src/main/java/com/vaadin/flow/component/sidenav/SideNav.java`, `SideNavItem.java`, `HasSideNavItems.java`, and the nested `SideNavI18n` class.
     - Data-driven items array (client-side rendering with connector): `flow-components/vaadin-menu-bar-flow-parent/vaadin-menu-bar-flow/src/main/java/com/vaadin/flow/component/menubar/MenuBar.java`.

   Read only class declarations, constructors, and public method signatures. Do NOT read method bodies. The goal is API-level convention absorption.

7. For each requirement (or group of related requirements), write a concrete Java code example showing how a Flow developer would use the component. For each example, include a brief "Why this shape" note explaining the rationale — anchoring it in `flow-components` conventions (e.g., "follows `HasSideNavItems` pattern from `vaadin-side-nav-flow`"). Apply these principles:

   - **Every web-component API must be reachable from Flow.** Cross-check: each attribute/property/slot/event/CSS custom property in `web-component-api.md` either maps to a Flow method, a shared mixin interface, a slot-mirroring API, or an event listener. If something has no Flow counterpart, that is a design decision that needs recording in the "Why this shape" note.
   - **Compose the established shared mixins** instead of redeclaring methods. If an icon goes in `slot="prefix"` on the web component, the Flow class should implement `HasPrefix` from `vaadin-flow-components-base`.
   - **Children/items:** mirror `HasSideNavItems` (component-tree pattern with `addItem`, `getItems`, `removeAll`) when the web component accepts typed child elements; mirror `MenuBar.items` (array of plain data objects) when the web component exposes an `items` JS property. If the web component exposes both, offer both from Flow.
   - **Theme variants:** a `{Name}Variant` enum implementing `ThemeVariant`, exposed via `HasThemeVariant<{Name}Variant>`. Follow the deprecation pattern from `ButtonVariant` if the web component has legacy variant names.
   - **i18n:** a nested `{Name}I18n` inner class (or a public top-level class when shared across multiple component classes), `implements Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, fluent setters. Exposed on the main class via `setI18n(XxxI18n)` / `getI18n()`.
   - **Events:** expose DOM events (e.g. `navigate`) as Java events via `addXxxListener(ComponentEventListener<XxxEvent>)` returning `Registration`. Use `@DomEvent` mapping when the event payload has fields.
   - **Progressive disclosure.** The simplest usage is a no-arg constructor plus one or two typed setter calls. Convenience constructors for the most common scenarios (e.g. `new Button("Save")`, `new Button("Save", clickListener)`).
   - **No bloat.** Every Java method, interface, or class must serve either a requirement or a reachability mapping for a web-component API surface. Do NOT invent API surface that no requirement needs and no web API requires.
   - **Router-agnostic.** Per `DESIGN_GUIDELINES.md`, the Flow API must not depend on any specific client-side router. Navigation is wired by the application (e.g. via `UI.navigate(...)` or `RouteConfiguration`). The Flow wrapper exposes path/URL setters but does not call a router itself.

8. Write the output to `packages/{component-name}/spec/flow-api.md`.

OUTPUT FORMAT:

Follow `FLOW_API_DESIGN_TEMPLATE.md` exactly. In short:

- One section per requirement (or group of related requirements), each containing:
  - A reference to which requirement number(s) it covers
  - A concrete Java code example
  - A brief "Why this shape" note — call out which `flow-components` convention / shared mixin / comparable component you followed
- A final "Web API coverage check" section: a bulleted list showing each property, slot, event, and CSS custom property from `web-component-api.md` and the Java API that exposes it (or an explicit note that it is intentionally internal/not reachable from Flow, with rationale).

IMPORTANT GUIDELINES:

- Do NOT read Flow component method bodies. Read only shared mixin interfaces, class declarations, and public signatures. This keeps the Flow API design informed by conventions without copying implementation.
- Do NOT read web component source under `packages/*/src/`.
- Do NOT consider implementation feasibility. Mixin-chain decisions, `@Synchronize` wiring, and connector choices are made in `create-component-flow-spec`.
- Do NOT produce a full Flow specification. No connector files, no `@Synchronize` details, no method bodies, no serialisation analysis.
- Every requirement with `Applies to` in `{universal, flow}` must be covered by at least one code example. Every example must trace to at least one such requirement.
- Before finalizing, check every code example against the problem statement. If an example shows behavior that is out of scope or belongs to an adjacent component, remove it.
- Do NOT modify `requirements.md`, `web-component-api.md`, or `problem-statement.md`.
- The result is ONLY the Flow developer API document — nothing else.
