/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-column: var(--_master-size);
    --_detail-column: var(--_detail-size);

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: var(--_master-column) var(--_detail-column);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part~='master'],
  [part~='detail'] {
    box-sizing: border-box;
  }

  [part~='backdrop'] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host([expand='both']) {
    --_master-column: minmax(var(--_master-size), 1fr);
    --_detail-column: minmax(var(--_detail-size), 1fr);
  }

  :host([expand='master']) {
    --_master-column: minmax(var(--_master-size), 1fr);
  }

  :host([expand='detail']) {
    --_detail-column: minmax(var(--_detail-size), 1fr);
  }

  :host(:not([has-detail])) {
    --_detail-column: 0;
  }

  :host([overflow]) [part~='detail'] {
    position: absolute;
    z-index: 2;
    inset-block: 0;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
  }

  :host([overflow]) [part~='backdrop'] {
    display: block;
  }

  :host([overflow][detail-overlay-mode^='drawer']) [part~='detail'] {
    width: var(--_detail-size);
    inset-inline-end: 0;
  }

  :host([overflow][detail-overlay-mode^='full']) [part~='detail'] {
    inset-inline: 0;
  }

  :host([overflow][detail-overlay-mode$='viewport']) [part~='detail'],
  :host([overflow][detail-overlay-mode$='viewport']) [part~='backdrop'] {
    position: fixed;
  }
`;
