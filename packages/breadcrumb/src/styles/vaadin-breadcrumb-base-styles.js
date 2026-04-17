/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    overflow: hidden;
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
  }

  li {
    display: flex;
    align-items: center;
    min-width: 0;
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
    cursor: pointer;
    background: none;
    border: none;
    padding: 0.25em 0.5em;
    font: inherit;
    color: inherit;
    line-height: 1;
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
  }

  :host([dir='rtl']) [part='separator'][default-separator],
  :host([dir='rtl']) [part='overflow-separator'][default-separator] {
    transform: scaleX(-1);
  }

  [part='overflow-dropdown'] {
    position: absolute;
    z-index: 1000;
    background: var(--lumo-base-color, #fff);
    border: 1px solid var(--lumo-contrast-20pct, #ccc);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0.25em 0;
    list-style: none;
    margin: 0;
  }

  [part='overflow-dropdown'] a {
    display: block;
    padding: 0.5em 1em;
    text-decoration: none;
    color: inherit;
    white-space: nowrap;
    cursor: pointer;
  }

  [part='overflow-dropdown'] a:hover {
    background: var(--lumo-contrast-5pct, #f0f0f0);
  }
`;
