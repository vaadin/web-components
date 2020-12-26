import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box-light.js';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field.js';
import '@vaadin/vaadin-material-styles/mixins/field-button.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-time-picker',
  css`
    [part~='toggle-button']::before {
      content: var(--material-icons-clock);
    }
  `,
  { include: ['material-field-button'], moduleId: 'material-time-picker' }
);
