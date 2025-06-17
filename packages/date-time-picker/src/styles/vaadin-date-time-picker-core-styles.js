/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const dateTimePickerStyles = css`
  .vaadin-date-time-picker-container {
    --vaadin-field-default-width: auto;
  }

  .slots {
    display: flex;
    --vaadin-field-default-width: 12em;
  }

  .slots ::slotted([slot='date-picker']) {
    min-width: 0;
    flex: 1 1 auto;
  }

  .slots ::slotted([slot='time-picker']) {
    min-width: 0;
    flex: 1 1.65 auto;
  }
`;
