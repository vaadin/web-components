/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';
import { group } from '@vaadin/field-base/src/styles/group-base-styles.js';

export const radioGroupStyles = [
  field,
  group,
  css`
    :host([readonly]) ::slotted(vaadin-radio-button) {
      --vaadin-radio-button-background: transparent;
      --vaadin-radio-button-border-color: var(--vaadin-border-color);
      --vaadin-radio-button-marker-color: var(--vaadin-text-color);
      --_border-style: dashed;
    }
  `,
];
