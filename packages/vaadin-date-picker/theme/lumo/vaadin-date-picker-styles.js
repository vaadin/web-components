import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/mixins/field-button.js';

registerStyles(
  'vaadin-date-picker',
  css`
    :host {
      outline: none;
    }

    [part='toggle-button']::before {
      content: var(--lumo-icons-calendar);
    }

    [part='clear-button']::before {
      content: var(--lumo-icons-cross);
    }

    @media (max-width: 420px), (max-height: 420px) {
      [part='overlay-content'] {
        height: 70vh;
      }
    }
  `,
  { include: ['lumo-field-button'], moduleId: 'lumo-date-picker' }
);
