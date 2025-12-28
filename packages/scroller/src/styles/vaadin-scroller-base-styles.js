/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const scrollerStyles = css`
  :host {
    --_indicator-height: var(--vaadin-scroller-overflow-indicator-height, 1px);
    /* Don't let these properties inherit */
    --vaadin-scroller-padding-block: 0px;
    --vaadin-scroller-padding-inline: 0px;
    --vaadin-scroller-overflow-indicator-top-opacity: 0;
    --vaadin-scroller-overflow-indicator-bottom-opacity: 0;
    display: block;
    overflow: auto;
    outline: none;
    flex: 1;
    box-sizing: border-box;
    padding: var(--vaadin-scroller-padding-block) var(--vaadin-scroller-padding-inline);
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

  :host::before,
  :host::after {
    content: '';
    display: block;
    opacity: 0;
    position: sticky;
    inset: 0 calc(var(--vaadin-scroller-padding-inline) * -1);
    z-index: 9999;
    pointer-events: none;
    box-sizing: border-box;
    height: var(--_indicator-height);
    margin-inline: calc(var(--vaadin-scroller-padding-inline) * -1);
    background: var(--vaadin-border-color-secondary);
  }

  :host::before {
    top: 0;
    margin-bottom: calc(var(--_indicator-height) * -1);
    translate: 0 calc(var(--vaadin-scroller-padding-block) * -1);
  }

  :host::after {
    bottom: 0;
    margin-top: calc(var(--_indicator-height) * -1);
    translate: 0 calc(var(--vaadin-scroller-padding-block) * 1);
  }

  :host([overflow~='top'])::before {
    opacity: var(--vaadin-scroller-overflow-indicator-top-opacity);
  }

  :host([overflow~='bottom'])::after {
    opacity: var(--vaadin-scroller-overflow-indicator-bottom-opacity);
  }

  :host([theme~='overflow-indicator-top'][overflow~='top']),
  :host([theme~='overflow-indicators'][overflow~='top']) {
    --vaadin-scroller-overflow-indicator-top-opacity: 1;
  }

  :host([theme~='overflow-indicators'][overflow~='bottom']),
  :host([theme~='overflow-indicator-bottom'][overflow~='bottom']) {
    --vaadin-scroller-overflow-indicator-bottom-opacity: 1;
  }
`;
