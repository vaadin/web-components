import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box-light.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--material-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [fieldButton, timePicker], {
  moduleId: 'material-time-picker'
});
