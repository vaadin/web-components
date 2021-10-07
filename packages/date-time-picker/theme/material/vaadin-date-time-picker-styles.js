import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { customField } from '@vaadin/custom-field/theme/material/vaadin-custom-field-styles.js';
import '@vaadin/date-picker/theme/material/vaadin-date-picker.js';
import '@vaadin/time-picker/theme/material/vaadin-time-picker.js';

registerStyles('vaadin-date-time-picker', [requiredField, customField], {
  moduleId: 'material-date-time-picker'
});
