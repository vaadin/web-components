# Breadcrumbs Flow Implementation Tasks

<!--
Ordered implementation tasks derived from flow-spec.md. Each task is a self-contained unit of work following test-driven development: define tests first, then implement to make them pass. Each task results in a merge-ready branch in the flow-components repository.

Primary input: packages/breadcrumbs/spec/flow-spec.md
API context: packages/breadcrumbs/spec/flow-api.md
Traceability: packages/breadcrumbs/spec/requirements.md (universal + flow)

Tasks are pointers into the spec, not a second copy of it. The spec sections field tells the implementer where to find the full details. Do not restate class declarations, method tables, or `@Synchronize` lists here.

External Flow core dependencies (not implemented by these tasks):
- `com.vaadin.flow.component.HasComponentsOfType<T>` — Flow core (available; implemented in Task 1, guarded in Task 6)
- `@RouteParent`, `RouteConfiguration#getRouteHierarchy(...)`, and instance-free titles — Flow core (required by Task 7 + Task 11)

Do NOT reorder tasks without verifying the dependency graph.
Do NOT add tasks for features not in the spec.
-->

## Spec References

- [flow-spec.md](flow-spec.md)
- [flow-api.md](flow-api.md)
- [requirements.md](requirements.md) — universal + flow (requirements 13–16 are Flow-specific)
- [web-component-api.md](web-component-api.md) — web component API being wrapped
- [web-component-spec.md](web-component-spec.md) — web component spec

---

## Task 1: Scaffold `vaadin-breadcrumbs-flow-parent` module with feature-flag plumbing

**Spec sections:** Module / Package Layout, Feature Flag
**Requirements:** —
**Depends on:** —

Create the three sub-modules (`-flow`, `-flow-integration-tests`, `-testbench`) with `pom.xml` wiring, empty class shells matching the annotations and `implements` clauses from the spec (empty bodies — Mode enum, constructors, `setI18n`, the theme-variant surface, and the `Mode.ROUTER` guard land in later tasks), and the full feature-flag plumbing (`BreadcrumbsFeatureFlagProvider`, ServiceLoader registration, `ExperimentalFeatureException`, `onAttach` check). At this point `Breadcrumbs` implements `HasSize, HasStyle, HasAriaLabel, HasComponentsOfType<BreadcrumbsItem>` — the child-management methods come as inherited defaults, with the `Mode.ROUTER` guard added in Task 6 — and gains `HasThemeVariant<BreadcrumbsVariant>` in Task 3. The IT module enables the feature flag via `src/main/resources/vaadin-featureflags.properties`. The smoke test instantiates `Breadcrumbs` (which currently does nothing in its body) and the `SerializableTest` round-trips it.

**Files:**
- `vaadin-breadcrumbs-flow-parent/pom.xml` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/pom.xml` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (create — `@Tag` + `@NpmPackage` + `@JsModule`, `extends Component` + `implements HasSize, HasStyle, HasAriaLabel, HasComponentsOfType<BreadcrumbsItem>`, empty body apart from `onAttach` calling `checkFeatureFlag`)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/BreadcrumbsItem.java` (create — annotations + `implements HasText, HasEnabled, HasPrefix`, empty body)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/BreadcrumbsFeatureFlagProvider.java` (create — verbatim from flow-spec.md Feature Flag section)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/ExperimentalFeatureException.java` (create — verbatim from spec)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/resources/META-INF/services/com.vaadin.experimental.FeatureFlagProvider` (create — one line)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsTest.java` (create — smoke test only)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsSerializableTest.java` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/FeatureFlagTest.java` (create — asserts `ExperimentalFeatureException` is thrown when the flag is disabled, and not thrown when enabled)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/pom.xml` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/resources/vaadin-featureflags.properties` (create — single line `com.vaadin.experimental.breadcrumbsComponent=true`)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench/pom.xml` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench/src/main/java/com/vaadin/flow/component/breadcrumbs/testbench/BreadcrumbsElement.java` (create — `@Element("vaadin-breadcrumbs")`, empty body)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench/src/main/java/com/vaadin/flow/component/breadcrumbs/testbench/BreadcrumbsItemElement.java` (create — `@Element("vaadin-breadcrumbs-item")`, empty body)
- `pom.xml` (modify — add `vaadin-breadcrumbs-flow-parent` module)
- `flow-components-bom/pom.xml` (modify — add the new module if the BOM aggregates modules)

**Tests:**
- [ ] `new Breadcrumbs()` returns a non-null instance whose element tag is `vaadin-breadcrumbs`
- [ ] `new BreadcrumbsItem("Home")` returns a non-null instance whose element tag is `vaadin-breadcrumbs-item`
- [ ] `BreadcrumbsSerializableTest` round-trips a `new Breadcrumbs()` through Java serialisation without throwing
- [ ] `FeatureFlagTest` asserts `ExperimentalFeatureException` is thrown on attach when `breadcrumbsComponent` is disabled, and not thrown when enabled
- [ ] ServiceLoader discovers `BreadcrumbsFeatureFlagProvider` and the feature is registered with id `breadcrumbsComponent`

**Acceptance criteria:**
- [ ] `mvn clean install -DskipTests -pl vaadin-breadcrumbs-flow-parent -am` succeeds
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` on the new module both clean
- [ ] All new tests pass; existing tests still pass

---

## Task 2: `BreadcrumbsItem` — constructors, text, path, prefix

**Spec sections:** Component Classes → `BreadcrumbsItem`
**Requirements:** 1, 2, 8
**Depends on:** 1

Implement all seven `BreadcrumbsItem` constructors (mirroring `SideNavItem`'s overload set), the `path` accessors with the three setter overloads, and verify the `HasText` / `HasEnabled` / `HasPrefix` surface works. `setPath(Class<? extends Component>)` and `setPath(Class, RouteParameters)` resolve via `RouteConfiguration.forRegistry(ComponentUtil.getRouter(this).getRegistry()).getUrl(view, params)` exactly like `SideNavItem`. A `BreadcrumbsItemSignalTest` covers `bindText` (the binding updates the text; `setText` throws while it is active). No events, no `@Synchronize`'d properties.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/BreadcrumbsItem.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsItemTest.java` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsItemSignalTest.java` (create — `bindText` signal binding)

**Tests:**
- [ ] `new BreadcrumbsItem("Home")` sets the element's text content to "Home" and does not set the `path` attribute
- [ ] `new BreadcrumbsItem("Docs", "/docs")` sets the element's `path` attribute to `/docs`
- [ ] `setPath(String)` reflects to the `path` attribute; `setPath(null)` removes it
- [ ] `setPath(Class<? extends Component>)` writes the URL produced by `RouteConfiguration#getUrl(viewClass, RouteParameters.empty())` to the `path` attribute
- [ ] `setPath(Class<? extends Component>, RouteParameters)` writes the parameterised URL to the `path` attribute
- [ ] `new BreadcrumbsItem("Home", HomeView.class, homeIcon)` sets the prefix slot to `homeIcon` and the path attribute to the view's URL
- [ ] `setPrefixComponent(component)` then `getPrefixComponent()` returns the same component
- [ ] `setEnabled(false)` reflects the `disabled` attribute on the host
- [ ] `bindText(signal)` binds the item's text reactively; `setText` throws while the binding is active

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 3: `Breadcrumbs` — theme variants (`HasThemeVariant<BreadcrumbsVariant>`)

**Spec sections:** Key Design Decisions §9, Component Classes → `Breadcrumbs` (implements clause + mixin interfaces), Theme Variants
**Requirements:** 5
**Depends on:** 1

Add the `BreadcrumbsVariant` enum implementing `ThemeVariant` with `SLASH("slash")`, `LUMO_PRIMARY("primary")`, and `AURA_ACCENT("accent")` (the web component's `theme="slash"` base separator plus the Lumo / Aura link-color variants), following the `SideNavVariant` shape. Add `implements HasThemeVariant<BreadcrumbsVariant>` to `Breadcrumbs`; every variant method (`addThemeVariants` / `removeThemeVariants` / `setThemeVariants` / `setThemeVariant` / `bindThemeVariant` / `bindThemeVariants`) comes from the shared interface as a default — the component adds no code beyond the type parameter. `HasThemeVariant` and `ThemeVariant` are in `vaadin-flow-components-base` (already on the classpath via `HasPrefix`). Each enum value maps to a `theme` token the web component actually honours (guidelines/09-theming.md).

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/BreadcrumbsVariant.java` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (modify — add `HasThemeVariant<BreadcrumbsVariant>` to the `implements` clause)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsTest.java` (modify — assert `Breadcrumbs` implements `HasThemeVariant`)

**Tests:**
- [ ] `BreadcrumbsVariant.SLASH.getVariantName()` returns `"slash"`, `LUMO_PRIMARY` returns `"primary"`, `AURA_ACCENT` returns `"accent"`
- [ ] `BreadcrumbsTest` asserts `Breadcrumbs` implements `HasThemeVariant`
- [ ] `addThemeVariants(BreadcrumbsVariant.SLASH)` adds `slash` to the host `theme` attribute
- [ ] `removeThemeVariants(BreadcrumbsVariant.SLASH)` removes it
- [ ] `setThemeVariants(BreadcrumbsVariant.SLASH)` replaces any previously set theme tokens

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 4: `Breadcrumbs` — `BreadcrumbsI18n` + `setI18n` / `getI18n`

**Spec sections:** Key Design Decisions §10, Component Classes → `Breadcrumbs` (i18n field), i18n
**Requirements:** 7
**Depends on:** 1

Add the nested static `BreadcrumbsI18n` class — `Serializable`, `@JsonInclude(JsonInclude.Include.NON_NULL)`, single `moreItems` field with fluent setter returning `this`. Add `getI18n()` / `setI18n(BreadcrumbsI18n)` on `Breadcrumbs`: `setI18n` stores the instance and pushes `JacksonUtils.beanToJson(i18n)` to the client via `getElement().setPropertyJson("i18n", json)`. Re-push in `onAttach` so a fresh client-side element receives the property after re-attach. `setI18n` rejects `null` via `Objects.requireNonNull` (guidelines/10-i18n-and-a11y.md). `getI18n()` returns the last-set instance, or `null` before the first `setI18n` call — the unset state in which the web component uses its built-in defaults — with no lazy-init.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsI18nTest.java` (create)

**Tests:**
- [ ] `new BreadcrumbsI18n().setMoreItems("Show hidden items").getMoreItems()` returns "Show hidden items"
- [ ] `BreadcrumbsI18n` serialises to JSON with `NON_NULL` inclusion — a default instance produces `{}`, not `{"moreItems":null}`
- [ ] `BreadcrumbsI18n` round-trips through Java serialisation
- [ ] `getI18n()` returns `null` before `setI18n` is called
- [ ] `setI18n(new BreadcrumbsI18n().setMoreItems("X"))` pushes a JSON object to the `i18n` element property whose `moreItems` field is `"X"`
- [ ] `setI18n(null)` throws `NullPointerException`
- [ ] Re-attaching the component re-pushes the last-set `i18n` value

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 5: `Breadcrumbs` — `Mode` enum, constructors, mode switching

**Spec sections:** Key Design Decisions §1 + §13, Component Classes → `Breadcrumbs` (constructors, `getMode`/`setMode`, mode-switching contract)
**Requirements:** 14
**Depends on:** 1

Add the public nested `Mode` enum (`ROUTER`, `MANUAL`) and the two constructors (`Breadcrumbs()` → defaults to `Mode.ROUTER`, `Breadcrumbs(Mode)`). Implement `getMode()` and `setMode(Mode)` with the symmetric clear-and-rewire contract from the spec: both transitions discard existing children, `ROUTER → MANUAL` also unregisters the navigation listener (if registered later in Task 7), `MANUAL → ROUTER` triggers an initial trail build. The `Mode.ROUTER` guard on `add`/`remove`/`removeAll` does not exist yet — it lands in Task 6 (the inherited methods themselves are available from Task 1). The router listener wiring lands in Task 7; at this point `setMode(ROUTER)` only flips the internal flag and clears children.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsModeTest.java` (create)

**Tests:**
- [ ] `new Breadcrumbs().getMode()` returns `Mode.ROUTER`
- [ ] `new Breadcrumbs(Mode.MANUAL).getMode()` returns `Mode.MANUAL`
- [ ] `setMode(Mode.MANUAL)` on a router-mode instance clears `getChildren()` to an empty stream
- [ ] `setMode(Mode.ROUTER)` on a manual-mode instance with children clears `getChildren()` to an empty stream
- [ ] `setMode` with the current mode value is a no-op (children unchanged)

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 6: `Breadcrumbs` — `Mode.ROUTER` guard on child management

**Spec sections:** Key Design Decisions §2 + §3, Component Classes → `Breadcrumbs` (items section + `routerUpdateInProgress` bypass + `updateChildrenInternal`), Reuse and Proposed Adjustments → HasComponentsOfType
**Requirements:** 1, 9, 14
**Depends on:** 2, 5

Guard the inherited `HasComponentsOfType<BreadcrumbsItem>` child-management methods (the interface is on `Breadcrumbs` from Task 1). Override every mutating default method — `add(T...)`, `add(Collection<T>)`, `remove(T...)`, `remove(Collection<T>)`, `removeAll()`, `addComponentAsFirst(T)`, `addComponentAtIndex(int, T)`, `replace(T, T)`, `bindChildren(Signal<List<S>>, SerializableFunction<S, T>)` — so each one throws `IllegalStateException` when `mode == Mode.ROUTER && !routerUpdateInProgress`, otherwise delegates to `HasComponentsOfType.super.<method>(...)`. Add the private `routerUpdateInProgress` flag and the `updateChildrenInternal(List<BreadcrumbsItem>)` helper that sets the flag, calls `removeAll() + add(...)`, and clears the flag in a `finally`. `getChildren()` reads remain unguarded.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsTest.java` (modify — add the guard tests next to the existing smoke test)

**Tests:**
- [ ] `Mode.MANUAL` allows `add(item)`, `remove(item)`, `removeAll()`, `replace(a, b)`, `addComponentAsFirst(item)`, `addComponentAtIndex(0, item)` without throwing
- [ ] `Mode.ROUTER` throws `IllegalStateException` from `add(item)`, `remove(item)`, `removeAll()`, `replace(a, b)`, `addComponentAsFirst(item)`, `addComponentAtIndex(0, item)`, and `bindChildren(...)`
- [ ] `getChildren()` works in both modes regardless of any guard
- [ ] `updateChildrenInternal(List.of(itemA, itemB))` from `Mode.ROUTER` replaces children with exactly `[itemA, itemB]` and leaves `routerUpdateInProgress` `false` afterwards
- [ ] `Mode.MANUAL` → `Mode.ROUTER` transition via `setMode` clears manually-added children without throwing

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 7: `Breadcrumbs` — `Mode.ROUTER` listener wiring + router trail builder

**Spec sections:** Key Design Decisions §3 + §5, Component Classes → `Breadcrumbs` (Router mode wiring, `rebuildFromRouter`), `@RouteParent` Annotation → How `Breadcrumbs` builds the trail, Reuse and Proposed Adjustments → Flow core: route hierarchy and titles
**Requirements:** 13, 15
**Depends on:** 6

Register `UI#addAfterNavigationListener(this::rebuildFromRouter)` in `onAttach` when `mode == Mode.ROUTER`, hold the returned `Registration` in a `transient navigationRegistration` field, and unregister in `onDetach`. Add both `rebuildFromRouter` overloads (event-driven + direct-state for initial attach reading `UIInternals.getActiveViewLocation()` / `getActiveRouterTargetsChain()`); both guard with `if (!isAttached()) return;` and delegate to a private builder that calls `routeConfiguration.getRouteHierarchy(currentTarget, parameters)` for the root → current trail of `RouteParentReference`s, wraps every reference except the last as `new BreadcrumbsItem(title, target, parameters)` (label from instance-free title resolution), wraps the last entry as `new BreadcrumbsItem(title)` with no path (label from the current view's live `HasDynamicTitle#getPageTitle()` if present, otherwise instance-free resolution), and hands the list to `updateChildrenInternal`. Also wire `Mode.MANUAL → Mode.ROUTER` transitions in `setMode` to register the listener and trigger an initial `rebuildFromRouter` if currently attached.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/main/java/com/vaadin/flow/component/breadcrumbs/Breadcrumbs.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/BreadcrumbsModeTest.java` (modify — extend the existing test class with router-listener cases using stubbed `RouteConfiguration` / mocked `UI`)

**Tests:**
- [ ] Attaching a `Mode.ROUTER` `Breadcrumbs` to a stub UI registers exactly one `AfterNavigationListener`
- [ ] Detaching the same instance unregisters the listener
- [ ] Firing an `AfterNavigationEvent` for a route chain `[Home, Customers, Acme]` produces three `BreadcrumbsItem` children whose text matches each route's `@PageTitle` and whose paths match `RouteConfiguration#getUrl(routeClass, RouteParameters.empty())` except for the last item, which has no `path`
- [ ] A current view that implements `HasDynamicTitle` has its `getPageTitle()` used for the last item's text in preference to its class `@PageTitle`
- [ ] Late callbacks fired after detach are no-ops (the listener guard `if (!isAttached()) return;` holds)
- [ ] `setMode(Mode.ROUTER)` on an attached manual-mode instance registers a listener and triggers an initial `rebuildFromRouter`
- [ ] `setMode(Mode.MANUAL)` on an attached router-mode instance unregisters the listener and clears the trail

**Acceptance criteria:**
- [ ] All new tests pass; existing tests still pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 8: TestBench element classes

**Spec sections:** TestBench Elements (both classes)
**Requirements:** —
**Depends on:** 1

Implement `BreadcrumbsElement` and `BreadcrumbsItemElement` per the spec. `BreadcrumbsElement` exposes `getItems()`, `getCurrentItem()`, `getItemByText(String)`, and `getItemByPath(String)`. `BreadcrumbsItemElement` exposes `getText()`, `getPath()`, `isCurrent()`, `hasPrefix()`, `getPrefixComponent()`, and `navigate()`. Queries follow the `SideNavElement` / `SideNavItemElement` pattern: `$(BreadcrumbsItemElement.class).all()` for items, `getDomAttribute(...)` / `hasAttribute(...)` for path and state attributes, and a `slot="prefix"` element query for the prefix component. `navigate()` clicks the shadow-DOM anchor via `executeScript` (the Chrome driver cannot click shadow-DOM elements directly). The actual IT exercise of these methods lands in Tasks 9–12.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench/src/main/java/com/vaadin/flow/component/breadcrumbs/testbench/BreadcrumbsElement.java` (modify)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench/src/main/java/com/vaadin/flow/component/breadcrumbs/testbench/BreadcrumbsItemElement.java` (modify)

**Tests:**
- [ ] The testbench module compiles cleanly when added as a dependency of the `-flow-integration-tests` module
- [ ] (Verification of behaviour deferred to the integration-test tasks — `BreadcrumbsElement#getItems()` returns the slotted items in document order; `getCurrentItem()` returns the item with the `current` state attribute; `getItemByText` / `getItemByPath` return the matching item or `null`; `BreadcrumbsItemElement#isCurrent` / `hasPrefix` / `getPath` / `getText` / `getPrefixComponent` / `navigate` all read or interact with the expected attributes / shadow elements)

**Acceptance criteria:**
- [ ] `mvn clean install -DskipTests -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-testbench` succeeds
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 9: Manual-mode integration test view + IT

**Spec sections:** Module / Package Layout (integration-tests file list), Component Classes → `Breadcrumbs` (`Mode.MANUAL`), Coverage (req 16 row)
**Requirements:** 1, 9, 14, 16
**Depends on:** 6, 8

Add a Flow view `ManualBreadcrumbsPage` that constructs `new Breadcrumbs(Mode.MANUAL)`, adds three items declaratively (one with a path-class, one with a string path, one with no path representing the current page), and exposes test affordances for the IT (`@Id` buttons to add / remove items at runtime to exercise reactive updates). The IT class `ManualBreadcrumbsIT` opens the view, uses `BreadcrumbsElement` + `BreadcrumbsItemElement` to assert the rendered trail, then exercises an add and a remove to confirm `Mode.MANUAL` reactive updates flow to the DOM.

This task also covers requirement 16 (routes dynamically supplying their breadcrumbs contribution). Add a second `Mode.MANUAL` scenario — a view that simulates loading domain data and builds a trail containing a data-derived ancestor that has **no backing `@Route`** plus a data-derived current-page label (e.g. `Home › Customers › Enterprise › Acme Corp`, where `Enterprise` is the loaded customer's segment and `Acme Corp` is the loaded customer name). This is the part of req 16 that `Mode.ROUTER` cannot express — `getRouteHierarchy` only yields items for matched routes — so the manual-construction path is what satisfies it. The dynamic current-view label half of req 16 is already exercised by Task 10's `HasDynamicTitle` case.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/ManualBreadcrumbsPage.java` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/DataDrivenBreadcrumbsPage.java` (create — `Mode.MANUAL` view that builds a trail from simulated loaded data, covering req 16)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/ManualBreadcrumbsIT.java` (create — asserts both the static manual trail and the data-driven req-16 trail)

**Tests:**
- [ ] Initial render: `getItems()` returns three items whose `getText()` values match the seeded labels
- [ ] The last item's `isCurrent()` returns `true`, the others return `false`
- [ ] The last item's `getPath()` is empty / null; the others return their assigned paths
- [ ] Clicking the "add item" affordance inserts a new item into the trail, observable via `BreadcrumbsElement#getItems()`
- [ ] Clicking the "remove item" affordance removes the matching item
- [ ] (req 16) The data-driven view renders a trail whose labels match the loaded data in order — including a data-derived ancestor with no backing `@Route` (e.g. `Enterprise`) and a data-derived current-page label (e.g. `Acme Corp`)

**Acceptance criteria:**
- [ ] `mvn verify -am -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests -Dit.test='ManualBreadcrumbsIT*' -DskipUnitTests` passes
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 10: Router-mode integration test view + IT

**Spec sections:** Key Design Decisions §3 + §5, Component Classes → `Breadcrumbs` (Router mode wiring), `@RouteParent` Annotation → How `Breadcrumbs` builds the trail
**Requirements:** 13
**Depends on:** 7, 8

Add a small route hierarchy of four `@Route`'d views, each with a `@PageTitle` (and one with `HasDynamicTitle` to cover the dynamic-title path) and `add(new Breadcrumbs())` in its constructor — defaulting to `Mode.ROUTER`. Navigate from the IT, assert the trail matches the route hierarchy, and verify the current item's text reflects `HasDynamicTitle` when the view implements it.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/RouterBreadcrumbsPage.java` (create — root + intermediate + leaf views in the same file)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/DynamicTitlePage.java` (create — leaf view implementing `HasDynamicTitle`)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/RouterBreadcrumbsIT.java` (create)

**Tests:**
- [ ] Navigating to the root view renders a one-item trail showing the root's `@PageTitle`
- [ ] Navigating to a leaf view renders a trail of all matched ancestors plus the leaf, in root-first order, each labeled by its `@PageTitle`
- [ ] Navigating to a view implementing `HasDynamicTitle` shows the dynamic title on the last item, not the class `@PageTitle`
- [ ] Each ancestor item's `getPath()` resolves to a URL the IT can navigate to and successfully load
- [ ] The last item's `isCurrent()` returns `true` and `getPath()` is empty / null

**Acceptance criteria:**
- [ ] `mvn verify -am -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests -Dit.test='RouterBreadcrumbsIT*' -DskipUnitTests` passes
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 11: `@RouteParent` integration test view + IT

**Spec sections:** Key Design Decisions §4 + §5, `@RouteParent` Annotation → How `Breadcrumbs` builds the trail
**Requirements:** 15
**Depends on:** 7, 8

Add a view `RouteParentPage` whose `@Route` URL would, under URL-prefix walking, resolve to one parent — but which carries `@RouteParent(OtherView.class)` to declare a different conceptual parent. The IT navigates to the view and asserts that the rendered trail walks through the declared parent, not the URL-derived one. This task verifies `RouteConfiguration#getRouteHierarchy`'s `@RouteParent`-first behaviour end-to-end through the breadcrumbs.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/RouteParentPage.java` (create — declared-parent view + the conceptual parent it points to)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/RouteParentIT.java` (create)

**Tests:**
- [ ] Navigating to the `@RouteParent`-annotated view renders the declared parent in the trail, not the URL-prefix parent
- [ ] Each ancestor item's `getPath()` is navigable
- [ ] The walker does not duplicate items when the declared parent and the URL-prefix parent would resolve to the same class

**Acceptance criteria:**
- [ ] `mvn verify -am -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests -Dit.test='RouteParentIT*' -DskipUnitTests` passes
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 12: Icon (prefix-component) integration test view + IT

**Spec sections:** Component Classes → `BreadcrumbsItem` (constructors ending in `Component prefixComponent`)
**Requirements:** 8
**Depends on:** 2, 8

Add a view `IconBreadcrumbsPage` that constructs items via the prefix-component constructor overloads — at minimum: a home icon on the root, a folder icon on an intermediate item, and a current-page item without prefix. The IT asserts via `BreadcrumbsItemElement#hasPrefix()` and `getPrefixComponent()` that the prefix slot is wired and the icons render.

**Files:**
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumbs/tests/IconBreadcrumbsPage.java` (create)
- `vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests/src/test/java/com/vaadin/flow/component/breadcrumbs/tests/IconBreadcrumbsIT.java` (create)

**Tests:**
- [ ] Items constructed with a prefix component carry `has-prefix` on their host element
- [ ] The current-page item (constructed without prefix) does not carry `has-prefix`
- [ ] `BreadcrumbsItemElement#getPrefixComponent()` resolves to the icon element passed to the constructor

**Acceptance criteria:**
- [ ] `mvn verify -am -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests -Dit.test='IconBreadcrumbsIT*' -DskipUnitTests` passes
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean

---

## Task 13: Final validation

**Spec sections:** All
**Requirements:** —
**Depends on:** 3, 4, 9, 10, 11, 12

Final clean-up and validation pass before the module is merge-ready. Run formatting / static analysis / unit tests / integration tests across the whole new module, and update repo-level documentation: add the new module to `flow-components/README.md`'s component list if the project convention requires it, and confirm `flow-components-bom` references the new artefact if the BOM aggregates modules. Verify that no `dispatchEvent` was added on the Flow side (the spec lists zero events; the test agent's earlier feature-flag test already covers attach-time enforcement).

**Files:**
- `flow-components/README.md` (modify if convention requires component listing)
- `flow-components-bom/pom.xml` (modify if BOM aggregates module artefacts)
- All files touched by Tasks 1–12 (validation only — no edits expected)

**Tests:**
- [ ] `mvn test -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow` — full unit test suite passes
- [ ] `mvn verify -am -pl vaadin-breadcrumbs-flow-parent/vaadin-breadcrumbs-flow-integration-tests -DskipUnitTests` — full IT suite passes
- [ ] `mvn spotless:apply` clean (no formatting changes required)
- [ ] `mvn checkstyle:check` clean

**Acceptance criteria:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` clean across the whole new module
- [ ] Documentation references (README, BOM) are accurate
