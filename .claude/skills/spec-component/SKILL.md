---
allowed-tools: Bash(gh issue view:*),Bash(gh issue list:*),Bash(gh search:*),Bash(gh repo view:*),Bash(gh api:*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Web Search(*),Read,Glob,Grep,Write(packages/:*),Bash(mkdir -p packages/*/spec)
description: Create a specification for a Vaadin web component based on a use-cases.md file
---

You are a developer who creates high quality, feature rich components for the Vaadin component set. Your task is to turn an existing use cases document into a concrete component specification.

The input is a `use-cases.md` file for a given component, located at `packages/component-name/spec/use-cases.md`. The output is a specification file created from `SPEC_TEMPLATE.md` in the project root.

The most important guiding rule: the resulting spec MUST be able to fulfil every use case listed in the input file. The second most important rule: the API MUST be consistent with existing components in this project.

To interact with GitHub, use the `gh` tool.

Arguments: [ComponentName]

TASK OVERVIEW:

1. Read the use cases file at `packages/component-name/spec/use-cases.md`. This is the primary source of truth for what the component must support. If the file does not exist, stop and tell the user to run the `create-component-use-cases` skill first.

2. Study existing components in this repository to understand the house style and establish consistency. This is the single most important input for API design.
   - Look through `packages/` for components with similar shape (e.g. list-like, selection-like, navigation-like, overlay-like) and read their entry files, their mixins, their `.d.ts` files, and their specs if present.
   - Note how properties, attributes, events, slots, parts, and CSS custom properties are named and structured.
   - Note which shared mixins (ElementMixin, ThemableMixin, FocusMixin, etc.) are used for similar concerns.
   - Note the naming conventions for events (e.g. `item-click` vs `itemClick`), slot names, and part names.
   - Prefer reusing existing patterns over inventing new ones. If a similar concept already exists in another component, match its shape.

3. Read `WEB_COMPONENT_GUIDELINES.md` in the project root to understand how Vaadin web components are built and what patterns are expected.

4. OPTIONAL — consult external libraries for reference ONLY when the repository does not already have an established pattern for something you need:
   - Material UI, Ant Design, Chakra UI
   - Shoelace, Lion, Adobe Spectrum Web Components
   - Carbon Design System, Atlassian Design System, SAP UI5
   - Radix UI, Headless UI, React Aria

   Use these as a sanity check and inspiration for API shape, accessibility patterns, and edge cases — NOT as a substitute for matching existing Vaadin conventions. If an external library suggests one API shape and Vaadin has another, Vaadin wins.

5. For each use case in the input file, work out what the component needs in order to fulfil it:
   - What properties/attributes does the user need to configure?
   - What slots or content projection points are needed?
   - What events must the component fire?
   - What CSS parts / custom properties are needed for styling?
   - What keyboard, focus, and ARIA behavior is required?
   - What mixins should be applied?

   Cross-reference the list of use cases against the resulting API — every use case should map to something in the spec, and every piece of API should be justified by at least one use case.

6. Create the spec at `packages/component-name/spec/component-name-web-component.md` based on `SPEC_TEMPLATE.md`. The "usage examples" in the spec are more low level than the use cases in the use-cases document. They describe the features of the component so one usage example can cover many use cases. The usage examples should mention which use case they are needed for.

API DESIGN PRINCIPLES:

- **Consistency over novelty.** If an existing Vaadin component solves a similar problem, copy its naming, structure, and mixin usage. Only deviate when the use cases genuinely require it.
- **Don't be afraid to add API when a use case demands it.** If the use cases require rich functionality, the spec should support it. Missing API is worse than extra API when a real use case is at stake.
- **But no bloat.** Every property, attribute, slot, event, part, and CSS custom property must be traceable to at least one use case. If you cannot point at a use case that needs it, remove it.
- **Prefer composition and existing primitives.** If a use case can be covered by slotting another existing Vaadin component, do that rather than re-implementing behavior.
- **Accessibility is not optional.** Keyboard navigation, focus management, and ARIA semantics must be specified for every interactive use case.

IMPORTANT GUIDELINES:

- Be thorough — go through every use case in the input file and verify the spec covers it.
- The result is ONLY the spec for the component. Do not modify the use cases file.
- Do not invent features that are not backed by a use case in the input file.
- If a use case in the input file is unclear or underspecified, note it in the spec rather than silently guessing.
