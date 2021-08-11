/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import './vaadin-input-field-shared-styles.js';

registerStyles('vaadin-text-field', css``, {
  moduleId: 'lumo-text-field-styles',
  include: ['lumo-input-field-shared-styles']
});
