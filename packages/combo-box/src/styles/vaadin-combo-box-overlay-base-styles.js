/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/loader-styles.js';

export const comboBoxOverlayStyles = [
  loaderStyles,
  css`
    @layer base {
      :host {
        --vaadin-item-checkmark-display: block;
      }

      [part='overlay'] {
        position: relative;
        width: var(--vaadin-combo-box-overlay-width, var(--_vaadin-combo-box-overlay-default-width, auto));
      }

      [part='content'] {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      :host([loading]) [part='content'] {
        --_items-min-height: calc(var(--vaadin-icon-size, 1lh) + 4px);
      }

      @media (forced-colors: active) {
        [part='loader'] {
          forced-color-adjust: none;
          --vaadin-combo-box-spinner-color: CanvasText;
        }
      }

      [part='loader'] {
        position: absolute;
        inset: calc(var(--vaadin-item-overlay-padding, 4px) + 2px);
        inset-block-end: auto;
        inset-inline-start: auto;
      }
    }
  `,
];
