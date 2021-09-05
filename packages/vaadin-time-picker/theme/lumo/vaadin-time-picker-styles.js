import '@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--lumo-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [fieldButton, timePicker], { moduleId: 'lumo-time-picker' });
