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
    color: var(--vaadin-text-color-secondary);
  }

  :host([dragover]) {
    background: var(--vaadin-background-container);
  }

  :host([hidden]) {
    display: none !important;
  }
`;
