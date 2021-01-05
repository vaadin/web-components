/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { contentStyles } from './vaadin-rich-text-editor-content-styles.js';
import { toolbarStyles } from './vaadin-rich-text-editor-toolbar-styles.js';

registerStyles(
  '',
  css`
    ${contentStyles}
    ${toolbarStyles}

    :host([readonly]) [part='toolbar'] {
      display: none;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }

    :host([disabled]) [part~='toolbar-button'] {
      background-color: transparent;
    }
  `,
  { moduleId: 'vaadin-rich-text-editor-styles' }
);
