/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const formRowStyles = css`
  :host {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;

    /*
      Same as in the parent layout: auto-columns are excluded from
      --_grid-rendered-column-count, which is used to cap the colspan.
    */
    grid-auto-columns: 0;

    /* The column gap comes from the parent grid, the row gap does not */
    row-gap: var(--_row-spacing);

    place-items: baseline start;
  }

  :host([empty]) {
    display: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(*) {
    /* Make form items inherit label position from the layout */
    --_form-item-labels-above: inherit;
    --_form-item-labels-aside: inherit;

    grid-column: auto / span min(var(--_grid-colspan, 1), var(--_grid-rendered-column-count));
  }
`;
