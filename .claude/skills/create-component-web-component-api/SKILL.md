---
allowed-tools: Web Search(*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Read(packages/*/spec/*),Read(.claude/skills/create-component-web-component-api/*),Write(packages/:*),Bash(mkdir -p packages/*/spec),mcp__vaadin
description: Design the developer-facing API for a Vaadin web component based on its requirements, without studying implementation source code
---

This skill takes a component's requirements and problem statement and produces concrete HTML/JS code examples showing the most convenient, minimal API a developer would use. The result is a `web-component-api.md` file — one section per requirement (or group of related requirements), each with a code example and a short rationale for the chosen API shape.

This is an intermediate step between requirements research and full specification. The API is designed from a developer ergonomics perspective, without reading source code or considering implementation feasibility.

Use the Vaadin MCP tools to study how existing Vaadin components expose their API — naming patterns, slot conventions, event styles, theming approach. Use these as reference, not as rules.

You do not have access to Glob, Grep, or Read on source code files. You can only read files under `packages/*/spec/` and templates in this skill's directory. This prevents implementation details from influencing the API design.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read the requirements file at `packages/{component-name}/spec/requirements.md`. This is the primary input — every code example must trace back to at least one requirement. If the file does not exist, stop and tell the user to run the `create-component-requirements` skill first.

   **Variant filter.** A requirement may carry an optional visible `**Applies to:** universal | web | flow` line directly under its title (default: `universal` when the line is absent). This skill designs the web component API, so ignore any requirement tagged `**Applies to:** flow` — those are covered by the Flow-variant pipeline (`create-component-flow-api`). Consider only `universal` and `web` requirements from here on.

2. Read the problem statement at `packages/{component-name}/spec/problem-statement.md`. Use the Differentiation section to verify that code examples stay within the component's defined scope. If the file does not exist, stop and tell the user to run the `create-component-problem-statement` skill first.

3. Read `API_DESIGN_TEMPLATE.md` in this skill's directory. Use it as the starting point for your output file.

4. **Search Vaadin documentation via MCP.** Use the Vaadin MCP tools to find documentation about related components and patterns. Use these as reference for the new component's API — look for:
   - Related Vaadin components and how developers use them
   - Naming conventions (tag names, properties, events, slots)
   - Usage patterns and best practices
Use the project version for the Vaadin version.

5. For each requirement (or group of related requirements), research how other component libraries expose similar functionality. See `research-sources.md` in this skill's directory for the library list and what to look for.

6. **Identify open questions and ask the user.** If research reveals ambiguous API choices that the requirements do not resolve (e.g., whether a feature should be an attribute vs. a slot, how two features interact in developer code), use AskUserQuestion to resolve them before writing the document. Record every question and answer in a `## Discussion` section at the end of the output document. If a previous version of `web-component-api.md` exists, read its Discussion section first — answers already recorded there are still valid and do not need to be re-asked.

7. For each requirement (or group of related requirements), write a concrete HTML/JS code example showing how a developer would use the component. For each example, include a brief "Why this shape" note explaining the rationale. Apply these principles:
   - **Make common cases easy.** The most frequent requirement should require the least code.
   - **Progressive disclosure.** Simple usage is simple; complex usage is possible.
   - **Consistency with Vaadin conventions.** Follow the conventions discovered via MCP in step 4.
   - **No bloat.** Every property or attribute must serve a requirement. Do not invent API surface that no requirement needs.
   - **Informed by Vaadin docs.** Align with conventions and patterns found in step 4.

8. Write the output to `packages/{component-name}/spec/web-component-api.md`.

OUTPUT FORMAT:

Follow `API_DESIGN_TEMPLATE.md` exactly. In short:

- One section per requirement (or group of related requirements), each containing:
  - A reference to which requirement number(s) it covers
  - A concrete HTML/JS code example
  - A brief "Why this shape" note
- A `## Discussion` section at the end, recording every question posed to the user and their answer. Omit if no questions were asked.

IMPORTANT GUIDELINES:

- Do NOT read source code. You can only read files under `packages/*/spec/` and templates in this skill's directory. This keeps the API design uninfluenced by implementation details.
- DO use Vaadin MCP tools to discover conventions and patterns from documentation. Use these as reference, not as rules.
- Do NOT consider implementation feasibility.
- Do NOT produce a full specification. No shadow DOM structure, no mixin chains, no property tables.
- Every requirement must be covered by at least one code example. Every code example must trace back to at least one requirement — if no requirement needs it, do not include it.
- Before finalizing, check every code example against the problem statement. If an example shows behavior that is out of scope or belongs to an adjacent component, remove it.
- The result is ONLY the developer API document — nothing else.
- Do NOT modify the requirements file or the problem statement file.
