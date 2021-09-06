import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js';

const comboBox = css`
  :host {
    outline: none;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;

registerStyles('vaadin-combo-box', [fieldButton, comboBox], { moduleId: 'lumo-combo-box' });
