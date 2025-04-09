/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const datePickerOverlayStyles = css`
  :host([week-numbers]) {
    --_vaadin-date-picker-week-numbers-visible: 1;
  }

  [part='overlay'] {
    display: flex;
    flex: auto;
    max-height: var(--vaadin-date-picker-overlay-max-height, 30rem);
    width: calc(
      var(--vaadin-date-picker-week-number-width, 1.5rem) * var(--_vaadin-date-picker-week-numbers-visible, 0) +
        var(--vaadin-date-picker-date-width, 2rem) * 7 + var(--vaadin-date-picker-month-padding, 0.5rem) * 2 +
        var(--vaadin-date-picker-year-scroller-width, 3rem)
    );
  }

  [part~='content'] {
    flex: auto;
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      outline: 3px solid;
    }
  }
`;
