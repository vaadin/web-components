/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const dateRangePickerStyles = css`
  :host {
    /* Fits two full dates with the clear button */
    width: var(--vaadin-date-range-picker-default-width, 20em);
  }

  [part='separator'] {
    flex: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0;
    min-height: 0;
    /* Themes may fade out overflowing slotted content, which does not apply here */
    mask-image: none;
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
  }

  ::slotted(input) {
    min-width: 0;
  }

  /* With a single input, the start input shows the whole range */
  :host([single-input]) ::slotted([slot='end-input']),
  :host([single-input]) [part='separator'] {
    display: none !important;
  }

  /* Highlight the input whose date a pick in the calendar sets */
  :host([opened][active-part='start']:not([single-input])) ::slotted([slot='input']),
  :host([opened][active-part='end']:not([single-input])) ::slotted([slot='end-input']) {
    border-radius: var(--vaadin-radius-s);
    background: var(
      --vaadin-date-range-picker-active-input-background,
      color-mix(in srgb, var(--vaadin-focus-ring-color, currentColor) 12%, transparent)
    );
  }
`;
