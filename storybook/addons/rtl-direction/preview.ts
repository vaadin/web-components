import type { Decorator } from '@storybook/web-components-vite';
import { definePreviewAddon, type PreviewAddon } from 'storybook/internal/csf';
import { DEFAULT_DIRECTION, DIRECTION_GLOBAL } from './constants.js';

const withDirection: Decorator = (storyFn, { globals, viewMode }) => {
  const direction = viewMode === 'docs' ? 'ltr' : (globals[DIRECTION_GLOBAL] ?? DEFAULT_DIRECTION);
  document.documentElement.setAttribute('dir', direction);
  return storyFn();
};

export default (): PreviewAddon =>
  definePreviewAddon({
    decorators: [withDirection],
    initialGlobals: {
      [DIRECTION_GLOBAL]: DEFAULT_DIRECTION,
    },
  });
