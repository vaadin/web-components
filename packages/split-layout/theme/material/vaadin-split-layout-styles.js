import '@vaadin/vaadin-material-styles/color.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-split-layout',
  css`
    [part='splitter'] {
      background-color: var(--_material-split-layout-splitter-background-color, #000);
      min-height: 8px;
      min-width: 8px;
    }

    [part='handle'] {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    [part='handle']::after {
      background-color: var(--material-background-color);
      content: '';
      display: block;
      height: 24px;
      width: 2px;
    }

    :host([orientation='vertical']) [part='handle']::after {
      transform: rotate(90deg);
    }
  `,
  { moduleId: 'material-split-layout' },
);
