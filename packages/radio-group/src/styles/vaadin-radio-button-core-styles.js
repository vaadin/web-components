/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-core-styles.js';

const radioButton = css`
  @media (forced-colors: active) {
    [part='radio'] {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([focused]) [part='radio'] {
      outline-width: 2px;
    }

    :host([disabled]) [part='radio'] {
      outline-color: GrayText;
    }
  }
`;

export const radioButtonStyles = [checkable('radio', 'radio-button'), radioButton];
