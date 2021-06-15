import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-custom-field/theme/lumo/vaadin-custom-field.js';
import '@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js';
import '@vaadin/vaadin-time-picker/theme/lumo/vaadin-time-picker.js';

registerStyles(
  'vaadin-date-time-picker-date-text-field',
  css`
    [part~='input-field'] {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    /* RTL specific styles */
    :host([dir='rtl']) [part~='input-field'] {
      border-radius: var(--lumo-border-radius-m);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  `,
  { moduleId: 'lumo-date-time-picker-date-text-field' }
);

registerStyles(
  'vaadin-date-time-picker-time-text-field',
  css`
    [part~='input-field'] {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    /* RTL specific styles */
    :host([dir='rtl']) [part~='input-field'] {
      border-radius: var(--lumo-border-radius-m);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  `,
  { moduleId: 'lumo-date-time-picker-time-text-field' }
);

registerStyles(
  'vaadin-date-time-picker-date-picker',
  css`
    :host {
      margin-right: 2px;
    }

    /* RTL specific styles */
    :host([dir='rtl']) {
      margin-right: auto;
      margin-left: 2px;
    }
  `,
  { moduleId: 'lumo-date-time-picker-date-picker' }
);
