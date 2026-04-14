---
allowed-tools: Bash(gh issue view:*),Bash(gh issue list:*),Bash(gh search:*),Bash(gh repo view:*),Bash(gh api:*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://www.atlassian.design:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Web Search(*),Read,Write(packages/:*),Bash(mkdir -p packages/*/spec)
description: Research behavioral requirements for a Vaadin web component's use cases and produce a requirements.md
---

This skill takes the use cases from a component's problem statement and researches the behavioral requirements needed to support them, producing a `requirements.md` document. The document lists the distinct behavioral requirements the component must support — each stated as a required behavior first, then illustrated with a concrete example from the perspective of an application end user.

The output contains NO implementation details, API shapes, property names, events, CSS, or framework-specific information — only user needs.

Use the `gh` CLI for GitHub interactions.

Arguments: [ComponentName]

TOOL EXECUTION: Never make multiple Bash calls in parallel. Execute them sequentially, one at a time. A known bug causes all parallel Bash calls to be cancelled when any one of them fails.

TOOL EXECUTION: When using `gh issue view` or `gh issue list`, always pass `--json` with the fields you need (e.g. `--json title,body,state,labels,comments`). The default GraphQL query fails because GitHub has deprecated classic Projects.

TASK OVERVIEW:

1. Read `packages/{component-name}/spec/problem-statement.md`. If the file does not exist, stop and instruct the user to run the `create-component-problem-statement` skill first. Use the problem statement as follows:

   - **Differentiation** — filter out scenarios that belong to adjacent components. This is a hard boundary for all subsequent steps.
   - **Use Cases** — decompose each use case into the behavioral capabilities it implies. These behavioral threads become research targets for steps 2–7. Every use case must be covered by at least one requirement in the final document.

Research guidance: Steps 2–7 search for real-world evidence and refinement of the behavioral threads identified in step 1. When evaluating an issue, forum post, or design system pattern, check whether it describes a behavior that supports one of the use cases. Behaviors that fall outside the Differentiation boundaries are out of scope. If research reveals an important behavior that no use case covers but appears to be within scope, flag it with AskUserQuestion before including it.

2. Search https://github.com/vaadin/web-components issues (open and closed) that mention the component. Note that users may refer to the component by different names.

3. Search https://github.com/vaadin/flow-components issues for the same component.

4. Search https://github.com/vaadin-component-factory for add-ons related to the component.

5. Search the Vaadin forums using WebSearch with query `site:vaadin.com/forum ComponentName`. Do NOT use WebFetch for the forum — it is a heavy web application and WebFetch will return empty content.

6. Search the Vaadin Directory for similar add-ons using WebSearch with query `site:vaadin.com/directory ComponentName`. Do NOT use WebFetch for the directory — it is a heavy web application and WebFetch will return empty content.

7. Research the component in external design system libraries listed in `research-sources.md` in this skill's directory. Focus on behavioral patterns that support the use cases: how other libraries solve the same scenarios, what additional behaviors they provide for those scenarios, and "when to use" guidance that validates or refines the scope.

8. Create the requirements document at `packages/{component-name}/spec/requirements.md`. Read `REQUIREMENTS_TEMPLATE.md` in this skill's directory first and follow it exactly. Organize requirements so that behaviors supporting the core use case come first, followed by behaviors for variant use cases (in the order they appear in the problem statement), then uniformly-applicable behaviors.

9. After drafting the core behavioral requirements, add requirements for uniformly-applicable behaviors as additional numbered items at the end of the list. Common categories include use by people with disabilities (low vision, color blindness, motor impairments, screen reader users), keyboard-only operation, use in right-to-left languages, behavior on small screens or narrow containers, and handling of long or dynamically changing text.

OUTPUT:

Follow `REQUIREMENTS_TEMPLATE.md` exactly. Key rules:

- Plain markdown, user-centric language, no prescribed solutions
- Each requirement states the required behavior first, then illustrates with a concrete example
- Write concisely: state the behavior directly, follow with a brief illustrative example. Avoid multi-paragraph narrative for a single point — one or two short paragraphs per requirement is the target
- Include concrete examples (sample data, realistic application context) when they make the requirement unambiguous

AMBIGUITY:

Every requirement must describe a single, clear expected behavior. Do not write "it could behave like X or Y" or leave multiple interpretations open. If research reveals conflicting patterns or unclear expectations, use AskUserQuestion to resolve the ambiguity before writing it into the document.

PROBLEM STATEMENT ENFORCEMENT:

The problem statement's Differentiation section lists adjacent components and patterns that the target component is NOT. This is a hard boundary. Before finalizing any requirement, check it against every Differentiation entry:

- If a requirement describes behavior that is the primary purpose of a listed adjacent component, reject it.
- If a requirement could be interpreted as overlapping with an adjacent pattern, narrow the wording until the overlap is eliminated, or use AskUserQuestion to resolve the ambiguity.
- When in doubt, exclude the requirement. The component should do its core job well; features that blur the boundary with adjacent components create confusion and scope creep.

After drafting all requirements, re-read the Differentiation section one more time and verify that no requirement violates it.

DEDUPLICATION:

Each requirement should cover a single, specific behavior. Do not merge distinct behaviors into one requirement — if two behaviors require different component capabilities, they deserve separate entries.

If two findings from research describe the exact same component behavior, keep only one requirement and use examples from both domains to illustrate it. The goal is to avoid duplicate requirements, not to minimize the number of requirements.

ORDERING:

The first requirement must be the single most common, most basic behavior the component supports — typically the primary behavior needed for the core use case. Requirements supporting the core use case come before requirements that only apply to variant use cases. Within each group, order from common to specialized and from simple to complex. Requirements for uniformly-applicable behaviors (use by people with disabilities, keyboard-only users, right-to-left languages, small screens, etc.) come after the core behavioral requirements.

VERIFICATION:

Before finalizing, check that:
1. Every requirement states a required behavior, not an implementation detail or API shape.
2. No two requirements describe identical component behavior.
3. Each requirement covers a single, specific behavior — not a bundle of loosely related behaviors.
4. Requirements are ordered from most common to most specialized, with uniformly-applicable behaviors at the end.
5. The first requirement is the simplest, most universal behavior.
6. The document follows the structure in `REQUIREMENTS_TEMPLATE.md`.
7. Concrete examples are included where they make requirements unambiguous.
8. No requirement violates the problem statement's Differentiation section. Re-read the problem statement and confirm each requirement stays within scope.
9. Writing is concise: no multi-paragraph narrative where one paragraph suffices.
10. Every use case in `problem-statement.md` is addressed by at least one requirement. For each use case, verify that the covering requirements are sufficient for the scenario to work end-to-end — a single loosely related requirement is not enough.
