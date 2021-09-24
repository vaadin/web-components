/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';

registerStyles('vaadin-text-field', inputFieldShared, {
  moduleId: 'material-text-field-styles'
});
