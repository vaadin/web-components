import '@vaadin/vaadin-lumo-styles/sizing.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-icon',
  css`
    :host {
      height: var(--lumo-icon-size-m);
      width: var(--lumo-icon-size-m);
    }
  `,
  { moduleId: 'lumo-icon' },
);
