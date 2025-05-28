// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: '/favicon.ico',
      title: 'Vaadin WC API Reference',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/vaadin/web-components' }],
      sidebar: [
        {
          label: 'Elements',
          autogenerate: { directory: 'elements' },
        },
      ],
      components: {
        PageTitle: './src/components/CustomPageTitle.astro',
      },
      customCss: ['./src/theme.css'],
    }),
  ],
});
