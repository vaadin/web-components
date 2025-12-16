/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/styles/loader-styles.js';

export const comboBoxOverlayStyles = [
  loaderStyles,
  css`
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

    [part='loader'] {
      position: absolute;
      inset: var(--vaadin-item-overlay-padding, 4px);
      inset-block-end: auto;
      inset-inline-start: auto;
      margin: 2px;
    }
  `,
];
