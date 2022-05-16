import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: var(--lumo-space-s) var(--lumo-space-m);
    }
  `,
  { moduleId: 'lumo-message-input' },
);
