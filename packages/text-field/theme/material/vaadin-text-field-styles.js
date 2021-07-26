import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'material-text-field',
  include: ['material-input-field-shared-styles']
});
