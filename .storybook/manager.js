import { addons } from '@web/storybook-prebuilt/addons.js';
import { create } from '@web/storybook-prebuilt/theming.js';

const vaadinTheme = create({
  brandTitle: 'Vaadin components',
  brandUrl: 'https://vaadin.com/components',
  brandImage: 'https://cdn2.hubspot.net/hubfs/1840687/Pages/trademark/vaadin-logo-full.svg'
});

addons.setConfig({
  theme: vaadinTheme,
  enableShortcuts: false
});
