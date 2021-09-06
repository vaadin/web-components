import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';

const comboBox = css`
  :host {
    display: inline-flex;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  [part='toggle-button']::before {
    content: var(--material-icons-dropdown);
  }

  :host([opened]) [part='toggle-button'] {
    transform: rotate(180deg);
  }
`;

registerStyles('vaadin-combo-box', [fieldButton, comboBox], { moduleId: 'material-combo-box' });
