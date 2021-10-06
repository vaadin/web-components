import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import '@vaadin/vaadin-custom-field/theme/material/vaadin-custom-field.js';
import '@vaadin/date-picker/theme/material/vaadin-date-picker.js';
import '@vaadin/time-picker/theme/material/vaadin-time-picker.js';

registerStyles('vaadin-date-time-picker', [inputFieldShared], { moduleId: 'material-date-time-picker' });
