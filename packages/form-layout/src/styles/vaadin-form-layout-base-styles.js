/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { addGlobalStyles } from '@vaadin/component-base/src/styles/add-global-styles.js';

CSS.registerProperty({
  name: '--_min-width-labels-aside',
  syntax: '<length>',
  inherits: false,
  initialValue: '0px',
});

addGlobalStyles(
  'vaadin-form-layout-base',
  css`
    @layer vaadin.base {
      html {
        --vaadin-form-layout-label-spacing: var(--vaadin-gap-s);
        --vaadin-form-layout-label-width: 8em;
        --vaadin-form-layout-column-spacing: var(--vaadin-gap-l);
        --vaadin-form-layout-row-spacing: var(--vaadin-gap-l);
      }
    }
  `,
);

export const formLayoutStyles = css`
  :host {
    /* Default values */
    --_label-spacing: var(--vaadin-form-layout-label-spacing);
    --_label-width: var(--vaadin-form-layout-label-width);
    --_column-spacing: var(--vaadin-form-layout-column-spacing);
    --_row-spacing: var(--vaadin-form-layout-row-spacing);

    align-self: stretch;
    display: block;
    max-width: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([auto-responsive])) {
    contain: layout;
  }

  :host(:not([auto-responsive])) #layout {
    align-items: baseline; /* default \`stretch\` is not appropriate */
    display: flex;
    flex-wrap: wrap; /* the items should wrap */
    /* Compensate for row spacing */
    margin-block: calc(-0.5 * var(--_row-spacing));
  }

  :host(:not([auto-responsive])) #layout ::slotted(*) {
    /* Items should neither grow nor shrink. */
    flex-grow: 0;
    flex-shrink: 0;

    /* Margins make spacing between the columns and rows */
    margin-inline: calc(0.5 * var(--_column-spacing));
    margin-block: calc(0.5 * var(--_row-spacing));
  }

  #layout ::slotted(br) {
    display: none;
  }

  :host([auto-responsive]) {
    /* Column width */
    --_column-width: var(--vaadin-field-default-width, 12em);
    --_column-width-labels-above: var(--_column-width);
    --_column-width-labels-aside: calc(var(--_column-width) + var(--_label-width) + var(--_label-spacing));

    /* Column gap */
    --_min-total-gap: calc((var(--_min-columns) - 1) * var(--_column-spacing));
    --_max-total-gap: calc((var(--_max-columns) - 1) * var(--_column-spacing));

    /* Minimum form layout width */
    --_min-width-labels-above: calc(var(--_min-columns) * var(--_column-width-labels-above) + var(--_min-total-gap));
    --_min-width-labels-aside: calc(var(--_min-columns) * var(--_column-width-labels-aside) + var(--_min-total-gap));
    --_min-width: var(--_min-width-labels-above);

    /* Maximum form layout width */
    --_max-width-labels-above: calc(var(--_max-columns) * var(--_column-width-labels-above) + var(--_max-total-gap));
    --_max-width-labels-aside: calc(var(--_max-columns) * var(--_column-width-labels-aside) + var(--_max-total-gap));
    --_max-width: var(--_max-width-labels-above);

    display: flex;
    min-width: var(--_min-width);
  }

  :host([auto-responsive]) #layout {
    /* By default, labels should be displayed above the fields */
    --_form-item-labels-above: initial; /* true */
    --_form-item-labels-aside: ' '; /* false */

    /* CSS grid related properties */
    --_grid-column-width: var(--_column-width-labels-above);
    --_grid-repeat: var(--_grid-column-width);

    display: grid;
    gap: var(--_row-spacing) var(--_column-spacing);

    /*
      Auto-columns can be created when an item's colspan exceeds the rendered column count.
      By setting auto-columns to 0, we exclude these columns from --_grid-rendered-column-count,
      which is then used to cap the colspan.
    */
    grid-auto-columns: 0;

    align-self: start;
    grid-template-columns: repeat(auto-fill, var(--_grid-repeat));
    place-items: baseline start;

    /*
      Firefox requires min-width on both :host and #layout to allow the layout
      to shrink below the value specified in the CSS width property above.
    */
    min-width: var(--_min-width);

    /*
      To prevent the layout from exceeding the column limit defined by --_max-columns,
      its width needs to be constrained:

      1. "width" is used instead of "max-width" because, together with the default "flex: 0 1 auto",
      it allows the layout to shrink to its minimum width inside <vaadin-horizontal-layout>, which
      wouldn't work otherwise.

      2. "width" is used instead of "flex-basis" to make the layout expand to the maximum
      number of columns inside <vaadin-overlay>, which creates a new stacking context
      without a predefined width.
    */
    width: var(--_max-width);
  }

  :host([auto-responsive]) #layout ::slotted(*) {
    /* Make form items inherit label position from the layout */
    --_form-item-labels-above: inherit;
    --_form-item-labels-aside: inherit;

    /* By default, place each child on a new row */
    grid-column: 1 / span min(var(--_grid-colspan, 1), var(--_grid-rendered-column-count));

    /* Form items do not need margins in auto-responsive mode */
    margin: 0;
  }

  :host([auto-responsive][auto-rows]) #layout ::slotted(*) {
    grid-column-start: var(--_grid-colstart, auto);
  }

  :host([auto-responsive][labels-aside]) {
    --_max-width: var(--_max-width-labels-aside);
  }

  :host([auto-responsive][labels-aside]) #layout[fits-labels-aside] {
    --_form-item-labels-above: ' '; /* false */
    --_form-item-labels-aside: initial; /* true */
    --_grid-column-width: var(--_column-width-labels-aside);
  }

  :host([auto-responsive][expand-columns]) #layout {
    /*
      The "min" value in minmax ensures that once "maxColumns" is reached, the grid stops adding
      new columns and instead expands the existing ones evenly to fill the available space.

      The "max" value in minmax allows CSS grid columns to grow and evenly distribute any space
      that remains when there isn't room for an additional column and "maxColumns" hasn't been
      reached yet.
    */
    --_grid-repeat: minmax(
      max(var(--_grid-column-width), calc((100% - var(--_max-total-gap)) / var(--_max-columns))),
      1fr
    );

    /* Allow the layout to take up full available width of the parent element. */
    flex-grow: 1;
  }
`;

export const formLayoutSlotStyles = css`
  /* Using :where to ensure user styles always take precedence */
  :where(
    vaadin-form-layout[auto-responsive] > *,
    vaadin-form-layout[auto-responsive] vaadin-form-row > *,
    vaadin-form-layout[auto-responsive] vaadin-form-item > *
  ) {
    box-sizing: border-box;
    max-width: 100%;
  }

  :where(
    vaadin-form-layout[auto-responsive][expand-fields] > *,
    vaadin-form-layout[auto-responsive][expand-fields] vaadin-form-row > *,
    vaadin-form-layout[auto-responsive][expand-fields] vaadin-form-item > *
  ) {
    min-width: 100%;
  }
`;
