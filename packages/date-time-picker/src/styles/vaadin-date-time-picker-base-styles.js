/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const dateTimePickerStyles = css`
  .vaadin-date-time-picker-container {
    width: calc(var(--vaadin-field-default-width, 12em) * 2 + var(--vaadin-date-time-picker-gap, var(--vaadin-gap-s)));
  }

  [part='input-fields'] {
    display: flex;
    gap: var(--vaadin-date-time-picker-gap, var(--vaadin-gap-s));
  }

  [part='input-fields'] ::slotted([slot='date-picker']) {
    min-width: 0;
    flex: 1 1 auto;
  }

  [part='input-fields'] ::slotted([slot='time-picker']) {
    min-width: 0;
    flex: 1 1.65 auto;
  }
`;
