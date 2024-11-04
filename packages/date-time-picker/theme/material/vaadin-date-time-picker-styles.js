import { customField } from '@vaadin/custom-field/theme/material/vaadin-custom-field-styles.js';
import { helper } from '@vaadin/vaadin-material-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-date-time-picker', [requiredField, helper, customField], {
  moduleId: 'material-date-time-picker',
});
