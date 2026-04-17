---
allowed-tools: Agent,Bash,Read,Write,Edit,Glob,Grep,WebFetch,WebSearch,AskUserQuestion,TaskCreate,TaskUpdate,TaskList,mcp__vaadin__*
description: Create a Flow demo application that exercises every use case and requirement of a component, using local web components and flow-components snapshots
user-invocable: true
---

Create a standalone Vaadin Flow demo application that exercises every use case and requirement of a component. One view per use case / requirement group, with navigation to browse them all.

The result is a runnable project at `{ComponentName}-cases/` in the web-components root, verified via Playwright MCP.

Arguments: [ComponentName]

## Pipeline

### Step 1: Build prerequisites

1. Run `mvn install -DskipTests` in `flow-components/` (or `../flow-components/`).
2. Run `yarn install` in the web-components root if `node_modules/` doesn't exist.

### Step 2: Download and set up the project

1. Download a Vaadin starter:
   ```bash
   curl -L "https://start.vaadin.com/dl?preset=default&projectName={ComponentName}-cases" -o /tmp/{component-name}-cases.zip
   unzip -o /tmp/{component-name}-cases.zip -d {ComponentName}-cases/
   ```
   If that fails, try `start.vaadin.com/skeleton`.

2. **Add the component dependency** to `pom.xml`:
   ```xml
   <dependency>
     <groupId>com.vaadin</groupId>
     <artifactId>vaadin-{component-name}-flow</artifactId>
     <version>{SNAPSHOT_VERSION}</version>
   </dependency>
   ```
   Get the SNAPSHOT version from `flow-components/vaadin-{name}-flow-parent/pom.xml`. Ensure the `vaadin-bom` version matches.

3. **Enable experimental feature flag** (if the component is experimental). Add to `src/main/resources/vaadin-featureflags.properties`:
   ```
   com.vaadin.experimental.{camelName}Component=true
   ```

4. **Configure Vite for local web components.** Run `./mvnw vaadin:prepare-frontend` first so Flow generates the Vite files, then create `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite';
   import { useLocalWebComponents } from './frontend/generated/vite-generated';

   export default defineConfig({
     plugins: [
       useLocalWebComponents('../')
     ]
   });
   ```
   The `'../'` argument points to the web-components monorepo root relative to the demo project.

5. **Copy MCP config:**
   ```bash
   cp .mcp.json {ComponentName}-cases/
   ```

### Step 3: Plan the demo views

Read:
- `packages/{component-name}/spec/problem-statement.md` — use cases
- `packages/{component-name}/spec/requirements.md` — behavioral requirements
- `packages/{component-name}/spec/flow-developer-api.md` — Java API examples

Plan **one view per use case or requirement group**. Group tightly related requirements when they naturally go together. Use the Vaadin MCP tools to look up API details for components used in the layout.

Structure:
- A `MainLayout` with `AppLayout` and `SideNav` for navigation
- Individual views with `@Route(value = "...", layout = MainLayout.class)`
- Each view: heading, brief description, component configured for that scenario

### Step 4: Implement the demo

Create all views using the Flow developer API from `flow-developer-api.md`. Each view should:
- Have a `@PageTitle` describing the use case
- Include a visible text description of what it demonstrates
- Configure the component for the specific requirement(s)
- Be self-contained

### Step 5: Start and verify

1. Start the application in the background:
   ```bash
   cd {ComponentName}-cases && ./mvnw spring-boot:run
   ```
   Wait for "Frontend compiled successfully".

2. **Verify with Playwright MCP** (if available):
   - Navigate to `http://localhost:8080`
   - Click through each view in the navigation
   - Verify each page loads without errors
   - Report results

3. If Playwright MCP is not available, tell the user to open `http://localhost:8080` manually.

### Step 6: Report

- Project location: `{ComponentName}-cases/`
- Views created and what each demonstrates
- Requirements/use cases covered
- How to run: `cd {ComponentName}-cases && ./mvnw spring-boot:run`
- Issues encountered

## Guidelines

- Use the **Vaadin MCP** to look up current APIs. Do not guess.
- Do not modify files in `packages/` or `flow-components/`.
- Prefer simple, readable code. Each view should be self-explanatory.
- To demonstrate automatic behaviors (overflow, RTL), configure the view to trigger them (e.g., `setWidth("200px")`).
