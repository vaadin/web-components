/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-size: 30em;
    --_detail-size: 15em;
    --_master-column: var(--_master-size) 0;
    --_detail-column: var(--_detail-size) 0;

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
    grid-template-rows: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    grid-template-columns: 100%;
    grid-template-rows: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
  }

  [part~='master'],
  [part~='detail'] {
    box-sizing: border-box;
  }

  ::slotted(*) {
    height: 100%;
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
    --_master-column: var(--_master-size) 1fr;
  }

  :host([expand='both']:is(:not([has-detail]), [preserve-master-width])),
  :host([expand='master']:is(:not([has-detail]), [preserve-master-width])),
  :host([expand='detail']:not([has-detail])) {
    --_master-column: var(--_master-size) calc(100% - var(--_master-size));
  }

  :host([expand='both']),
  :host([expand='detail']) {
    --_detail-column: var(--_detail-size) 1fr;
  }

  :host([orientation='horizontal'][has-detail]:not([overflow])) [part~='detail'] {
    border-inline-start: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical'][has-detail]:not([overflow])) [part~='detail'] {
    border-top: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

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

  :host([overflow]:not([orientation='vertical'])) [part~='detail'] {
    inset-block: 0;
    width: var(--_overlay-size, var(--_detail-size, min-content));
    inset-inline-end: 0;
  }

  :host([overflow][orientation='vertical']) [part~='detail'] {
    grid-column: auto;
    grid-row: none;
    inset-inline: 0;
    height: var(--_overlay-size, var(--_detail-size, min-content));
    inset-block-end: 0;
  }

  :host([overflow][overlay-containment='viewport']) [part~='detail'],
  :host([overflow][overlay-containment='viewport']) [part~='backdrop'] {
    position: fixed;
  }

  @media (forced-colors: active) {
    :host([overflow]) [part~='detail'] {
      outline: 3px solid !important;
    }

    [part~='detail'] {
      background: Canvas !important;
    }
  }
`;
