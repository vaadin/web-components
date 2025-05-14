/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { checkboxRadio } from '@vaadin/field-base/src/styles/checkbox-radio-styles.js';

export const checkboxStyles = [
  checkboxRadio('checkbox'),
  css`
    [part='checkbox']::after {
      inset: 0;
      mask-image: var(--_vaadin-icon-checkmark);
    }

    :host([indeterminate]) [part='checkbox']::after {
      inset: calc(var(--_border-width) * -1);
      mask-image: var(--_vaadin-icon-minus);
    }
  `,
];
