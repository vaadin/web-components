/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const selectStyles = css`
  :host {
    position: relative;
  }

  ::slotted([slot='value']) {
    flex: 1;
  }

  :host(:not([focus-ring], [disabled])) [part='input-field'] {
    outline: none;
    --vaadin-input-field-border-color: inherit;
  }

  [part='input-field'] {
    cursor: var(--vaadin-clickable-cursor);
  }

  [part='toggle-button']::before {
    mask-image: var(--_vaadin-icon-chevron-down);
  }
`;
