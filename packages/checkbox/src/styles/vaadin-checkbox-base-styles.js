/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const checkbox = css`
  @layer base {
    [part='checkbox']::after {
      inset: 0;
      mask-image: var(--_vaadin-icon-checkmark);
    }

    :host([readonly]) {
      --vaadin-checkbox-background: transparent;
      --vaadin-checkbox-border-color: var(--vaadin-border-color-strong);
      --vaadin-checkbox-color: var(--vaadin-color);
    }

    :host([readonly]) [part='checkbox'] {
      border-style: dashed;
    }

    :host([indeterminate]) [part='checkbox']::after {
      inset: calc(var(--_border-width) * -1);
      mask-image: var(--_vaadin-icon-minus);
    }
  }
`;

export const checkboxStyles = [field, checkable('checkbox'), checkbox];
