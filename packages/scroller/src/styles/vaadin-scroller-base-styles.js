/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const scrollerStyles = css`
  @layer base {
    :host {
      display: block;
      overflow: auto;
      outline: none;
    }

    :host([focus-ring]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([scroll-direction='vertical']) {
      overflow-x: hidden;
    }

    :host([scroll-direction='horizontal']) {
      overflow-y: hidden;
    }

    :host([scroll-direction='none']) {
      overflow: hidden;
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
      background: var(--vaadin-border-color);
    }

    :host([theme~='overflow-indicators'])::after {
      margin-bottom: 0;
      margin-top: -1px;
    }

    :host([theme~='overflow-indicators'][overflow~='top'])::before,
    :host([theme~='overflow-indicators'][overflow~='bottom'])::after {
      display: block;
    }
  }
`;
