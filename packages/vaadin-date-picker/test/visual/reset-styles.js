import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-month-calendar',
  css`
    :host(:not([focused])) [part='date'][focused]::before {
      animation: none !important;
    }
  `,
  { moduleId: 'month-calendar-test-styles' }
);
