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
      cursor: var(--vaadin-clickable-cursor);
      display: flex;
      gap: var(--vaadin-item-gap, 0 var(--_vaadin-gap-container-inline));
      height: var(--vaadin-item-height, auto);
      padding: var(--vaadin-item-padding, var(--_vaadin-padding-container));
    }

    :host([focused]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) / -1);
    }

    :host([disabled]) {
      cursor: var(--vaadin-disabled-cursor);
      opacity: 0.5;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part='checkmark'] {
      color: var(--vaadin-item-checkmark-color, inherit);
      display: var(--vaadin-item-checkmark-display, none);
      visibility: hidden;
    }

    [part='checkmark']::before {
      content: '';
      display: block;
      background: currentColor;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-checkmark);
      width: var(--vaadin-icon-size, 1lh);
    }

    :host([selected]) [part='checkmark'] {
      visibility: visible;
    }

    [part='content'] {
      flex: 1;
    }
  }
`;
