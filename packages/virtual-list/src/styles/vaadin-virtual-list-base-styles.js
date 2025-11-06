/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const virtualListStyles = css`
  :host {
    /* Don't let these properties inherit */
    --vaadin-virtual-list-padding-block: 0px;
    --vaadin-virtual-list-padding-inline: 0px;
    --vaadin-virtual-list-overflow-indicator-top-opacity: 0;
    --vaadin-virtual-list-overflow-indicator-bottom-opacity: 0;
    display: block;
    height: 400px;
    overflow: auto;
    flex: 1;
    align-self: stretch;
    box-sizing: border-box;
    padding: 0;
    --_indicator-height: var(--vaadin-virtual-list-overflow-indicator-height, 1px);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([grid])) #items > ::slotted(*) {
    inset-inline: var(--vaadin-virtual-list-padding-inline);
  }

  #items {
    position: relative;
  }

  :host::before,
  :host::after {
    content: '';
    display: block;
    opacity: 0;
    position: sticky;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    box-sizing: border-box;
    height: var(--_indicator-height);
    background: var(--vaadin-border-color-secondary);
  }

  :host::before {
    margin-bottom: calc(var(--vaadin-virtual-list-padding-block) - var(--_indicator-height));
  }

  :host::after {
    margin-top: calc(var(--vaadin-virtual-list-padding-block) - var(--_indicator-height));
  }

  :host([overflow~='top'])::before {
    opacity: var(--vaadin-virtual-list-overflow-indicator-top-opacity);
  }

  :host([overflow~='bottom'])::after {
    opacity: var(--vaadin-virtual-list-overflow-indicator-bottom-opacity);
  }

  :host([theme~='overflow-indicator-top'][overflow~='top']),
  :host([theme~='overflow-indicators'][overflow~='top']) {
    --vaadin-virtual-list-overflow-indicator-top-opacity: 1;
  }

  :host([theme~='overflow-indicators'][overflow~='bottom']),
  :host([theme~='overflow-indicator-bottom'][overflow~='bottom']) {
    --vaadin-virtual-list-overflow-indicator-bottom-opacity: 1;
  }
`;
