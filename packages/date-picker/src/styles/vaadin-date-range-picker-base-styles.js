/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const dateRangePickerStyles = css`
  :host {
    width: var(--vaadin-field-default-width, 18em);
  }

  [part='separator'] {
    flex: none;
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0;
    min-height: 0;
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
  }

  /* Themes may fade out overflowing slotted content, which does not apply here */
  [part='separator'],
  [part~='start-clear-button'] {
    mask-image: none;
  }

  ::slotted(input) {
    min-width: 0;
  }

  :host(:not([has-start-value])) [part~='start-clear-button'],
  :host(:not([has-end-value])) [part~='end-clear-button'] {
    display: none;
  }

  /* Indicate the input whose date a pick in the calendar sets */
  :host([opened][active-part='start']) ::slotted([slot='input']),
  :host([opened][active-part='end']) ::slotted([slot='end-input']) {
    box-shadow: inset 0 -2px 0
      var(--vaadin-date-range-picker-active-input-indicator-color, var(--vaadin-focus-ring-color, currentColor));
  }
`;
