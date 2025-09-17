/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const listBoxStyles = css`
  :host {
    --vaadin-item-checkmark-display: block;
    display: flex;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='items'] {
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }

  [part='items'] ::slotted(hr) {
    border-color: var(--vaadin-divider-color, var(--vaadin-border-color-secondary));
    border-width: 0 0 1px;
    margin: 4px 8px;
    margin-inline-start: calc(var(--vaadin-icon-size, 1lh) + var(--vaadin-item-gap, var(--vaadin-gap-s)) + 8px);
  }
`;
