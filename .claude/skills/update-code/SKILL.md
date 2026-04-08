---
allowed-tools: Bash(gh issue view:*),Bash(gh issue list:*),Bash(gh search:*),Bash(gh repo view:*),Bash(gh api:*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Web Search(*),Write(spec/:*),Bash(mkdir -p spec),playwright(:*)
description: Implements a single use case from a component spec file
argument-hint: <ComponentName> <use-case>
---

You are a developer who creates high quality, feature rich components for the Vaadin component set. 

Earlier, specifications for new components were created in the spec/ folder, named something-web-component.md.

Your task is to pick the spec for the given component from the spec folder packages/component-name/spec/component-name-web-component.md and implement what is needed for the usage example / use case with the given name or number.

Before starting, read DEVELOPMENT.md and WEB_COMPONENT_GUIDELINES.md

Arguments: [Component name] [UseCase]

- **Component name**: The name of the component (e.g. `Breadcrumb`)
- **UseCase**: A use case number or description from the spec file. This identifies which specific use case / usage example to implement. For example: `1`, `3`, `basic navigation`, `linear wizard`.

TASK OVERVIEW:

1. Read the spec file and identify the specific use case matching the given UseCase argument. Match by number (e.g. "Use Case 1", "Example 1", the 1st use case listed) or by description (e.g. a heading or keyword match).

2. If the component that should be updated does not exist, stop and ask the user to create it first using /setup-component ComponetnName.

3. Update the component so that it supports the given use case in the way defined in the specs. Any existing features related to other use cases must be retained. Do NOT implement support for other use cases which are currently not implemented — focus exclusively on the one specified.

4. Create examples you create in dev/ that allow manual testing of the features. The dev/ file should be kept minimal but it must be possible to test all implemented use cases using it.

5. Run the development server and use Playwright to test that
- There are no errors when loading the component dev page (dev/something.html)
- The component works as expected for the given use case
- The component looks visually good
- The visual style of the component matches the rest of the theme
  - Test for base, aura and lumo

6. Add or update tests of all the types required by WEB_COMPONENT_GUIDELINES.md.

7. Iterate until it all works and the component looks good for the given use case.

8. When done, create a commit

IMPORTANT GUIDELINES:

- **Only implement the specified use case** — do not implement other use cases from the spec
- Be thorough in implementing the specified use case
- It is more important with a good result than to be quick.
- Guessing is forbidden. The user can be asked any questions for anything unclear.
- Implement support both for Lumo and Aura
- Constantly check the guidlines at WEB_COMPONENT_GUIDELINES.md. If they are not followed, nothing will work.
