// TODO: remove this file in https://github.com/vaadin/web-components/issues/2220
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/material/vaadin-text-field.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';

registerStyles('vaadin-text-field', inputFieldShared, {
  moduleId: 'material-text-field-styles'
});
