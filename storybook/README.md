# Storybook

This workspace holds a Storybook 10 prototype for a selection of Vaadin web components. It uses the `@storybook/web-components-vite` framework.

## Commands

Run these from the repository root:

```sh
yarn storybook:start       # Generate custom-elements.json, then start Storybook on port 6006
yarn storybook:build       # Generate custom-elements.json, then build a static Storybook into storybook/dist
yarn lint:types:storybook  # Type check the Storybook configuration and the addon
```

## Structure

- `.storybook/`: Storybook configuration in TypeScript
- `addons/theme-switcher/`: local addon that changes the Vaadin theme of the preview
- `addons/rtl-direction/`: local addon that changes the text direction of the preview
- `stories/`: stories in JavaScript, one file for each component

## Theme switcher addon

Provides 2 toolbar controls:

- Theme selector: base styles, Lumo, Aura
- Dark color scheme toggle button

The preview injects the theme CSS using `<style>` element.
Lumo and Aura apply to the rendered components without a reload.

To open a story with a given theme, modify URL:

```
?path=/story/actions-button--primary&globals=vaadinTheme:aura;vaadinColorScheme:dark
```

## RTL direction addon

Adds a toggle button for right-to-left direction to the toolbar.

The preview sets the `dir` attribute on the document element.
Vaadin components observe it and update without a reload.

To open a story with `dir="rtl"`, modify URL:


```
?path=/story/actions-button--primary&globals=direction:rtl
```

## Docs

The docs pages read the API of each component from the root `custom-elements.json`.
`.storybook/custom-elements.ts` is used to add missing `|` to component JSDoc tables.
