// TODO: remove this file in https://github.com/vaadin/web-components/issues/2220
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/material/vaadin-text-field.js';
import '../../../theme/material/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'material-text-field-styles',
  include: ['material-input-field-shared-styles']
});
