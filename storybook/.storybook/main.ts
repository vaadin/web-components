import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  framework: {
    name: '@storybook/web-components-vite',
    options: {
      customElementsManifest: '../../custom-elements.json',
    },
  },
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '../addons/theme-switcher/preset.ts',
    '../addons/rtl-direction/preset.ts',
    '../addons/api-reference/preset.ts',
  ],
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  features: {
    sidebarOnboardingChecklist: false,
  },
  viteFinal: (config) => ({
    ...config,
    build: {
      ...config.build,
      // Lightning CSS lowers light-dark() for older targets. Aura sets no color-scheme, so its colors break.
      cssTarget: 'esnext',
    },
  }),
});
