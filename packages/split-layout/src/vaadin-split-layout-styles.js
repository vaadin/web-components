/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
    overflow: auto;
    flex: 1 1 auto;
    -webkit-overflow-scrolling: touch;
  }

  [part='splitter'] {
    position: relative;
    z-index: 1;
    overflow: visible;
    min-width: 8px;
    min-height: 8px;
    flex: none;
  }

  :host(:not([orientation='vertical'])) > [part='splitter'] {
    cursor: ew-resize;
  }

  :host([orientation='vertical']) > [part='splitter'] {
    cursor: ns-resize;
  }

  [part='handle'] {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate3d(-50%, -50%, 0);
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
