import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js';

registerStyles(
  'vaadin-combo-box',
  css`
    :host {
      outline: none;
    }

    [part='toggle-button']::before {
      content: var(--lumo-icons-dropdown);
    }
  `,
  { moduleId: 'lumo-combo-box', include: ['lumo-field-button'] }
);
