/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const splitLayoutStyles = css`
  :host {
    display: flex;
    overflow: hidden !important;
    transform: translateZ(0);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    flex-direction: column;
  }

  :host ::slotted(*) {
    flex: 1 1 auto;
    overflow: auto;
  }

  [part='splitter'] {
    background-color: var(--vaadin-split-layout-splitter-background, var(--vaadin-background-container));
    flex: none;
    min-height: var(--vaadin-split-layout-splitter-size, 0.5rem);
    min-width: var(--vaadin-split-layout-splitter-size, 0.5rem);
    overflow: visible;
    position: relative;
    z-index: 1;
  }

  [part='splitter']::after {
    content: '';
    inset: 0 calc(var(--vaadin-split-layout-splitter-target-size, 1rem) / -2);
    position: absolute;
  }

  :host([orientation='vertical']) [part='splitter']::after {
    inset: calc(var(--vaadin-split-layout-splitter-target-size, 1rem) / -2) 0;
  }

  :host(:not([orientation='vertical'])) > [part='splitter'] {
    cursor: ew-resize;
  }

  :host([orientation='vertical']) > [part='splitter'] {
    cursor: ns-resize;
  }

  [part='handle'] {
    align-items: center;
    display: flex;
    height: var(--vaadin-split-layout-handle-target-size, 3rem);
    justify-content: center;
    left: 50%;
    position: absolute;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    width: var(--vaadin-split-layout-handle-target-size, 3rem);
    z-index: 1;
  }

  [part='handle']::after {
    background-color: var(--vaadin-split-layout-handle-background, var(--vaadin-color-subtle));
    border-radius: var(--vaadin-radius-m);
    content: '';
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    width: var(--vaadin-split-layout-handle-size, 0.25rem);
  }

  :host([orientation='vertical']) [part='handle']::after {
    height: var(--vaadin-split-layout-handle-size, 0.25rem);
    width: 100%;
  }

  @media (forced-colors: active) {
    [part~='splitter'] {
      outline: 1px solid;
    }

    [part~='handle']::after {
      background-color: AccentColor !important;
      forced-color-adjust: none;
    }
  }
`;
