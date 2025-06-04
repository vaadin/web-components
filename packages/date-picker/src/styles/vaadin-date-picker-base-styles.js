/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const datePickerStyles = css`
  @layer base {
    :host([opened]) {
      pointer-events: auto;
    }

    :host([dir='rtl']) [part='input-field'] {
      direction: ltr;
    }

    :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
      direction: rtl;
      text-align: left;
    }

    [part='toggle-button']::before {
      mask-image: var(--_vaadin-icon-calendar);
    }
  }
`;
