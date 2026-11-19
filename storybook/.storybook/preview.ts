import { type Preview, setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from './custom-elements.js';

// Autodocs and controls use CEM
setCustomElementsManifest(customElements);

export default {
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
  },
} satisfies Preview;
