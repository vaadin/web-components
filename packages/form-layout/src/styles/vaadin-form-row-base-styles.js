/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const formRowStyles = css`
  :host {
    display: contents;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(*) {
    /* Make form items inherit label position from the layout */
    --_form-item-labels-above: inherit;
    --_form-item-labels-aside: inherit;

    grid-column: auto / span min(var(--_grid-colspan, 1), var(--_grid-rendered-column-count));
    margin-inline-start: var(
      --_form-item-labels-aside,
      var(--_label-aside-indent, calc(var(--_label-width) + var(--_label-spacing)))
    );
  }

  ::slotted(:first-child) {
    grid-column-start: 1;
  }
`;
