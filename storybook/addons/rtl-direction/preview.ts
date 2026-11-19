import type { Decorator, Preview } from '@storybook/web-components-vite';
import { DEFAULT_DIRECTION, DIRECTION_GLOBAL } from './constants.js';

const withDirection: Decorator = (storyFn, { globals, viewMode }) => {
  const direction = viewMode === 'docs' ? 'ltr' : (globals[DIRECTION_GLOBAL] ?? DEFAULT_DIRECTION);
  document.documentElement.setAttribute('dir', direction);
  return storyFn();
};

export default {
  decorators: [withDirection],
  initialGlobals: {
    [DIRECTION_GLOBAL]: DEFAULT_DIRECTION,
  },
} satisfies Preview;
