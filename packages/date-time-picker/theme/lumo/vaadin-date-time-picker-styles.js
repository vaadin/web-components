import '@vaadin/date-picker/theme/lumo/vaadin-date-picker.js';
import '@vaadin/time-picker/theme/lumo/vaadin-time-picker.js';
import { customField } from '@vaadin/custom-field/theme/lumo/vaadin-custom-field-styles.js';
import { helper } from '@vaadin/vaadin-lumo-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-lumo-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-date-time-picker', [requiredField, helper, customField], {
  moduleId: 'lumo-date-time-picker',
});

registerStyles(
  'vaadin-date-time-picker-date-picker',
  css`
    :host {
      margin-right: 2px;
      --vaadin-input-container-top-end-radius: 0;
      --vaadin-input-container-bottom-end-radius: 0;
    }

    /* RTL specific styles */
    :host([dir='rtl']) {
      margin-right: auto;
      margin-left: 2px;
    }
  `,
  { moduleId: 'lumo-date-time-picker-date-picker' },
);

registerStyles(
  'vaadin-date-time-picker-time-picker',
  css`
    :host {
      --vaadin-input-container-top-start-radius: 0;
      --vaadin-input-container-bottom-start-radius: 0;
    }
  `,
  { moduleId: 'lumo-date-time-picker-time-picker' },
);
