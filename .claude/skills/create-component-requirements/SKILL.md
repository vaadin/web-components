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
   - **Use Cases** — decompose each use case into the behavioral capabilities it implies. These behavioral threads become research targets for steps 3–8. Every use case must be covered by at least one requirement in the final document.

2. **Identify open questions and ask the user.** Before doing deep external research, identify the scope and behavioral questions that the problem statement does not already resolve. Typical candidates: whether items should support icons, what happens on mobile (simplify to a back link vs. collapse the middle), whether the Flow API needs a specific integration hook, which edge cases should be in scope, how ambiguous patterns should be resolved. Use AskUserQuestion to pose each one as a focused question. Incorporate the user's answers before continuing. These answers steer the research in steps 3–8 and the detailed requirements in step 9.

   Record every question and answer in a `## Discussion` section that will sit at the top of the output document. This becomes the audit trail of decisions that shaped the requirements. If a previous version of `requirements.md` exists at `packages/{component-name}/spec/requirements.md`, read its Discussion section first — answers already recorded there are still valid and do not need to be re-asked.

Research guidance: Steps 3–8 search for real-world evidence and refinement of the behavioral threads identified in steps 1 and 2 and the decisions recorded in the Discussion section. When evaluating an issue, forum post, or design system pattern, check whether it describes a behavior that supports one of the use cases or aligns with a recorded decision. Behaviors that fall outside the Differentiation boundaries are out of scope. If research reveals an important behavior that no use case or decision covers but appears to be within scope, flag it via AskUserQuestion before including it — and add the new Q&A to the Discussion section.

3. Search https://github.com/vaadin/web-components issues (open and closed) that mention the component. Note that users may refer to the component by different names.

4. Search https://github.com/vaadin/flow-components issues for the same component.

5. Search https://github.com/vaadin-component-factory for add-ons related to the component.

6. Search the Vaadin forums using WebSearch with query `site:vaadin.com/forum ComponentName`. Do NOT use WebFetch for the forum — it is a heavy web application and WebFetch will return empty content.

7. Search the Vaadin Directory for similar add-ons using WebSearch with query `site:vaadin.com/directory ComponentName`. Do NOT use WebFetch for the directory — it is a heavy web application and WebFetch will return empty content.

8. Research the component in external design system libraries listed in `research-sources.md` in this skill's directory. Focus on behavioral patterns that support the use cases: how other libraries solve the same scenarios, what additional behaviors they provide for those scenarios, and "when to use" guidance that validates or refines the scope.

9. Create the requirements document at `packages/{component-name}/spec/requirements.md`. Read `REQUIREMENTS_TEMPLATE.md` in this skill's directory first and follow it exactly. The document starts with the `## Discussion` section capturing the Q&A from step 2 (plus any additional questions posed during research). After the Discussion, write numbered detailed requirements — each with a behavior-focused title, a statement of the required behavior, and a concrete example. Order requirements so that behaviors supporting the core use case come first, followed by behaviors for variant use cases (in the order they appear in the problem statement).

10. Read `DESIGN_GUIDELINES.md` at the repository root — specifically the "Universal behavioural requirements" section. DO NOT write numbered requirements that restate those universal rules (accessible names, customisable labels, focus order matching visual order, right-to-left support, readable/tappable targets on small viewports). They are enforced globally and would drift if duplicated per component.

    A component's `requirements.md` may mention a universal concern ONLY when the component adds something specific on top of the universal rule:

    - A concrete default value the component introduces (e.g. the default text of a navigation landmark's label).
    - A component-specific extension or override (e.g. a directional separator that flips in RTL, which goes beyond the generic "layout mirrors" rule).
    - A specific interaction pattern the universal rule does not pin down (e.g. an overflow menu that additionally opens with arrow keys on top of standard Tab/Enter).

    When such a component-specific requirement is included, state only the component-specific aspect. Do not re-derive the universal rule, and keep the requirement focused on the addition.

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

The first requirement must be the single most common, most basic behavior the component supports — typically the primary behavior needed for the core use case. Requirements supporting the core use case come before requirements that only apply to variant use cases. Within each group, order from common to specialized and from simple to complex. Component-specific defaults, extensions, or interaction patterns that extend a universal behavioural rule (see DESIGN_GUIDELINES.md) come after the purely functional requirements.

VERIFICATION:

Before finalizing, check that:
1. Every requirement states a required behavior, not an implementation detail or API shape.
2. No two requirements describe identical component behavior.
3. Each requirement covers a single, specific behavior — not a bundle of loosely related behaviors.
4. Requirements are ordered from most common to most specialized.
5. The first requirement is the simplest, most universal behavior.
6. The document follows the structure in `REQUIREMENTS_TEMPLATE.md`, including the Discussion section at the top.
7. The Discussion section records every question posed to the user in step 2 (and any follow-up questions raised during research) together with the user's answer. It does not duplicate the detailed requirements.
8. Every answer in the Discussion section is reflected in the detailed requirements below — a decision captured there must actually shape at least one requirement.
9. Concrete examples are included where they make requirements unambiguous.
10. No requirement violates the problem statement's Differentiation section. Re-read the problem statement and confirm each requirement stays within scope.
11. Writing is concise: no multi-paragraph narrative where one paragraph suffices.
12. Every use case in `problem-statement.md` is addressed by at least one requirement. For each use case, verify that the covering requirements are sufficient for the scenario to work end-to-end — a single loosely related requirement is not enough.
13. No requirement restates a universal behavioural rule from `DESIGN_GUIDELINES.md` (accessible names, customisable labels, focus order, RTL, tappable-on-small-screens). Requirements that touch those concerns must add a component-specific default, extension, or interaction pattern — otherwise remove them.
14. Behaviours compose without ambiguity. For every pair of requirements whose conditions could both apply at the same time (e.g. "truncate long labels" and "collapse items when space is limited" both triggered by insufficient width; "keyboard shortcut X opens the menu" and "Tab moves focus through items" both firing on keyboard input), either the requirements already define the combined behaviour explicitly, or a new requirement is added that does. If the composition is genuinely an open design question, resolve it via AskUserQuestion before finalising.
