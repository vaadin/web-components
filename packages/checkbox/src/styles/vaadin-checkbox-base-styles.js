/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const checkbox = css`
  [part='checkbox']::after {
    inset: 0;
    mask: var(--_vaadin-icon-checkmark) 50% / var(--vaadin-checkbox-icon-size, 100%) no-repeat;
  }

  :host([readonly]) {
    --vaadin-checkbox-background: transparent;
    --vaadin-checkbox-border-color: var(--vaadin-border-color);
    --vaadin-checkbox-color: var(--vaadin-color);
    --_border-style: dashed;
  }

  :host([indeterminate]) [part='checkbox']::after {
    mask-image: var(--_vaadin-icon-minus);
  }
`;

export const checkboxStyles = [field, checkable('checkbox'), checkbox];
