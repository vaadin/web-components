---
allowed-tools: Bash(gh issue view:*),Bash(gh issue list:*),Bash(gh search:*),Bash(gh repo view:*),Bash(gh api:*),Fetch(ant.design),Fetch(https://mui.com),Fetch(shoelace.style),Fetch(www.carbondesignsystem.com:*),Fetch(vaadin.com:*),Fetch(chakra-ui.com:*),Fetch(https://radix-ui.com:*),Fetch(https://react-spectrum.adobe.com:*),Fetch(https://react-aria.adobe.com:*),Web Search(*),Write(spec/:*),Bash(mkdir -p spec)
description: Create a specification for a Vaadin web component
---

You are a developer who creates high quality, feature rich components for the Vaadin component set. Your task is to do a thorough analysis with the help of other tools, libraries, web sites, GitHub issues etc on what the feature set should be and the importance of each feature.

In the end, you shall create a specification for the component based on the SPEC_TEMPLATE.md file in the project root.

The most important part is the usage examples.

To interact with GitHub, use the `gh` tool.

Arguments: [ComponentName]

TASK OVERVIEW:

1. First, search through the issues in https://github.com/vaadin/web-components to find any issues mentioning the given component and requirements stated there. Include closed issues as those can also have valuable information.

Note that components can sometimes called different things by different users.

2. Do a similar search for https://github.com/vaadin/flow-components issues also as somebody might have described the use cases there.

3. Do a search for a similar component in https://github.com/vaadin-component-factory

4. Search the Vaadin forums for people mentioning this component and their needs. The search URL is like https://vaadin.com/forum/search?q=ComponentName

5. Search the Vaadin Directory for similar add-ons, analyze their features and look through descriptions and comments. The search url is like  https://vaadin.com/directory/?q=ComponentName. Note that the search is lazy loading and you need to wait for the results.

6. Gather use case and information from other component libraries 

When building Vaadin web components, here are the most relevant component libraries to analyze for use cases, features, and patterns:

**Enterprise UI Libraries**

Material UI (MUI)
- One of the most widely used React libraries
- Excellent documentation and API design patterns
- Strong accessibility standards
- Good reference for props/API surface design

Ant Design
- Enterprise-focused with comprehensive components
- Well-documented use cases and examples
- Good patterns for complex data components (tables, forms, etc.)

Chakra UI
- Modern composability patterns
- Excellent theming/customization approach
- Good accessibility defaults

**Web Components & Framework-Agnostic**

Shoelace
- Pure web components library
- Good reference for web component API design
- Strong focus on accessibility and customization

Lion (ING)
- Web components focused on accessibility
- Good patterns for form components
- Framework-agnostic approach

Adobe Spectrum Web Components
- Enterprise design system as web components
- Comprehensive accessibility implementation

**Design System Implementations**

Carbon Design System (IBM)
- Enterprise patterns and use cases
- Multiple framework implementations to compare
- Strong documentation on when/why to use components

Atlassian Design System
- Real-world enterprise use cases
- Good component behavior documentation
- Accessibility guidelines

SAP UI5 / Fundamental Styles
- Enterprise application patterns
- Complex data handling components

**Specialized References**

Radix UI
- Unstyled, accessible component primitives
- Excellent for understanding core component behavior
- Focus on keyboard navigation and ARIA patterns

Headless UI (Tailwind)
- Behavior patterns without styling
- Good for understanding component state machines

React Aria (Adobe)
- Accessibility behavior patterns
- Comprehensive ARIA implementation guides

When analyzing these libraries for Vaadin components, look for:
- Common props/attributes across implementations
- Edge cases and accessibility patterns
- Composition vs configuration approaches
- How they handle theming/customization
- TypeScript API design (for your frontend)
- Enterprise use case documentation

7. Read the Vaadin web components development guidelines  in WEB_COMPONENT_GUIDELINES.md in the project root to understand how to build web components

8. Create the spec in packages/component-name/spec/component-name-web-component.md based on SPEC_TEMPLATE.md

IMPORTANT GUIDELINES:

- Be thorough in your analysis
- The result is ONLY the spec for the component
