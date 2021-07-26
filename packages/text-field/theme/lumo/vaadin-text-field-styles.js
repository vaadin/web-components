import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'lumo-text-field',
  include: ['lumo-input-field-shared-styles']
});
