/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const datePickerYearStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  [part='year-number'] {
    align-items: center;
    display: flex;
    height: 50%;
    justify-content: center;
    transform: translateY(-50%);
    color: var(--_vaadin-date-picker-year-number-color, var(--vaadin-text-color-secondary));
    font-size: var(--_vaadin-date-picker-year-number-font-size);
    font-weight: var(--_vaadin-date-picker-year-number-font-weight);
  }

  :host([current]) [part='year-number'] {
    color: var(
      --_vaadin-date-picker-year-number-color,
      var(--vaadin-date-picker-year-scroller-current-year-color, var(--vaadin-text-color))
    );
  }

  [part='year-separator'] {
    text-align: var(--_vaadin-date-picker-year-separator-text-align);
    translate: var(--_vaadin-date-picker-year-separator-translate);
    height: var(--_vaadin-date-picker-year-separator-height);
    line-height: var(--_vaadin-date-picker-year-separator-line-height);
  }

  [part='year-separator']::before {
    content: var(--_vaadin-date-picker-year-separator-before-content, none);
    display: var(--_vaadin-date-picker-year-separator-before-display);
    width: var(--_vaadin-date-picker-year-separator-before-width);
    height: var(--_vaadin-date-picker-year-separator-before-height);
    border-radius: var(--_vaadin-date-picker-year-separator-before-border-radius);
    background: var(--_vaadin-date-picker-year-separator-before-background);
  }
`;
