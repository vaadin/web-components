/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const formItemStyles = css`
  :host {
    display: inline-grid;
    grid-template-columns: var(--_label-width, 8em) minmax(0, 1fr);
    column-gap: var(--_label-spacing, 1em);
    align-items: baseline;
    /* By default, fields should keep their natural width (see .full-width and expandFields) */
    justify-items: start;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='label'] {
    color: var(--vaadin-form-item-label-color, var(--vaadin-text-color));
    font-size: var(--vaadin-form-item-label-font-size, inherit);
    font-weight: var(--vaadin-form-item-label-font-weight, 500);
    grid-area: 1 / 1;
    /* Cover the whole label column to keep it clickable */
    justify-self: stretch;
    line-height: var(--vaadin-form-item-label-line-height, inherit);
    word-break: break-word;
  }

  ::slotted(.full-width) {
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
  }

  /* Labels above */
  :host([label-position='top']) {
    align-items: normal;
    grid-template-columns: minmax(0, 1fr);
  }
`;

/*
 * PROTOTYPE: When labels are displayed aside, fields that render their own label
 * span the form item's label and input columns using subgrid. The field keeps its
 * own row structure (including the helper position and the baseline row): only
 * the label part moves into the label column, while the remaining parts move
 * into the input column. Checkboxes are deliberately not included: their label
 * always stays next to the control, so they go into the input column as a whole.
 */
export const formItemSlotStyles = css`
  /* Using :where to ensure user styles always take precedence */
  :where(
    vaadin-form-item[label-position='aside']
      > :is(vaadin-text-field, vaadin-password-field, vaadin-text-area, vaadin-checkbox-group)
  ) {
    grid-column: 1 / -1;
    grid-row: 1;
    grid-template-columns: subgrid;

    &::part(label) {
      align-self: baseline;
      grid-column: 1;
      grid-row: input / -1;
      margin-bottom: 0;
    }

    &::part(input-field),
    &::part(group-field) {
      align-self: baseline;
    }

    &::part(input-field),
    &::part(group-field),
    &::part(helper-text),
    &::part(error-message) {
      grid-column: 2;
    }
  }

  /*
   * The baseline guide of a checkbox group should not account for the input's
   * padding and border, which checkboxes don't have, so that the group label
   * aligns with the labels of other fields on the same row.
   */
  :where(vaadin-form-item[label-position='aside'] > vaadin-checkbox-group) {
    --vaadin-field-baseline-input-height: calc(
      1lh + var(--vaadin-padding-block-container) + var(--vaadin-input-field-border-width, 1px)
    );
  }
`;
