/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { checkboxRadio } from '@vaadin/field-base/src/styles/checkbox-radio-styles';

export const radioButtonStyles = [
  checkboxRadio('radio', 'radio-button'),
  css`
    [part='radio'] {
      border-radius: 50%;
    }

    [part='radio']::after {
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      width: var(--vaadin-radio-button-dot-size, 50%);
      height: var(--vaadin-radio-button-dot-size, 50%);
      border-radius: 50%;
    }
  `,
];
