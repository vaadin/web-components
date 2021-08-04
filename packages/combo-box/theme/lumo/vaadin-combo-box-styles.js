/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/text-field/theme/lumo/vaadin-input-field-shared-styles.js';

registerStyles(
  'vaadin-combo-box',
  css`
    [part='toggle-button']::before {
      content: var(--lumo-icons-dropdown);
    }
  `,
  { moduleId: 'lumo-combo-box', include: ['lumo-input-field-shared-styles'] }
);
