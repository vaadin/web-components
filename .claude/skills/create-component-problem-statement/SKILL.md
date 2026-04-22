---
allowed-tools: Web Search(*),Fetch(vaadin.com:*),Fetch(https://mui.com),Fetch(www.carbondesignsystem.com:*),Fetch(https://www.atlassian.design:*),Fetch(ant.design),Fetch(chakra-ui.com:*),Fetch(shoelace.style),Fetch(https://radix-ui.com:*),Fetch(https://react-aria.adobe.com:*),Read,Write(packages/:*),Bash(mkdir -p packages/*/spec),Bash(git add packages/*/spec/problem-statement.md && git commit *),Bash(git diff packages/*/spec/problem-statement.md),Agent
description: Define the core problem and product-level use cases for a Vaadin web component, before researching requirements
user-invocable: false
---

You define the scope and purpose of a component before any design or implementation work begins. Your task is to produce a problem statement with product-level use cases for a component: what problem it solves, who needs it, what users want to do with it, and how it differs from adjacent patterns.

This is the first step in the spec-driven development pipeline. The problem statement forms the product-level brief that guides the requirements research that follows.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Search the web for "{ComponentName} UX pattern" or "{ComponentName} design pattern" to understand the general purpose of this component type and how it is described in UX literature.

2. Check the Vaadin component set (https://vaadin.com/components) for adjacent or overlapping components. Identify components that solve a related problem.

3. Check the design system documentation sites from `research-sources.md` in this skill's directory for their "When to use" / "When not to use" guidance on this component type. Skip any resource that does not have the component. Do not research behavioral details or API specifics.

4. Draft the Differentiation section based on the adjacent components identified in steps 2–3. For each adjacent component or pattern, state what it handles that this component does not, and vice versa. The goal is to draw clear scope boundaries that later steps can use to accept or reject use cases.

5. Write use cases in two phases, excluding any scenario that falls outside the scope boundaries from step 4. Patterns found in research that fall outside scope belong in the Differentiation section, not in the Use Cases list.

   **Core use case.** Start with a single use case for the most basic, most common scenario that defines why this component exists.

   **Variant use cases.** Then look for situations where the user faces a constraint or context that the core scenario alone does not cover. Sources:
   - Edge-case and constrained-context scenarios (e.g., limited space, missing data, restricted permissions)
   - UX challenges found via web search for "{ComponentName} UX challenges"
   - Scenarios from "When to use" sections that go beyond the core scenario; treat "When not to use" items as scope exclusions

   Each variant must name what makes it different from the core.

   **Example format.** Every use case (core and variant) must have a general description first, followed by a specific concrete example in italics. The example should name a specific application domain and walk through the scenario concretely enough to build a demo from.

6. Validate the drafted use cases:

   a. **Distinctness.** Verify that each variant use case describes a situation the core use case does not already cover. If it does, fold it into the core as an example.

   b. **No conflation.** If a single use case bundles two independent situations where a user's needs and constraints differ, split it into separate use cases.

   c. **Scope.** Verify each use case falls within the boundaries established in step 4. If a use case describes a scenario that the Differentiation assigns to an adjacent component, remove it.

7. **Identify open questions and ask the user.** If the research reveals ambiguities about scope, adjacent-component boundaries, or which variant use cases belong, use AskUserQuestion to resolve them before writing the document. Record every question and answer in a `## Discussion` section at the end of the output document (after Use Cases). If a previous version of `problem-statement.md` exists, read its Discussion section first — answers already recorded there are still valid and do not need to be re-asked.

8. Read `PROBLEM_STATEMENT_TEMPLATE.md` in this skill's directory. Use it as the starting point for the output file.

9. Write the problem statement at `packages/{component-name}/spec/problem-statement.md` (create the directory if needed).

10. **Review the spec.** Spawn an Agent to review the problem statement. The agent has no prior context — provide a self-contained prompt containing: the path to the spec file just written (`packages/{component-name}/spec/problem-statement.md`), a note that there are no prerequisite specs to cross-reference (this is the first document in the pipeline), and an instruction to read `.claude/skills/shared/spec-reviewer-instructions.md` for review instructions. After receiving the reviewer's findings, address each one: fix clear gaps or hygiene issues directly in the spec, present ambiguities or design decisions that need user input via AskUserQuestion, and ignore false positives.

11. **Commit the result.** After writing the file, commit it with a message following this pattern:
   ```
   docs({component-name}): add problem statement for {component-name} component
   ```
   Use `git add packages/{component-name}/spec/problem-statement.md` — do not use `git add -A` or `git add .`.

OUTPUT FORMAT:

Follow `PROBLEM_STATEMENT_TEMPLATE.md` exactly. The document should be roughly one to two pages. Sections:

- **Problem** — The core need this component addresses for end users in a web application. Keep it concise.
- **Target Users** — Which end users benefit and in what kinds of applications or workflows.
- **Differentiation** — How this component differs from related or adjacent components/patterns. This section does the most to prevent scope creep in later steps. Be specific: name the adjacent patterns and explain what each does that this component does NOT, and vice versa.
- **Use Cases** — Product-level scenarios describing what users want to do with the component. Each use case has a general description followed by a specific concrete example in italics. Written in user language, ordered from most common to most specialized.
- **Discussion** — Questions posed to the user during production of this document, with the user's answers. Captures the decisions that shaped the problem statement — informational, not a summary of the sections above. Omit this section if no questions were asked.

IMPORTANT GUIDELINES:

- Detailed behavioral research happens in the next steps. This step frames the problem and captures product-level scenarios, not implementation-level behaviors.
- Do NOT list behavioral requirements or implementation-level details. Use cases describe scenarios ("a user wants to..."), not component behaviors ("the component must...").
- Do NOT describe API design, properties, events, or implementation details.
- Do NOT include framework-specific information.
- The result is ONLY the problem statement document — nothing else.