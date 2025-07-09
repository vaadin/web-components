/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const virtualListStyles = css`
  :host {
    display: block;
    height: 400px;
    overflow: auto;
    flex: auto;
    align-self: stretch;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([grid])) #items > ::slotted(*) {
    width: 100%;
  }

  #items {
    position: relative;
  }

  :host([theme~='overflow-indicators'])::before,
  :host([theme~='overflow-indicators'])::after {
    content: '';
    display: none;
    position: sticky;
    inset: 0;
    z-index: 9999;
    height: 1px;
    margin-bottom: -1px;
    background: var(--vaadin-virtual-list-border-color, var(--vaadin-border-color));
  }

  :host([theme~='overflow-indicators'])::after {
    margin-bottom: 0;
    margin-top: -1px;
  }

  :host([theme~='overflow-indicators'][overflow~='top'])::before,
  :host([theme~='overflow-indicators'][overflow~='bottom'])::after {
    display: block;
  }
`;
