# Reproducing a Flow-component bug

Work in `<FLOW_ROOT>` (the sibling Flow repo, resolved in SKILL.md). It is a multi-module Maven project, Java 21+, Vaadin Flow 25+. Run all `mvn` commands from `<FLOW_ROOT>` (`cd "<FLOW_ROOT>"` first), and write the View under it — your shell's working directory at launch is the skill folder, not a repo root, so never rely on relative paths.

## Module layout

Each component has a parent module:

```
vaadin-<component>-flow-parent/
├── vaadin-<component>-flow/                    # component implementation (root-cause search)
├── vaadin-<component>-flow-integration-tests/  # put the repro View here
└── vaadin-<component>-testbench/               # TestBench elements
```

## 1. Create the repro View

Add a View under the integration-tests module:

```
<FLOW_ROOT>/vaadin-<component>-flow-parent/vaadin-<component>-flow-integration-tests/src/main/java/com/vaadin/flow/component/<component>/tests/Repro<issue>View.java
```

Use an existing View in that package (e.g. `<Component>View.java`) for the exact imports, copyright header, and base class. Minimal shape:

```java
package com.vaadin.flow.component.<component>.tests;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.<component>.<Component>;
import com.vaadin.flow.router.Route;

@Route("repro-<issue>")
public class Repro<issue>View extends Div {
    public Repro<issue>View() {
        // minimal setup that reproduces the bug; give components setId(...)
        <Component> component = new <Component>();
        add(component);
    }
}
```

The page is then served at `http://localhost:8080/repro-<issue>`.

You usually do **not** need a JUnit IT class to reproduce manually — driving the View with playwright-cli is enough. Add an IT (extending `com.vaadin.tests.AbstractComponentIT`, annotated `@TestPath("repro-<issue>")`) only if the user wants an automated regression test.

## 1b. Add missing component dependencies

A component's integration-tests module only depends on **its own** component plus `flow-html-components` (which provides `Div`, `Span`, etc.). A cross-component reproduction (e.g. a popover inside a dialog with a button) will fail to compile with `package … does not exist` / `cannot find symbol` for the components the module does not already depend on.

Before building, scan your View's imports. For each `com.vaadin.flow.component.<x>` package that is **not** already a `<dependency>` in the IT module's `pom.xml`, add it (artifact `vaadin-<x>-flow`, version `${project.version}`). Common mappings:

| Import package | artifactId |
| --- | --- |
| `…component.button` | `vaadin-button-flow` |
| `…component.dialog` | `vaadin-dialog-flow` |
| `…component.textfield` | `vaadin-text-field-flow` |
| `…component.orderedlayout` (VerticalLayout/HorizontalLayout) | `vaadin-ordered-layout-flow` |
| `…component.html` (Div, Span, …) | already present via `flow-html-components` |

```xml
<dependency>
    <groupId>com.vaadin</groupId>
    <artifactId>vaadin-<x>-flow</artifactId>
    <version>${project.version}</version>
</dependency>
```

This pom edit is part of the scaffold. When the bug reproduces it is **committed** on the `repro/<issue>` branch (Phase 6) so the branch is runnable by others — do not revert it. Only when the bug does **not** reproduce (no branch pushed) do you revert it in cleanup (`git -C <FLOW_ROOT> checkout -- <…>/pom.xml`). The `-am` build flag compiles the newly added sibling modules from source, so the first build is longer.

## 2. Run the integration-test server

First run compiles the frontend and is slow. Start in the background, from `<FLOW_ROOT>`:

```bash
cd "<FLOW_ROOT>" && mvn package jetty:run -Dvaadin.pnpm.enable -Dvaadin.frontend.hotdeploy=true -am -B -q -DskipTests \
  -pl vaadin-<component>-flow-parent/vaadin-<component>-flow-integration-tests
```

- Poll the background task output for `Frontend compiled successfully` before opening the browser — do not guess with `sleep`.
- If port 8080 is already in use, stop and ask the user whether to kill the process holding it.
- The server does **not** hot-reload Java changes — restart it after editing the View.

Stop it cleanly when done:

```bash
cd "<FLOW_ROOT>" && mvn jetty:stop -pl vaadin-<component>-flow-parent/vaadin-<component>-flow-integration-tests
```

Do **not** kill the background Maven task to stop Jetty — that leaves the forked Jetty JVM running and holding port 8080.

## 3. Source layout for root-cause search

- Component implementation: `vaadin-<component>-flow-parent/vaadin-<component>-flow/src/main/java/com/vaadin/flow/component/<component>/`
- Shared base classes: `vaadin-flow-components-shared-parent/vaadin-flow-components-base/`
- Connectors / inline JS: `vaadin-<component>-flow/src/main/resources/META-INF/resources/frontend/`

If the root cause turns out to be in the underlying web component, switch to `references/web-component.md` and reproduce there.
