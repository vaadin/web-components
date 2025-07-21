/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const datePickerOverlayStyles = css`
  [part='overlay'] {
    display: flex;
    flex: auto;
    max-height: var(--vaadin-date-picker-overlay-max-height, 30rem);
    box-sizing: content-box;
    width: var(
      --vaadin-date-picker-overlay-width,
      calc(
        var(--vaadin-date-picker-date-width, 2rem) * 7 + var(--vaadin-date-picker-month-padding, 0.5rem) * 2 +
          var(--vaadin-date-picker-year-scroller-width, 3rem)
      )
    );
    cursor: default;
  }

  :host([fullscreen]) {
    --vaadin-date-picker-date-width: calc(100% / 7);
  }

  :host([fullscreen]) [part='backdrop'] {
    display: block;
  }

  :host([fullscreen]) [part='overlay'] {
    border: none;
    border-radius: 0;
    max-height: 75vh;
    width: 100%;
  }

  [part~='content'] {
    flex: auto;
  }

  @media (max-width: 450px), (max-height: 450px) {
    :host {
      inset: auto 0 0 !important;
    }
  }
`;
