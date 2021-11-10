import '@vaadin/date-picker/theme/lumo/vaadin-date-picker.js';
import '@vaadin/time-picker/theme/lumo/vaadin-time-picker.js';
import { customField } from '@vaadin/custom-field/theme/lumo/vaadin-custom-field-styles.js';
import { helper } from '@vaadin/vaadin-lumo-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-lumo-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-date-time-picker', [requiredField, helper, customField], {
  moduleId: 'lumo-date-time-picker'
});

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
  { moduleId: 'lumo-date-time-picker-date-picker' }
);

registerStyles(
  'vaadin-date-time-picker-time-picker',
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
  { moduleId: 'lumo-date-time-picker-time-picker' }
);
