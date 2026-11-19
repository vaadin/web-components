import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  layout: {
    panelPosition: 'right',
  },
  theme: create({
    base: 'light',
    brandTitle: 'Vaadin web components',
    brandUrl: 'https://vaadin.com/components',
  }),
});
