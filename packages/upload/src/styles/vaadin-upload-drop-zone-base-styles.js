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
    position: relative;
  }

  :host([dragover])::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--vaadin-background-container);
    opacity: 0.7;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
