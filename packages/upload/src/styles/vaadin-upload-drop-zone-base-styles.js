/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadDropZoneStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([dragover]) {
    background: var(--vaadin-upload-background, var(--vaadin-background-container));
    border: var(--vaadin-upload-border-width, 1px) dashed var(--vaadin-upload-border-color, var(--vaadin-text-color));
  }
`;
