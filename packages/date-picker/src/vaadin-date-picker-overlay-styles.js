/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const datePickerOverlayStyles = css`
  :host {
    container-name: overlay;
    container-type: inline-size;
  }

  [part='overlay'] {
    display: flex;
    flex: auto;
    max-height: var(--vaadin-date-picker-overlay-max-height, 30rem);
    width: var(
      --vaadin-date-picker-overlay-width,
      calc(
        var(--vaadin-date-picker-week-number-width, 1.5rem) * var(--_vaadin-date-picker-week-numbers-visible, 0) +
          var(--vaadin-date-picker-date-width, 2rem) * 7 + var(--vaadin-date-picker-month-padding, 0.5rem) * 2 +
          var(--vaadin-date-picker-year-scroller-width, 3rem)
      )
    );
  }

  :host([fullscreen]) {
    --vaadin-date-picker-date-width: calc(100% / 7);
    inset: auto 0 0 0 !important;
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

  :host([week-numbers]) {
    --_vaadin-date-picker-week-numbers-visible: 1;
  }

  :host([fullscreen][week-numbers]) {
    --vaadin-date-picker-date-width: calc((100% - var(--vaadin-date-picker-week-number-width, 1.5rem)) / 7);
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
