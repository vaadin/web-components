/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// TODO: Remove this file in https://github.com/vaadin/web-components/issues/2224.
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../../../theme/lumo/vaadin-button-styles.js';

registerStyles('vaadin-button', css``, {
  moduleId: 'lumo-button',
  include: ['lumo-button-styles']
});
