/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const comboBoxOverlayStyles = css`
  :host {
    --vaadin-item-checkmark-display: block;
  }

  [part='overlay'] {
    position: relative;
    width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
  }

  [part='loader'] {
    animation: spin 1s linear infinite;
    border: 2px solid;
    --_spinner-color: var(--vaadin-combo-box-spinner-color, var(--_vaadin-color-strong));
    border-color: var(--_spinner-color) var(--_spinner-color) hsl(from var(--_spinner-color) h s l / 0.2)
      hsl(from var(--_spinner-color) h s l / 0.2);
    border-radius: var(--_vaadin-radius-full);
    box-sizing: border-box;
    display: none;
    height: var(--vaadin-icon-size, 1lh);
    inset: calc(var(--vaadin-item-overlay-padding, 4px) + 2px);
    inset-block-end: auto;
    inset-inline-start: auto;
    pointer-events: none;
    position: absolute;
    width: var(--vaadin-icon-size, 1lh);
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :host([loading]) [part='loader'] {
    display: block;
  }

  :host([loading]) [part='content'] {
    --_items-min-height: calc(var(--vaadin-icon-size, 1lh) + 4px);
  }

  @keyframes spin {
    to {
      rotate: 1turn;
    }
  }

  @media (forced-colors: active) {
    [part='loader'] {
      forced-color-adjust: none;
      --vaadin-combo-box-spinner-color: CanvasText;
    }
  }
`;
