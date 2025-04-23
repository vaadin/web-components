/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const clearButton = css`
  [part='clear-button'] {
    display: none;
    color: var(--_vaadin-color-subtle);
  }

  [part='clear-button']::before {
    background: currentColor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-cross);
    width: var(--vaadin-icon-size, 1lh);
  }

  :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
    display: block;
  }

  @media (forced-colors: active) {
    [part='clear-button']::before {
      background: CanvasText;
    }
  }
`;
