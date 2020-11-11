import '@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-time-picker',
  css`
    [part~='toggle-button']::before {
      content: var(--lumo-icons-clock);
    }
  `,
  { include: ['lumo-field-button'], moduleId: 'lumo-time-picker' }
);
