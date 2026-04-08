/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-gap-xs, 0.25em));
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;
