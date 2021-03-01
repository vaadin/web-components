import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-button/theme/lumo/vaadin-button-styles.js';
import '@vaadin/vaadin-text-field/theme/lumo/vaadin-text-area-styles.js';
import '@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field-styles.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: var(--lumo-space-s) var(--lumo-space-m);
    }

    vaadin-text-area {
      margin: 0 var(--lumo-space-s) 0 0;
    }

    :host([dir='rtl']) vaadin-text-area {
      margin: 0 0 0 var(--lumo-space-s);
    }
  `,
  { moduleId: 'lumo-message-input' }
);
