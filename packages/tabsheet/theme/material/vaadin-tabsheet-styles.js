import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tabsheet = css`
  /* Needed to align the tabs nicely on the baseline */
  :host(:not([orientation='vertical'])) ::slotted([slot='tabs'])::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
  }

  [part='tabs-container'] {
    border-bottom: 1px solid var(--material-divider-color);
  }

  [part='content'] {
    font-family: var(--material-font-family);
  }
`;

registerStyles('vaadin-tabsheet', tabsheet, { moduleId: 'material-tabsheet' });
