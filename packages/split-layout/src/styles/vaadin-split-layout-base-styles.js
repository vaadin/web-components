/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const splitLayoutStyles = css`
  :host {
    display: flex;
    contain: layout;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    flex-direction: column;
  }

  ::slotted(*) {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }

  [part='splitter'] {
    --_splitter-size: var(--vaadin-split-layout-splitter-size, 8px);
    --_splitter-target-size: var(--vaadin-split-layout-splitter-target-size, 8px);
    --_handle-size: var(--vaadin-split-layout-handle-size, 4px);
    --_handle-target-size: var(--vaadin-split-layout-handle-target-size, 32px);
    background: var(--vaadin-split-layout-splitter-background, var(--vaadin-background-container-strong));
    flex: none;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part='splitter']::after {
    content: '';
    inset: 0 calc((var(--_splitter-target-size) - var(--_splitter-size)) / -2);
    position: absolute;
  }

  :host([orientation='vertical']) [part='splitter']::after {
    inset: calc((var(--_splitter-target-size) - var(--_splitter-size)) / -2) 0;
  }

  :host(:not([orientation='vertical'])) > [part='splitter'] {
    cursor: ew-resize;
    width: var(--_splitter-size);
  }

  :host([orientation='vertical']) > [part='splitter'] {
    cursor: ns-resize;
    height: var(--_splitter-size);
  }

  [part='handle'] {
    background: var(--vaadin-split-layout-handle-background, var(--vaadin-text-color-secondary));
    border-radius: var(--vaadin-radius-m);
    flex: none;
    width: var(--_handle-size);
    height: var(--_handle-target-size);
    max-height: 50%;
    position: absolute;
  }

  :host([orientation='vertical']) [part='handle'] {
    width: var(--_handle-target-size);
    max-width: 50%;
    height: var(--_handle-size);
    max-height: none;
  }

  [part='handle']::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    height: var(--_handle-target-size);
    width: var(--_handle-target-size);
    transform: translate3d(-50%, -50%, 0);
    border-radius: 50%;
  }

  :host([theme~='small']) > [part='splitter'] {
    --vaadin-split-layout-splitter-size: 1px;
    --vaadin-split-layout-splitter-target-size: 5px;
    --vaadin-split-layout-handle-size: 3px;
  }

  :host([theme~='small']) [part='splitter'] [part='handle'] {
    opacity: 0;
  }

  :host([theme~='small']) [part='splitter']:active [part='handle'] {
    opacity: 1;
  }

  @media (any-hover: hover) {
    :host([theme~='small']) [part='splitter']:hover [part='handle'] {
      opacity: 1;
    }
  }

  @media (forced-colors: active) {
    [part~='splitter'] {
      border: 1px solid;
    }
  }
`;
