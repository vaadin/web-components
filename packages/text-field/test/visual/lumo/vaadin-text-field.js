// TODO: remove this file in https://github.com/vaadin/web-components/issues/2220
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/lumo/vaadin-text-field.js';
import '../../../theme/lumo/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'lumo-text-field-styles',
  include: ['lumo-input-field-shared-styles']
});
