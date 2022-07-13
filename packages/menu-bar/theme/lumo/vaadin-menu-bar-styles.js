import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-menu-bar',
  css`
    :host([has-single-button]) [part$='button'] {
      border-radius: var(--lumo-border-radius-m);
    }
  `,
  { moduleId: 'lumo-menu-bar' },
);
