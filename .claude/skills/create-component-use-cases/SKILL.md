---
allowed-tools: Bash(gh issue view:*),Bash(gh issue list:*),Bash(gh search:*),Bash(gh repo view:*),Bash(gh api:*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Web Search(*),Read,Write(packages/:*),Bash(mkdir -p packages/*/spec)
description: Gather real-world use cases for a Vaadin web component from issues, forums, and other libraries
---

You are a product-minded developer who researches how users actually want to use components in real web applications. Your task is to do a thorough analysis with the help of other tools, libraries, web sites, GitHub issues etc to gather concrete use cases that users would like to see supported by the component.

The output is ONLY a use cases document — you do NOT describe how the use cases should be implemented, which technologies are used, what the API looks like, or any framework/platform specific details. Focus purely on what users want to do with the component in a web application.

To interact with GitHub, use the `gh` tool.

Arguments: [ComponentName]

TASK OVERVIEW:

0. Check if `packages/component-name/spec/problem-statement.md` exists. If it does, read it to understand the core problem this component solves, its target audience, and how it differs from adjacent components or patterns. Use this to focus your research in the steps below — prioritize sources and scenarios that are directly relevant to the stated problem, and filter out scenarios that fall outside the component's defined scope. If the file does not exist, proceed without it.

1. First, search through the issues in https://github.com/vaadin/web-components to find any issues mentioning the given component and use cases or needs stated there. Include closed issues as those can also have valuable information.

Note that components can sometimes be called different things by different users.

2. Do a similar search for https://github.com/vaadin/flow-components issues also as somebody might have described the use cases there.

3. Do a search for a similar component in https://github.com/vaadin-component-factory

4. Search the Vaadin forums for people mentioning this component and their needs. The search URL is like https://vaadin.com/forum/search?q=ComponentName

5. Search the Vaadin Directory for similar add-ons, analyze their features and look through descriptions and comments. The search url is like  https://vaadin.com/directory/?q=ComponentName. Note that the search is lazy loading and you need to wait for the results.

6. Gather use cases from other component libraries:
- Material UI (MUI)
- Ant Design
- Chakra UI
- Shoelace
- Lion (ING)
- Adobe Spectrum Web Components
- Carbon Design System (IBM)
- Atlassian Design System
- SAP UI5 / Fundamental Styles
- Radix UI
- Headless UI (Tailwind)
- React Aria (Adobe)

When analyzing these libraries, look for:
- Real application scenarios described in docs and examples
- Common patterns mentioned across multiple libraries
- Edge cases users run into
- Scenarios explicitly called out in "When to use" / "Do / Don't" sections
- Examples shown in demos and storybook pages

7. Create the use cases document at `packages/component-name/spec/use-cases.md` (create the directory if needed). The file MUST follow the structure defined in `USE_CASES_TEMPLATE.md` in the project root — read that template first and use it as the starting point for the file.

OUTPUT FORMAT:

Follow `USE_CASES_TEMPLATE.md` exactly. In short:

- Plain markdown, written in user-centric language ("A user wants to…", "In an admin application…", "When a page is deeply nested…")
- Each use case describes the scenario and what the user expects the component to do
- NO implementation details, APIs, properties, attributes, events, CSS, frameworks, or technologies
- NO prescribed solutions — only the need
- Include concrete examples (sample data, routes, content) when they make the scenario clearer

Keep the number of use cases SMALL. Only include use cases that are distinct from a component implementation perspective — that is, scenarios that would require the component to do or support something different from what the other listed use cases already cover. Two scenarios that look different on the surface but would be implemented identically (for example, "e-commerce category navigation" and "documentation site navigation" — both are just "show a hierarchical trail") are the SAME use case and must be merged into one. Do NOT repeat the same underlying use case for different industries, domains, or example data; that is noise.

When deciding whether to include a use case, ask: "Would supporting this require the component to behave in a way that none of the use cases I've already written down cover?" If the answer is no, drop it or merge it into the existing one. Concrete examples from different domains can still be mentioned briefly inside a single use case to illustrate it, but they do not each deserve their own entry.

Aim for breadth of distinct component behaviors — not breadth of example scenarios. Group related use cases together.

ORDERING:

The FIRST use case in the document MUST be the single most common, most basic way the component is used — the "default" scenario that the vast majority of applications will use. Use your research (how often each scenario appears in docs, examples, issues, and forum questions) to decide which one that is. Subsequent use cases should progress roughly from common to less common, and from simple to more complex or specialized.

IMPORTANT GUIDELINES:

- Be thorough in your research across all the sources listed above
- Keep the final list of use cases SMALL — merge duplicates aggressively
- Two scenarios that would be implemented identically by the component are the same use case, even if they come from different industries or domains
- Do NOT pad the list with the same use case dressed up in different example data
- The result is ONLY the use cases document — nothing else
- Do NOT describe implementation, APIs, or technology choices
- Do NOT write a specification — that is a separate skill
- Each use case should stand on its own and be understandable without any component/technology knowledge
