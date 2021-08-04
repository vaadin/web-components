/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/text-field/theme/material/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-combo-box',
  css`
    [part='toggle-button']::before {
      content: var(--material-icons-dropdown);
    }

    :host([opened]) [part='toggle-button'] {
      transform: rotate(180deg);
    }
  `,
  { moduleId: 'material-combo-box', include: ['material-input-field-shared-styles'] }
);
