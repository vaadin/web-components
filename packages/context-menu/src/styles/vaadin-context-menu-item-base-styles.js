/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { itemStyles } from '@vaadin/item/src/styles/vaadin-item-base-styles.js';

const menuItemStyles = css`
  @layer base {
    :host([aria-haspopup='true'])::after {
      background: currentColor;
      content: '';
      display: block;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-chevron-down);
      rotate: -90deg;
      width: var(--vaadin-icon-size, 1lh);
    }

    :host([menu-item-checked]) [part='checkmark'] {
      visibility: visible;
    }
  }
`;

export const contextMenuItemStyles = [itemStyles, menuItemStyles];
