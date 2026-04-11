---
allowed-tools: Web Search(*),Fetch(vaadin.com:*),Fetch(https://mui.com),Fetch(www.carbondesignsystem.com:*),Fetch(https://www.atlassian.design:*),Fetch(ant.design),Read,Write(packages/:*),Bash(mkdir -p packages/*/spec),mcp__vaadin
description: Define the core problem a Vaadin web component solves, before researching use cases
---

You define the scope and purpose of a component before any design or implementation work begins. Your task is to produce a short problem statement for a component: what problem it solves, who needs it, and how it differs from adjacent patterns.

This is the first step in the spec-driven development pipeline. The problem statement guides the use-case research that follows — the next step uses it to decide which scenarios are relevant and which are out of scope.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Search the web for "{ComponentName} UX pattern" or "{ComponentName} design pattern" to understand the general purpose of this component type and how it is described in UX literature.

2. Check the Vaadin component set (https://vaadin.com/components) for adjacent or overlapping components. Also use the Vaadin MCP tools to search documentation for related components when the components page alone is insufficient. Identify components that solve a related problem — for example, a navigation component might overlap with tabs, side navigation, or steppers. This informs the Differentiation section.

3. Check 2–3 major design system documentation sites for their "When to use" / "When not to use" guidance on this component type. Use these to refine the problem definition and differentiation — not for exhaustive research. Good sources for this:
   - Material Design (https://mui.com)
   - Carbon Design System (https://www.carbondesignsystem.com)
   - Atlassian Design System (https://www.atlassian.design)

4. Read `PROBLEM_STATEMENT_TEMPLATE.md` in this skill's directory. Write the problem statement at `packages/component-name/spec/problem-statement.md` (create the directory if needed), following the template structure exactly.

OUTPUT FORMAT:

Follow `PROBLEM_STATEMENT_TEMPLATE.md` exactly. The document should be roughly half a page to one page. Sections:

- **Problem** — 2–4 sentences describing the core need this component addresses for end users in a web application.
- **Target Users** — Who benefits and in what kinds of applications or workflows.
- **Differentiation** — How this component differs from related or adjacent components/patterns. This section does the most to prevent scope creep in later steps. Be specific: name the adjacent patterns and explain what each does that this component does NOT, and vice versa.
- **Real-World Examples** — Brief examples of this pattern in well-known web applications.

IMPORTANT GUIDELINES:

- Keep it short. Detailed research happens in the next step (`create-usage-specifications`). This step frames the problem, not catalogs scenarios.
- Do NOT list use cases.
- Do NOT describe API design, properties, events, or implementation details.
- Do NOT include framework-specific information.
- The result is ONLY the problem statement document — nothing else.