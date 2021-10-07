import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-context-menu-overlay',
  css`
    :host(:first-of-type) {
      padding-top: var(--lumo-space-xs);
    }
  `,
  { moduleId: 'lumo-menu-bar-overlay' }
);
