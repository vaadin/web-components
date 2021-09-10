import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/text-field/theme/lumo/vaadin-input-field-shared-styles.js';

const comboBox = css`
  :host {
    outline: none;
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;

registerStyles('vaadin-combo-box', [inputFieldShared, comboBox], { moduleId: 'lumo-combo-box' });
