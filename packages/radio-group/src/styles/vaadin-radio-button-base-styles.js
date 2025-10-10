/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const radioButton = css`
  [part='radio'] {
    border-radius: 50%;
  }

  [part='radio']::after {
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: var(--vaadin-radio-button-marker-size, 50%);
    height: var(--vaadin-radio-button-marker-size, 50%);
    border-radius: 50%;
  }
`;

export const radioButtonStyles = [field, checkable('radio', 'radio-button'), radioButton];
