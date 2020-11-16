import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/mixins/field-button.js';

registerStyles(
  'vaadin-date-picker',
  css`
    :host {
      display: inline-flex;
      -webkit-tap-highlight-color: transparent;
    }

    [part='clear-button']::before {
      content: var(--material-icons-clear);
    }

    [part='toggle-button']::before {
      content: var(--material-icons-calendar);
    }
  `,
  { include: ['material-field-button'], moduleId: 'material-date-picker' }
);
