import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-dashboard-widget, vaadin-dashboard-section',
  css`
    :host,
    [part='content'],
    [part$='-button'] {
      transition: none !important;
    }
  `,
);
