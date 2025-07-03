import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide scrollbars */
registerStyles(
  'vaadin-scroller',
  css`
    :host([theme~='overflow-indicators'])::-webkit-scrollbar {
      display: none;
    }
  `,
);
