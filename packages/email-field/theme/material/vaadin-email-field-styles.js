/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { inputFieldShared } from '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

registerStyles('vaadin-email-field', inputFieldShared, {
  moduleId: 'material-email-field'
});
