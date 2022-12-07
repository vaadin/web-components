import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const details = css`
  :host {
    font-family: var(--material-font-family);
    box-shadow: var(--material-shadow-elevation-2dp);
    outline: none;
  }

  :host([focus-ring]) ::slotted([slot='summary']) {
    background-color: var(--material-secondary-background-color);
  }

  [part='content'] {
    padding: 8px 24px 24px;
  }
`;

registerStyles('vaadin-details', details, { moduleId: 'material-details' });

export { details };
