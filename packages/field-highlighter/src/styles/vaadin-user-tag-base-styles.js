/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import '@vaadin/component-base/src/styles/user-colors.js';
import { css } from 'lit';

export const userTagStyles = css`
  :host {
    display: inline-block;
    box-sizing: border-box;
    opacity: 0;
    padding: var(--vaadin-user-tag-padding, 0.3em);
    background-color: var(--vaadin-user-tag-color);
    color: oklch(from var(--vaadin-user-tag-color) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    font-size: var(--vaadin-user-tag-font-size, 0.75em);
    font-weight: var(--vaadin-user-tag-font-weight, 500);
    line-height: var(--vaadin-user-tag-line-height, 1);
    border: var(--vaadin-user-tag-border-width, 0) solid
      var(--vaadin-user-tag-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-user-tag-border-radius, var(--vaadin-radius-m));
    cursor: default;
  }

  :host(.show) {
    opacity: 1;
  }

  [part='name'] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
