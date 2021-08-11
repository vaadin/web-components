import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/material/vaadin-text-field.js';
import '../../../theme/material/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'material-text-field-styles',
  include: ['material-input-field-shared-styles']
});
