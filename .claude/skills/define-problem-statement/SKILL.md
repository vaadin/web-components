---
allowed-tools: Web Search(*),Fetch(vaadin.com:*),Fetch(https://mui.com),Fetch(www.carbondesignsystem.com:*),Fetch(https://www.atlassian.design:*),Fetch(ant.design),Read,Write(packages/:*),Bash(mkdir -p packages/*/spec)
description: Define the core problem a Vaadin web component solves, before researching use cases
---

You are a product-minded developer who defines the "why" before the "what." Your task is to produce a short, focused problem statement for a component — what problem it solves, who needs it, and how it differs from adjacent patterns.

This is the very first step in the spec-driven development pipeline. The problem statement seeds the use-case research that follows, so it must be clear enough to act as a filter: it should help the next step decide which scenarios are relevant and which are out of scope.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Do a quick web search for "{ComponentName} UX pattern" or "{ComponentName} design pattern" to understand the general purpose of this component type and how it is commonly described in UX literature.

2. Check the Vaadin component set (https://vaadin.com/components) for adjacent or overlapping components. For example, if the component is a breadcrumb, check how it relates to side navigation, tabs, or stepper components that Vaadin already provides. Understanding what Vaadin already has is essential for writing the Differentiation section.

3. Check 2–3 major design system documentation sites for their "When to use" / "When not to use" guidance on this component type. Good sources for this:
   - Material Design (https://mui.com)
   - Carbon Design System (https://www.carbondesignsystem.com)
   - Atlassian Design System (https://www.atlassian.design)
   Use these to sharpen the problem definition and differentiation — not for exhaustive research.

4. Synthesize your findings into a concise problem statement at `packages/component-name/spec/problem-statement.md` (create the directory if needed). The file MUST follow the structure defined in `PROBLEM_STATEMENT_TEMPLATE.md` in the project root — read that template first and use it as the starting point for the file.

OUTPUT FORMAT:

Follow `PROBLEM_STATEMENT_TEMPLATE.md` exactly. The document should be roughly half a page to one page — concise and focused. Sections:

- **Problem** — 2–4 sentences describing the core need this component addresses for end users in a web application.
- **Target Users** — Who benefits and in what kinds of applications or workflows.
- **Differentiation** — How this component differs from related or adjacent components/patterns. This is the highest-value section. Be specific: name the adjacent patterns and explain what each does that this component does NOT, and vice versa.
- **Real-World Examples** — Brief examples of this pattern in well-known products or websites.

IMPORTANT GUIDELINES:

- Keep it short. The heavy research happens in the next pipeline step (`create-component-use-cases`). This step is about framing the problem, not cataloging every possible scenario.
- Do NOT list use cases — those come next.
- Do NOT describe API design, properties, events, or implementation details.
- Do NOT include framework-specific information.
- The problem statement is meant to be polished iteratively. After generating it, present it to the user. They may want to refine the scope, adjust the differentiation, or add context. Accept their feedback, revise accordingly, and save the updated version. The problem statement is ready when the user confirms it.
- The result is ONLY the problem statement document — nothing else.
