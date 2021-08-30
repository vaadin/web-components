/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/mixins/menu-overlay.js';

registerStyles(
  'vaadin-select-overlay',
  css`
    :host([bottom-aligned]) {
      justify-content: flex-end;
    }

    [part='overlay'] {
      min-width: var(--vaadin-select-text-field-width);
    }
  `,
  { moduleId: 'material-select-overlay-styles', include: ['material-menu-overlay'] }
);
