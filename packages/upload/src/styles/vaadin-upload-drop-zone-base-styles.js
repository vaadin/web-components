/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadDropZoneStyles = css`
  :host {
    display: block;
  }

  :host([dragover]) {
    --vaadin-upload-background: var(--vaadin-background-container);
    --vaadin-upload-border-color: var(--vaadin-text-color);
    background: var(--vaadin-upload-background, transparent);
    border: var(--vaadin-upload-border-width, 1px) dashed
      var(--vaadin-upload-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-upload-border-radius, var(--vaadin-radius-m));
  }

  :host([hidden]) {
    display: none !important;
  }
`;
