/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    text-decoration: var(--vaadin-breadcrumb-link-text-decoration, none);
    color: var(--vaadin-breadcrumb-link-color, var(--vaadin-secondary-text-color));
    transition: color 0.2s;
    outline: none;
    cursor: var(--vaadin-clickable-cursor);
  }

  a[part='link']:hover {
    text-decoration: var(--vaadin-breadcrumb-link-hover-text-decoration, underline);
    color: var(--vaadin-breadcrumb-link-hover-color, var(--vaadin-primary-text-color));
  }

  a[part='link']:focus-visible {
    border-radius: var(--vaadin-radius-s);
    box-shadow: 0 0 0 2px var(--vaadin-focus-ring-color);
  }

  span[part='link'] {
    color: var(--vaadin-breadcrumb-current-color, var(--vaadin-primary-text-color));
    cursor: default;
  }

  :host([disabled]) [part='link'] {
    color: var(--vaadin-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  :host([last]) [part='link'] {
    color: var(--vaadin-breadcrumb-current-color, var(--vaadin-primary-text-color));
    font-weight: var(--vaadin-breadcrumb-current-font-weight, 500);
  }

  [part='separator'] {
    display: inline-flex;
    align-items: center;
    margin: 0 var(--vaadin-breadcrumb-separator-spacing, var(--vaadin-space-xs));
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-tertiary-text-color));
  }

  [part='separator']::after {
    content: var(--vaadin-breadcrumb-separator, var(--lumo-icons-angle-right));
    font-family: var(--vaadin-breadcrumb-separator-font-family, 'lumo-icons');
    font-size: var(--vaadin-breadcrumb-separator-size, var(--vaadin-icon-size-s));
  }
`;
