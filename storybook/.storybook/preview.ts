import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/web-components-vite';
import apiReference from '../addons/api-reference/preview.js';
import rtlDirection from '../addons/rtl-direction/preview.js';
import themeSwitcher from '../addons/theme-switcher/preview.js';

export default definePreview({
  // With CSF 4, Storybook only loads the preview annotations of addons listed here
  addons: [addonDocs(), apiReference(), addonA11y(), themeSwitcher(), rtlDirection()],
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
  },
});
