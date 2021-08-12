/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-email-field', css``, {
  moduleId: 'material-email-field',
  include: ['material-input-field-shared-styles']
});
