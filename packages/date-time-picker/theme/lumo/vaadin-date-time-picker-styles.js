import '@vaadin/date-picker/theme/lumo/vaadin-date-picker.js';
import '@vaadin/time-picker/theme/lumo/vaadin-time-picker.js';
import { customField } from '@vaadin/custom-field/theme/lumo/vaadin-custom-field-styles.js';
import { helper } from '@vaadin/vaadin-lumo-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-lumo-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const dateTimePicker = css`
  ::slotted([slot='date-picker']) {
    margin-inline-end: 2px;
    --vaadin-input-container-top-end-radius: 0;
    --vaadin-input-container-bottom-end-radius: 0;
  }

  ::slotted([slot='time-picker']) {
    --vaadin-input-container-top-start-radius: 0;
    --vaadin-input-container-bottom-start-radius: 0;
  }
`;

registerStyles('vaadin-date-time-picker', [dateTimePicker, requiredField, helper, customField], {
  moduleId: 'lumo-date-time-picker',
});
