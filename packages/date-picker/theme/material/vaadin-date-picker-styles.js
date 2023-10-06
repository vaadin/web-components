import '@vaadin/input-container/theme/material/vaadin-input-container-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
