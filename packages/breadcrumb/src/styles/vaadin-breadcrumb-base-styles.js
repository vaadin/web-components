/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    padding: var(--vaadin-breadcrumb-padding, var(--vaadin-padding-m));
    gap: var(--vaadin-breadcrumb-gap, var(--vaadin-gap-s));
    font-family: var(--vaadin-breadcrumb-font-family, inherit);
    font-size: var(--vaadin-breadcrumb-font-size, inherit);
    font-weight: var(--vaadin-breadcrumb-font-weight, 500);
    line-height: var(--vaadin-breadcrumb-line-height, inherit);
    color: var(--vaadin-breadcrumb-text-color, var(--vaadin-text-color));
    background: var(--vaadin-breadcrumb-background, transparent);
    border-radius: var(--vaadin-breadcrumb-border-radius, var(--vaadin-radius-m));
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:is([focus-ring], :focus-visible)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  :host([disabled]) {
    pointer-events: none;
    cursor: var(--vaadin-disabled-cursor);
    opacity: 0.5;
  }
`;
