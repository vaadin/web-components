import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar-overlay',
  css`
    :host(:first-of-type) {
      padding-top: var(--lumo-space-xs);
    }
  `,
  { moduleId: 'lumo-menu-bar-overlay' },
);
