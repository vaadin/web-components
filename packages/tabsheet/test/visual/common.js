import '@vaadin/tabs/test/visual/not-animated-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Stop loader animation */
registerStyles(
  'vaadin-tabsheet',
  css`
    :host([loading]) [part='loader'] {
      animation: none;
      opacity: 1;
    }
  `,
);
