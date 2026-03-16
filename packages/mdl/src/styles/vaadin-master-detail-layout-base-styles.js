/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-size: 400px;
    --_detail-size: min-content;
    --_master-max-size: var(--_master-size);
    --_detail-max-size: var(--_detail-size);
    --_master-col: minmax(var(--_master-size), var(--_master-max-size));
    --_detail-col: minmax(var(--_detail-size), var(--_detail-max-size));

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: var(--_master-col) var(--_detail-col);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([expand='both']) {
    --_master-max-size: 1fr;
    --_detail-max-size: 1fr;
  }

  :host([expand='master']) {
    --_master-max-size: 1fr;
  }

  :host([expand='detail']) {
    --_detail-max-size: 1fr;
  }

  [part~='backdrop'] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  [part~='master'],
  [part~='detail'] {
    box-sizing: border-box;
  }

  /* Shared overlay styles (drawer + full) */

  :host([overflow]) [part~='detail'] {
    z-index: 2;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
  }

  :host([overflow]) [part~='backdrop'] {
    display: block;
  }

  /* Drawer mode (default): sticky side-panel */

  :host([overflow][detail-overlay-mode='drawer']) [part~='detail'] {
    position: sticky;
    inset-block: 0;
    inset-inline-end: 0;
    width: min(100%, var(--_detail-size));
  }

  /* Full mode: detail covers the entire layout */

  :host([overflow][detail-overlay-mode='full']) [part~='detail'] {
    margin-inline-start: calc(-1 * var(--_master-col-width, 0px));
    width: var(--_host-width, 100%);
    height: 100%;
  }

  :host(:not([has-detail])) {
    --_detail-col: '';
  }

  :host(:not([has-detail])) [part~='detail'] {
    display: none;
  }
`;
