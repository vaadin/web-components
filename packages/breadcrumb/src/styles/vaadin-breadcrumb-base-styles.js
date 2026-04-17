/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    overflow-x: clip;
    position: relative;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--vaadin-breadcrumb-gap, 0.25em);
  }

  li {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: var(--vaadin-breadcrumb-gap, 0.25em);
  }

  li[hidden] {
    display: none !important;
  }

  li[collapsed] {
    visibility: hidden;
    position: absolute;
    width: 0;
    overflow: hidden;
  }

  li[data-overflow] {
    display: none;
    align-items: center;
  }

  :host([overflow]) li[data-overflow] {
    display: flex;
  }

  [part='overflow-button'] {
    cursor: var(--vaadin-clickable-cursor);
    background: none;
    border: none;
    padding: 0.25em 0.5em;
    font: inherit;
    color: var(--vaadin-breadcrumb-item-text-color, var(--vaadin-text-color-secondary));
    line-height: 1;
  }

  [part='overflow-button']:hover {
    color: var(--vaadin-breadcrumb-item-hover-text-color, var(--vaadin-text-color));
  }

  [part='overflow-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 2px;
    border-radius: var(--vaadin-radius-s, 2px);
  }

  li.current-truncated ::slotted(vaadin-breadcrumb-item) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    max-width: 100%;
    display: block;
  }

  [part='separator'],
  [part='overflow-separator'] {
    user-select: none;
    flex-shrink: 0;
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary));
  }

  :host([dir='rtl']) [part='separator'][default-separator],
  :host([dir='rtl']) [part='overflow-separator'][default-separator] {
    transform: scaleX(-1);
  }

  [part='overflow-dropdown'] {
    position: fixed;
    z-index: 1000;
    background: var(--vaadin-background-color, #fff);
    border: 1px solid var(--vaadin-border-color-secondary, #ccc);
    border-radius: var(--vaadin-radius-m, 4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0.25em 0;
    list-style: none;
    margin: 0;
  }

  [part='overflow-dropdown'] a {
    display: block;
    padding: 0.5em 1em;
    text-decoration: none;
    color: var(--vaadin-breadcrumb-item-text-color, var(--vaadin-text-color-secondary));
    white-space: nowrap;
    cursor: var(--vaadin-clickable-cursor);
  }

  [part='overflow-dropdown'] a:hover {
    color: var(--vaadin-breadcrumb-item-hover-text-color, var(--vaadin-text-color));
    background: var(--vaadin-background-container, #f0f0f0);
  }

  @media (forced-colors: active) {
    [part='separator'],
    [part='overflow-separator'] {
      color: GrayText !important;
    }

    [part='overflow-button'] {
      color: LinkText !important;
    }

    [part='overflow-dropdown'] {
      border-color: ButtonBorder !important;
    }

    [part='overflow-dropdown'] a {
      color: LinkText !important;
    }

    [part='overflow-dropdown'] a:hover {
      color: ActiveText !important;
      background: Highlight !important;
    }
  }
`;
