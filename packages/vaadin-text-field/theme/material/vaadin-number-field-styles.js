import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/mixins/field-button.js';

registerStyles(
  'vaadin-number-field',
  css`
    :host {
      width: 8em;
    }

    :host([has-controls]) [part='value'] {
      text-align: center;
    }

    [part\$='button'][disabled] {
      opacity: 0.2;
    }

    [part\$='decrease-button'] {
      cursor: pointer;
      font-size: var(--material-body-font-size);
      padding-bottom: 0.21em;
    }
  `,
  { moduleId: 'material-number-field', include: ['material-field-button'] }
);
