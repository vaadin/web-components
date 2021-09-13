import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

const datePicker = css`
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
`;

registerStyles('vaadin-date-picker', [inputFieldShared, datePicker], { moduleId: 'material-date-picker' });
