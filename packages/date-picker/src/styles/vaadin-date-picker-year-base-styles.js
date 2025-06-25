/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const datePickerYearStyles = css`
  @layer base {
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
    }

    :host([current]) [part='year-number'] {
      color: var(--vaadin-date-picker-year-scroller-current-year-color, var(--vaadin-color));
    }
  }
`;
