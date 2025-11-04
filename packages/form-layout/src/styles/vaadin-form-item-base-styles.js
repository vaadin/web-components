/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const formItemStyles = css`
  :host {
    /* By default, when auto-responsive mode is disabled, labels should be displayed beside the fields. */
    --_form-item-labels-above: ' '; /* false */
    --_form-item-labels-aside: initial; /* true */

    align-items: var(--_form-item-labels-aside, baseline);
    display: inline-flex;
    flex-flow: var(--_form-item-labels-above, column) nowrap;
    justify-self: stretch;
  }

  :host([label-position='top']) {
    --_form-item-labels-above: initial; /* true */
    --_form-item-labels-aside: ' '; /* false */
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='label'] {
    color: var(--vaadin-form-item-label-color, var(--vaadin-text-color));
    flex: 0 0 auto;
    font-size: var(--vaadin-form-item-label-font-size, inherit);
    font-weight: var(--vaadin-form-item-label-font-weight, 500);
    line-height: var(--vaadin-form-item-label-line-height, inherit);
    width: var(--_form-item-labels-aside, var(--_label-width, 8em));
    word-break: break-word;
  }

  #spacing {
    flex: 0 0 auto;
    width: var(--_label-spacing, 1em);
  }

  #content {
    flex: 1 1 auto;
    min-width: 0;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
  }
`;
