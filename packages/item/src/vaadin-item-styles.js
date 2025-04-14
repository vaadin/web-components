/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const itemStyles = css`
  @layer base {
    :host {
      align-items: center;
      border-radius: var(--vaadin-item-border-radius, var(--_vaadin-radius-m));
      box-sizing: border-box;
      cursor: pointer;
      display: flex;
      gap: var(--vaadin-item-gap, 0 var(--_vaadin-gap-container-inline));
      height: var(--vaadin-item-height, auto);
      padding: var(--vaadin-item-padding, var(--_vaadin-padding-container));
    }

    :host([focus-ring]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) / -1);
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
    }

    :host([hidden]) {
      display: none;
    }

    [part='checkmark'] {
      display: var(--vaadin-item-checkmark-display, none);
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-checkmark);
      width: var(--vaadin-icon-size, 1lh);
    }

    :host([selected]) [part='checkmark'] {
      background: var(--_vaadin-color-subtle);
    }

    [part='content'] {
      flex: 1;
    }
  }
`;
