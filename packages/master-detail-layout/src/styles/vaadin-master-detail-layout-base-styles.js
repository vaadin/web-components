/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-column: var(--_master-size, 1fr) 0;
    --_detail-column: var(--_detail-size, 1fr) 0;

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
    grid-template-rows: 100%;
  }

  :host([orientation='vertical']) {
    grid-template-columns: 100%;
    grid-template-rows: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
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

  :host([orientation='vertical']) [part~='master'] {
    grid-column: auto;
    grid-row: master-start / detail-start;
  }

  :host([orientation='vertical']) [part~='detail'] {
    grid-column: auto;
    grid-row: detail-start / detail-end;
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
    --_master-column: var(--_master-size, 0) 1fr;
  }

  :host([expand='both'][has-master-size]:is(:not([has-detail]), [preserve-master-width])),
  :host([expand='master'][has-master-size]:is(:not([has-detail]), [preserve-master-width])) {
    --_master-column: var(--_master-size, 0) calc(100% - var(--_master-size, 0));
  }

  :host([expand='both']),
  :host([expand='detail']) {
    --_detail-column: var(--_detail-size, 0) 1fr;
  }

  /* Split mode borders */

  :host([orientation='horizontal'][has-detail]:not([overflow])) [part~='detail'] {
    border-inline-start: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical'][has-detail]:not([overflow])) [part~='detail'] {
    border-top: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  /* Shared overlay styles */

  :host([overflow]) [part~='detail'] {
    position: absolute;
    z-index: 2;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
    grid-column: none;
  }

  :host([overflow]) [part~='backdrop'] {
    display: block;
  }

  /* Horizontal overlay (default) */

  :host([overflow]:not([orientation='vertical'])) [part~='detail'] {
    inset-block: 0;
  }

  :host([overflow]:not([orientation='vertical'])[detail-overlay-mode^='drawer']) [part~='detail'] {
    width: var(--_detail-size, min-content);
    inset-inline-end: 0;
  }

  :host([overflow]:not([orientation='vertical'])[detail-overlay-mode^='full']) [part~='detail'] {
    inset-inline: 0;
  }

  /* Vertical overlay */

  :host([overflow][orientation='vertical']) [part~='detail'] {
    grid-column: auto;
    grid-row: none;
    inset-inline: 0;
  }

  :host([overflow][orientation='vertical'][detail-overlay-mode^='drawer']) [part~='detail'] {
    height: var(--_detail-size, min-content);
    inset-block-end: 0;
  }

  :host([overflow][orientation='vertical'][detail-overlay-mode^='full']) [part~='detail'] {
    inset-block: 0;
  }

  /* Viewport containment (both orientations) */

  :host([overflow][detail-overlay-mode$='viewport']) [part~='detail'],
  :host([overflow][detail-overlay-mode$='viewport']) [part~='backdrop'] {
    position: fixed;
  }

  /* Forced colors */

  @media (forced-colors: active) {
    :host([overflow]) [part~='detail'] {
      outline: 3px solid !important;
    }

    [part~='detail'] {
      background: Canvas !important;
    }
  }
`;
