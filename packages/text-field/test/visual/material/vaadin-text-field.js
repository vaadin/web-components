// TODO: remove this file in https://github.com/vaadin/web-components/issues/2220
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/material/vaadin-text-field.js';
import { inputFieldShared } from '../../../theme/material/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', inputFieldShared, {
  moduleId: 'material-text-field-styles'
});
