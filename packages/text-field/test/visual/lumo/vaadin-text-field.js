// TODO: remove this file in https://github.com/vaadin/web-components/issues/2220
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/lumo/vaadin-text-field.js';
import { inputFieldShared } from '../../../theme/lumo/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', inputFieldShared, {
  moduleId: 'lumo-text-field-styles'
});
