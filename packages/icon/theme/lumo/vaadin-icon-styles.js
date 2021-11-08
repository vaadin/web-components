import '@vaadin/vaadin-lumo-styles/sizing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-icon',
  css`
    :host {
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }
  `,
  { moduleId: 'lumo-icon' }
);
