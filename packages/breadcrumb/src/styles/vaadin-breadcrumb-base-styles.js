/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  nav {
    display: block;
    overflow: hidden;
  }

  [part='list'] {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  /* Overflow button (ellipsis) */
  [part='overflow'] {
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: var(--vaadin-breadcrumb-link-color, var(--vaadin-text-color-link, inherit));
    cursor: var(--vaadin-clickable-cursor, pointer);
    flex-shrink: 0;
  }

  :host([has-overflow]) [part='overflow'] {
    display: inline-flex;
  }

  [part='overflow']::after {
    content: var(--vaadin-breadcrumb-separator-symbol, '/');
    display: inline-block;
    flex-shrink: 0;
    font-family: var(--vaadin-breadcrumb-separator-font-family, inherit);
    font-size: var(--vaadin-breadcrumb-separator-size, var(--vaadin-icon-size, 1lh));
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary));
    padding-inline: var(--vaadin-breadcrumb-separator-gap, var(--vaadin-padding-xs, 6px));
  }

  [part='overflow']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
    border-radius: var(--vaadin-radius-s, 4px);
  }
`;

export const breadcrumbItemStyles = css``;
