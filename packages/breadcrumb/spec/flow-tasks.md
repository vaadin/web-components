# Breadcrumb Flow Implementation Tasks

<!--
Ordered implementation tasks derived from flow-spec.md. Each task is a self-contained unit of work following test-driven development in the flow-components repository.

Primary input: packages/breadcrumb/spec/flow-spec.md
API context: packages/breadcrumb/spec/flow-developer-api.md
Traceability: packages/breadcrumb/spec/requirements.md (universal + flow)
-->

## Spec References

- [flow-spec.md](flow-spec.md)
- [flow-developer-api.md](flow-developer-api.md)
- [requirements.md](requirements.md) — universal + flow
- [developer-api.md](developer-api.md) — web component API being wrapped
- [spec.md](spec.md) — web component spec

---

## Task 1: Scaffold vaadin-breadcrumb-flow-parent module

**Spec sections:** Module / Package Layout
**Requirements:** —
**Depends on:** —

Create the three sub-modules (`-flow`, `-flow-integration-tests`, `-testbench`) with pom.xml wiring. Create empty class shells for `Breadcrumb.java`, `BreadcrumbItem.java`, `HasBreadcrumbItems.java` with annotations and implemented interfaces from the spec (empty bodies). Create empty `BreadcrumbElement.java` and `BreadcrumbItemElement.java` in the testbench module. Wire the new module into `flow-components/pom.xml`. Add a smoke test and serialisation test.

**Files:**
- `vaadin-breadcrumb-flow-parent/pom.xml` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/pom.xml` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/BreadcrumbItem.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/HasBreadcrumbItems.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbSerializableTest.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests/pom.xml` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench/pom.xml` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench/src/main/java/com/vaadin/flow/component/breadcrumb/testbench/BreadcrumbElement.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench/src/main/java/com/vaadin/flow/component/breadcrumb/testbench/BreadcrumbItemElement.java` (create)
- `pom.xml` (modify — add vaadin-breadcrumb-flow-parent module)

**Tests:**
- [ ] `new Breadcrumb()` returns a non-null instance whose element tag is `vaadin-breadcrumb`
- [ ] `new BreadcrumbItem("Home")` returns a non-null instance whose element tag is `vaadin-breadcrumb-item`
- [ ] `BreadcrumbSerializableTest` round-trips `new Breadcrumb()` through Java serialisation without throwing

**Acceptance criteria:**
- [ ] `mvn clean install -DskipTests -pl vaadin-breadcrumb-flow-parent -am` succeeds
- [ ] `mvn spotless:apply` and `mvn checkstyle:check` on the new module both clean
- [ ] All new tests pass

---

## Task 2: BreadcrumbItem — constructors, label, path, current

**Spec sections:** Component Classes → `BreadcrumbItem`
**Requirements:** 1, 2, 3, 8
**Depends on:** 1

Implement the `BreadcrumbItem` constructors (label, label+path, label+view, label+view+routeParams, label+path+prefix, label+view+prefix, icon+path), `setLabel`/`getLabel`, `setPath(String)`/`getPath`, `setPath(Class<?>)`/`setPath(Class<?>, RouteParameters)`, `setCurrent`/`isCurrent`, and `asCurrent()`. The `path` property maps to the element's `path` attribute. The `current` property maps to the element's `current` attribute. Router-integrated path resolves via `RouteConfiguration`. See the spec for the full constructor list and method signatures.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/BreadcrumbItem.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbItemTest.java` (create)

**Tests:**
- [ ] `new BreadcrumbItem("Home")` sets the label to "Home"
- [ ] `new BreadcrumbItem("Docs", "/docs")` sets label and path
- [ ] `setPath("/new-path")` updates the element's `path` property
- [ ] `getPath()` returns the current path string
- [ ] `setLabel("New")` updates the text content
- [ ] `getLabel()` returns the current label
- [ ] `setCurrent(true)` sets the `current` attribute on the element
- [ ] `isCurrent()` returns the current state
- [ ] `asCurrent()` sets current to true and returns the same item instance
- [ ] Constructing with no path produces an item with null path (non-clickable)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 3: HasBreadcrumbItems and Breadcrumb items API

**Spec sections:** Component Classes → `HasBreadcrumbItems`, Component Classes → `Breadcrumb` (items API)
**Requirements:** 1, 5, 6
**Depends on:** 2

Implement the `HasBreadcrumbItems` interface with default methods: `addItem(BreadcrumbItem...)`, `addItemAsFirst`, `addItemAtIndex`, `getItems()`, `remove(BreadcrumbItem...)`, `removeAll()`. Implement `Breadcrumb.setItems(BreadcrumbItem...)` and `setItems(List<BreadcrumbItem>)` which call `removeAll()` then `addItem`. See the spec for the full interface definition.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/HasBreadcrumbItems.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbTest.java` (create)

**Tests:**
- [ ] `addItem(item1, item2)` appends both items as children of the breadcrumb element
- [ ] `getItems()` returns the added items in order
- [ ] `addItemAsFirst(item)` inserts the item before existing items
- [ ] `addItemAtIndex(1, item)` inserts at the correct position
- [ ] `remove(item)` removes the item from children
- [ ] `removeAll()` removes all breadcrumb items
- [ ] `setItems(item1, item2)` replaces existing items with the new ones
- [ ] `setItems(List.of(item1))` accepts a list

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 4: BreadcrumbItem — HasPrefix and icon constructors

**Spec sections:** Component Classes → `BreadcrumbItem` (implements HasPrefix, icon constructors)
**Requirements:** 7
**Depends on:** 2

Wire `BreadcrumbItem implements HasPrefix` so that `setPrefixComponent(Component)` / `getPrefixComponent()` work via the `slot="prefix"` mechanism from `vaadin-flow-components-base`. Verify the icon constructors that accept a `Component prefixComponent`.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/BreadcrumbItem.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbItemTest.java` (modify)

**Tests:**
- [ ] `setPrefixComponent(icon)` adds the component with `slot="prefix"` on its element
- [ ] `getPrefixComponent()` returns the component set as prefix
- [ ] `new BreadcrumbItem("Projects", "/projects", icon)` sets both path and prefix component
- [ ] `new BreadcrumbItem(icon, "/")` creates an icon-only item with the given path

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 5: Separator slot

**Spec sections:** Component Classes → `Breadcrumb` (setSeparator/getSeparator)
**Requirements:** 10
**Depends on:** 3

Implement `Breadcrumb.setSeparator(Component)` / `getSeparator()` which manages the `slot="separator"` on the breadcrumb element using `SlotUtils`. When no separator is set, the web component renders its default chevron.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbTest.java` (modify)

**Tests:**
- [ ] `setSeparator(new Span("/"))` adds the component with `slot="separator"`
- [ ] `getSeparator()` returns the separator component
- [ ] Setting separator to `null` removes the slotted separator

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 6: I18n

**Spec sections:** i18n, Component Classes → `Breadcrumb` (setI18n/getI18n, nested BreadcrumbI18n)
**Requirements:** 15
**Depends on:** 3

Implement the nested `Breadcrumb.BreadcrumbI18n` class with `navigationLabel` and `overflow` fields, fluent setters, `@JsonInclude(NON_NULL)`, `implements Serializable`. Implement `Breadcrumb.setI18n(BreadcrumbI18n)` / `getI18n()` using `JacksonUtils.beanToJson(...)` and `Element.setPropertyJson("i18n", ...)`.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbTest.java` (modify)

**Tests:**
- [ ] `setI18n(new BreadcrumbI18n().setNavigationLabel("Breadcrumb"))` pushes JSON to the element's `i18n` property
- [ ] `getI18n()` returns the previously set i18n object
- [ ] Fluent setters return the i18n instance for chaining
- [ ] `BreadcrumbI18n` is serialisable (round-trip through Java serialisation)
- [ ] Null fields are omitted from JSON (via `@JsonInclude(NON_NULL)`)

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 7: NavigateEvent

**Spec sections:** Component Classes → `Breadcrumb` (NavigateEvent, addNavigateListener)
**Requirements:** 2
**Depends on:** 3

Implement the nested `Breadcrumb.NavigateEvent` class (`@DomEvent("navigate")`) with `path` and `current` fields extracted via `@EventData`. Implement `addNavigateListener(ComponentEventListener<NavigateEvent>)` returning `Registration`. See the spec for the event class signature and `@EventData` expressions.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbTest.java` (modify)

**Tests:**
- [ ] `addNavigateListener` returns a `Registration`
- [ ] A simulated DOM `navigate` event triggers the listener
- [ ] The event carries the correct `path` value
- [ ] The event carries the correct `current` boolean
- [ ] Removing the registration stops the listener from firing

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 8: Automatic trail from view hierarchy

**Spec sections:** Component Classes → `Breadcrumb` (AfterNavigationObserver, auto-trail), Key Design Decisions §8
**Requirements:** 19
**Depends on:** 3

Implement the `AfterNavigationObserver.afterNavigation(AfterNavigationEvent)` logic. When no explicit items have been supplied (`explicitItems == false`), read the active route chain and build `BreadcrumbItem` instances — deriving labels from `@PageTitle`, `HasDynamicTitle`, or class simple name. When `addItem`/`setItems` is called, set `explicitItems = true` to disable auto mode. See the spec for the full behavioral description.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/main/java/com/vaadin/flow/component/breadcrumb/Breadcrumb.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbTest.java` (modify)

**Tests:**
- [ ] A breadcrumb with no explicit items responds to `afterNavigation` by building items from the route chain
- [ ] Items built from auto-trail have labels derived from `@PageTitle` when present
- [ ] The last item in the auto-trail is marked as `current`
- [ ] Calling `addItem(...)` disables auto mode — subsequent `afterNavigation` calls do not rebuild the trail
- [ ] Calling `setItems(...)` also disables auto mode

**Acceptance criteria:**
- [ ] All new tests pass
- [ ] Existing tests still pass
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 9: TestBench elements

**Spec sections:** TestBench Elements → `BreadcrumbElement`, `BreadcrumbItemElement`
**Requirements:** —
**Depends on:** 3

Implement the TestBench element classes. `BreadcrumbElement`: `getItems()`, `getCurrentItem()`, `hasOverflow()`, `clickOverflowButton()`. `BreadcrumbItemElement`: `getText()`, `isCurrent()`, `getPath()`, `clickLink()`. See the spec for the full method list.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench/src/main/java/com/vaadin/flow/component/breadcrumb/testbench/BreadcrumbElement.java` (modify)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench/src/main/java/com/vaadin/flow/component/breadcrumb/testbench/BreadcrumbItemElement.java` (modify)

**Tests:**
- [ ] TestBench module compiles without errors

**Acceptance criteria:**
- [ ] `mvn clean install -DskipTests -pl vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-testbench -am` succeeds
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 10: Integration tests

**Spec sections:** Coverage (all universal + flow requirements)
**Requirements:** 1–19 (all universal + flow)
**Depends on:** 8, 9

Create the integration test view (`BreadcrumbPage.java`) with `@Route` annotation demonstrating: a static breadcrumb trail, a dynamic trail built via `setItems`, an icon-only root item, a non-clickable intermediate item, a custom separator, and an i18n configuration. Create `BreadcrumbIT.java` extending `AbstractComponentIT` with end-to-end assertions using the TestBench elements from Task 9. Enable the experimental feature flag in `vaadin-featureflags.properties`.

**Files:**
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests/src/main/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbPage.java` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests/src/main/resources/vaadin-featureflags.properties` (create)
- `vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests/src/test/java/com/vaadin/flow/component/breadcrumb/tests/BreadcrumbIT.java` (create)

**Tests:**
- [ ] The breadcrumb renders on the page with the expected number of items
- [ ] The current item has `current` attribute
- [ ] Clicking an ancestor item navigates (URL changes)
- [ ] Items with no path render as non-clickable
- [ ] The custom separator renders between items
- [ ] Icon-only root item renders with its icon

**Acceptance criteria:**
- [ ] All integration tests pass: `mvn verify -am -pl vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests -DskipUnitTests`
- [ ] `mvn spotless:apply` passes
- [ ] `mvn checkstyle:check` passes

---

## Task 11: Final validation

**Spec sections:** (all — final verification)
**Requirements:** —
**Depends on:** 10

Run all validation checks across the full module. Format code, verify checkstyle, run unit tests and integration tests. Verify serialisation test passes with all features wired in.

**Files:**
- (no new files)

**Tests:**
- [ ] `mvn spotless:apply` produces no changes
- [ ] `mvn checkstyle:check -pl vaadin-breadcrumb-flow-parent` passes
- [ ] `mvn test -pl vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow` — all unit tests pass
- [ ] `mvn verify -am -pl vaadin-breadcrumb-flow-parent/vaadin-breadcrumb-flow-integration-tests -DskipUnitTests` — all ITs pass
- [ ] `BreadcrumbSerializableTest` passes with all features wired

**Acceptance criteria:**
- [ ] All tests pass across unit and integration suites
- [ ] Code formatting is clean
- [ ] No checkstyle violations
