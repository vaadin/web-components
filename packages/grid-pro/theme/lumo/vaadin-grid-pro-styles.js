import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  `,
  { moduleId: 'lumo-grid-pro' }
);
