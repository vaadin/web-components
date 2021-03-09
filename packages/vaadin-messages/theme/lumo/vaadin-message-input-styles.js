import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import './vaadin-message-input-text-area-styles.js';
import '@vaadin/vaadin-button/theme/lumo/vaadin-button-styles.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: var(--lumo-space-s) var(--lumo-space-m);
    }
  `,
  { moduleId: 'lumo-message-input' }
);
