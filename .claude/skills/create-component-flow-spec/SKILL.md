---
allowed-tools: Read,Glob,Grep,Write(packages/:*),Bash(mkdir -p packages/*/spec),Bash(grep *),Bash(find *),Bash(ls flow-components),Bash(ls ../flow-components)
description: Reconcile an ideal Flow developer API with existing flow-components source to produce a full Flow implementation specification
user-invocable: false
---

This skill takes a component's `flow-api.md` — an ideal Flow (Java) API designed from pure developer ergonomics — and reconciles it with the actual source of the `flow-components` repository. The output is a full Flow implementation specification: module layout, class declarations, annotations, mixin interfaces, method signatures, `@Synchronize` properties, events, i18n shape, theme-variant enum, connector plan (if needed), server/client sync concerns, serialisation, TestBench elements, and any proposed adjustments to shared `flow-components-base` code.

This is the Flow analogue of `create-component-web-component-spec` (step 4 in the spec-driven development pipeline, Flow variant). Previous steps defined the problem, researched requirements, designed an ideal Flow API. This step grounds that API in the Flow codebase: identifying reusable shared interfaces (`HasPrefix`, `HasTooltip`, …), matching naming conventions (`{Name}Variant`, `{Name}I18n`, `Has{Name}Items`), deciding whether a JS connector is needed, and noting where existing shared modules may need adjustment.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/flow-api.md`. This is the primary input — the ideal Flow API from `create-component-flow-api`. If the file does not exist, stop and tell the user to run `create-component-flow-api` first.

2. Read `packages/{component-name}/spec/web-component-api.md`. This is the web component API the Flow wrapper exposes from Java. If it does not exist, stop and tell the user to run `create-component-web-component-api` first.

3. Read `packages/{component-name}/spec/web-component-spec.md` if it exists. The web-component spec lists the internal web API — shadow DOM parts, slots, events, synchronised properties, CSS custom properties — that the Flow wrapper may need to hook into (e.g. via `@Synchronize` or `Element.setPropertyJson`). If it does not exist, note this as a dependency: some Flow spec decisions may need revisiting once the web component spec is written.

4. Read `packages/{component-name}/spec/requirements.md`. Use this for coverage verification in step 10. If the file does not exist, stop and tell the user to run `create-component-requirements` first.

   **Variant filter.** A requirement may carry an optional visible `**Applies to:** universal | web | flow` line directly under its title (default: `universal` when the line is absent). Ignore requirements tagged `**Applies to:** web`. Only `universal` and `flow` requirements must be covered.

5. Read `packages/{component-name}/spec/problem-statement.md`. Use it as a scope boundary.

6. **Locate the flow-components repository.** Run `ls flow-components` first; if that fails, run `ls ../flow-components`. Use the first path that exists. If neither exists, stop and tell the user: "The Flow spec needs access to the flow-components repository. Clone it to ./flow-components/ or ../flow-components/ and re-run this skill." The located path is referred to as `{FLOW}` below.

7. Read `{FLOW}/CLAUDE.md`. This defines the authoritative module structure, build commands, naming conventions, and test strategy. All module layout and file-placement decisions in the spec must follow it.

8. Study existing flow-components source. Extract class names mentioned in `flow-api.md` rationale sections (e.g. "follows `HasSideNavItems` pattern") and use those as starting points. Read:

   - **Shared mixins:** `{FLOW}/vaadin-flow-components-shared-parent/vaadin-flow-components-base/src/main/java/com/vaadin/flow/component/shared/` — full directory listing. Know the complete set.
   - **Shared internal helpers:** `{FLOW}/vaadin-flow-components-shared-parent/vaadin-flow-components-base/src/main/java/com/vaadin/flow/component/shared/internal/` — e.g. `DisableOnClickController`, `OverlayAutoAddController`, `ValidationController`, `SignalBindingUtil`.
   - **1–2 comparable component modules** in full (class declarations, method signatures, event classes, i18n class, testbench element). Pick by analogy:
     - Simple button-like: `{FLOW}/vaadin-button-flow-parent/`
     - Hierarchical children (component-tree): `{FLOW}/vaadin-side-nav-flow-parent/`
     - Data-driven items + connector: `{FLOW}/vaadin-menu-bar-flow-parent/`
   - **Testbench conventions:** look at `{FLOW}/vaadin-{similar}-flow-parent/vaadin-{similar}-testbench/src/main/java/**/{Name}Element.java`.
   - **Integration test conventions:** look at `{FLOW}/vaadin-{similar}-flow-parent/vaadin-{similar}-flow-integration-tests/` for a Route-based test view and a TestBench `*IT` class.

   Use Grep across `{FLOW}/` to check naming patterns (e.g. `HasXxxItems`, `XxxVariant`, `XxxI18n`) and to find all usages of a shared interface across modules.

9. Reconcile the ideal Flow API with source findings. For each feature in `flow-api.md`:
   - Can it be implemented as-is using existing shared mixins? Name them.
   - Does naming need adjustment for consistency with existing components (e.g. method name plurals, event class suffix `XxxEvent` vs `XxxChangedEvent`)?
   - Can an existing shared interface be reused or extended?
   - Does a shared module need modification? (Flag it in the Reuse section.)

   Document every deviation from `flow-api.md` in the Key Design Decisions section with rationale.

   **Connector decision.** Decide whether the component needs a JS connector file under `src/main/resources/META-INF/resources/frontend/{name}Connector.js`:
   - Needed when the web component has a client-side items array that must be regenerated after DOM mutations (MenuBar-style), when drag-drop requires client state, or when server-side changes must trigger client recomputation.
   - Not needed for components that expose all state as attributes/slots/JS properties the Flow Element API can set directly.

   State the decision explicitly — "Connector needed: yes/no" — with a one-line rationale.

10. Read `FLOW_SPEC_TEMPLATE.md` in this skill's directory. Write the spec at `packages/{component-name}/spec/flow-spec.md`, following the template structure.

11. Verify coverage. Cross-reference the spec against `requirements.md` (universal + flow only) — every requirement must be addressed in the spec. Cross-reference against `flow-api.md` — every API feature is either present in the spec or has a documented deviation in Key Design Decisions. Cross-reference against the Web API coverage check in `flow-api.md` — every web-component API surface that was mapped to a Flow API must now have a concrete class/method/field entry in the spec.

SOURCE CODE ANALYSIS:

When studying existing components in step 8, focus on:

1. **Class declarations.** `@Tag`, `@NpmPackage`, `@JsModule`, list of implemented interfaces. The new component's class header should follow the same order and use the same shared interfaces where applicable.

2. **Constructors.** Overloads follow common patterns: no-arg, text-only, text + primary action (e.g. `new Button(String, ComponentEventListener<ClickEvent<Button>>)`), Signal-based (`new Button(Signal<String>)`). Match what comparable components already do.

3. **`@Synchronize` usage.** Check which properties in comparable components are server-side-observed (e.g. `@Synchronize("opened-changed")`). Apply the same discipline — only sync what the server actually needs to observe.

4. **Event classes.** `ComponentEvent<{Name}>` subclasses with `@DomEvent` mapping when the event carries client data. Check naming (`XxxEvent`, `XxxChangedEvent`).

5. **i18n classes.** `@JsonInclude(JsonInclude.Include.NON_NULL)`, `implements Serializable`, fluent setters returning the i18n class for chaining. Exposed via `setI18n(XxxI18n)` / `getI18n()` on the main component, serialised with `JacksonUtils.beanToJson(...)` and sent via `Element.setPropertyJson("i18n", ...)`.

6. **Theme variant enums.** `implements ThemeVariant`, `getVariantName()` returning the CSS theme attribute string. Deprecation convention from `ButtonVariant`.

7. **Children / items API.** `Has{Name}Items` interface with `addItem`, `addItemAtIndex`, `addItemAsFirst`, `getItems`, `remove`, `removeAll`. Or — for data-driven children — `setItems(List<T>)`, `getItems()`, plus optional `MenuManager`-style coordinator when sub-menus are in play.

8. **Serialisation.** Every field must be `Serializable`. Stateful controllers (e.g. `DisableOnClickController`) are themselves `Serializable`; listener collections use `SerializableConsumer/Function/...`. Any transient state must be marked `transient` and re-created in a `readObject` hook — very rare in practice.

REUSE AND PROPOSED ADJUSTMENTS:

If source analysis reveals that an existing shared mixin, controller, or utility in `vaadin-flow-components-base` can be reused — or needs modification — document this in the Reuse and Proposed Adjustments section of the spec. For each entry:

- Name the file and whether it is used as-is or needs modification.
- If modification is needed, describe the specific change and list other components that use the same code and could be affected.
- Explain why the new component needs it.

This section is informational — it flags work that extends beyond the new component's own `vaadin-{name}-flow-parent/` module.

API DESIGN PRINCIPLES:

- **Consistency over novelty.** If an existing Flow component solves a similar problem, match its class layout, constructor overloads, event naming, and i18n shape. Deviate only when a requirement or web-API mapping genuinely demands it.
- **Completeness over minimalism.** Every universal/flow requirement must be covered. Every web-component API surface from `web-component-api.md` must be reachable from Flow (per the coverage check in `flow-api.md`).
- **Composition over reimplementation.** If a requirement can be fulfilled by implementing a shared interface from `vaadin-flow-components-base`, prefer that over new code.
- **Serialisation-first.** Every public field type must be `Serializable`. Call this out in Key Design Decisions when a non-trivial field (controller, listener registration, collection) is introduced.
- **Router-agnostic.** Do NOT embed `RouteConfiguration` calls inside the component. Exposing path setters is fine; driving navigation is the application's job.

OUTPUT:

Follow `FLOW_SPEC_TEMPLATE.md` in this skill's directory. Key rules for each section:

- **Key Design Decisions** — one entry per significant choice. Deviations from `flow-api.md` with rationale. Mixin-interface selections. Connector decision with rationale.
- **Module / Package Layout** — exact file list for `vaadin-{name}-flow-parent/` and its three sub-modules (`-flow`, `-flow-integration-tests`, `-testbench`).
- **Component Classes** — one subsection per public class. Show class declaration (annotations + interfaces), constructors, public method signatures (NOT bodies), `@Synchronize` properties, events, nested classes.
- **i18n** — full field list with defaults.
- **Theme Variants** — enum constants and deprecation policy.
- **Connector** — either the connector file spec (name, exports, mutation observers) or an explicit "no connector needed" with rationale.
- **Server/Client Sync Concerns** — Signal support, serialisation notes, routing integration, `DisabledUpdateMode`, disable-on-click reuse.
- **TestBench Elements** — class outline: `@Element("vaadin-{name}")`, exposed query methods mapped to web-component parts/slots.
- **Reuse and Proposed Adjustments to Existing Modules** — only if needed.
- **Coverage** — cross-reference each `Applies to: universal|flow` requirement to the spec sections that address it.

IMPORTANT GUIDELINES:

- Do not invent features that no requirement in `requirements.md` (universal + flow) supports.
- Do not modify `flow-api.md`, `web-component-api.md`, `requirements.md`, `problem-statement.md`, `web-component-spec.md`, or any existing files outside the new spec file.
- Do not read source code outside `flow-components/` (or `../flow-components/`). The web component spec is available at `packages/{name}/spec/web-component-spec.md` — read that, not the web component source under `packages/*/src/`.
- If a requirement or an API mapping is ambiguous, stop and ask the user for clarification. Do not guess.
- The output is only the `flow-spec.md` file.
