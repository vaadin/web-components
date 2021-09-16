/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-date-picker-overlay',
  css`
    :host {
      align-items: flex-start;
      justify-content: flex-start;
    }

    [part='overlay'] {
      display: flex;
      flex: auto;
    }

    [part~='content'] {
      flex: auto;
    }
  `,
  { moduleId: 'vaadin-date-picker-overlay-styles' }
);
