import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide scrollbars */
registerStyles(
  'vaadin-scroller',
  css`
    :host([theme*='overflow-indicator'])::-webkit-scrollbar {
      display: none;
    }
  `,
);
