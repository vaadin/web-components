import type { StorybookConfig } from '@storybook/web-components-vite';

export default {
  framework: '@storybook/web-components-vite',
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '../addons/theme-switcher/preset.ts',
    '../addons/rtl-direction/preset.ts',
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
} satisfies StorybookConfig;
