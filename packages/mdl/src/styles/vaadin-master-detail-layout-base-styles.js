/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-column: var(--_master-size) 0;
    --_detail-column: var(--_detail-size) 0;

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
  }

  :host([hidden]) {
    display: none !important;
  }

  [part~='master'],
  [part~='detail'] {
    box-sizing: border-box;
  }

  [part~='master'] {
    grid-column: master-start / detail-start;
  }

  [part~='detail'] {
    grid-column: detail-start / detail-end;
  }

  [part~='backdrop'] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host([expand='both']),
  :host([expand='master']) {
    --_master-column: var(--_master-size) 1fr;
  }

  :host([expand='both']:is(:not([has-detail]), [preserve-master-width])),
  :host([expand='master']:is(:not([has-detail]), [preserve-master-width])) {
    --_master-column: var(--_master-size) calc(100% - var(--_master-size));
  }

  :host([expand='both']),
  :host([expand='detail']) {
    --_detail-column: var(--_detail-size) 1fr;
  }

  :host([has-detail][overflow]) [part~='detail'] {
    position: absolute;
    z-index: 2;
    inset-block: 0;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
    grid-column: none;
  }

  :host([has-detail][overflow]) [part~='backdrop'] {
    display: block;
  }

  :host([has-detail][overflow][detail-overlay-mode^='drawer']) [part~='detail'] {
    width: var(--_detail-size);
    inset-inline-end: 0;
  }

  :host([has-detail][overflow][detail-overlay-mode^='full']) [part~='detail'] {
    inset-inline: 0;
  }

  :host([has-detail][overflow][detail-overlay-mode$='viewport']) [part~='detail'],
  :host([has-detail][overflow][detail-overlay-mode$='viewport']) [part~='backdrop'] {
    position: fixed;
  }
`;
