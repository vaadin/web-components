/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const formItemStyles = css`
  :host {
    /* By default, when auto-responsive mode is disabled, labels should be displayed beside the fields. */
    --_form-item-labels-above: ' '; /* false */
    --_form-item-labels-aside: initial; /* true */

    display: inline-flex;
    align-items: var(--_form-item-labels-aside, baseline);
    flex-flow: var(--_form-item-labels-above, column) nowrap;
    justify-self: stretch;
    margin: calc(0.5 * var(--vaadin-form-item-row-spacing, var(--vaadin-form-layout-row-spacing, 1em))) 0;
  }

  :host([label-position='top']) {
    --_form-item-labels-above: initial; /* true */
    --_form-item-labels-aside: ' '; /* false */
  }

  :host([hidden]) {
    display: none !important;
  }

  #label {
    width: var(
      --_form-item-labels-aside,
      var(--vaadin-form-item-label-width, var(--vaadin-form-layout-label-width, 8em))
    );
    flex: 0 0 auto;
  }

  #spacing {
    width: var(--vaadin-form-item-label-spacing, var(--vaadin-form-layout-label-spacing, 1em));
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
    min-width: 0;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
`;
