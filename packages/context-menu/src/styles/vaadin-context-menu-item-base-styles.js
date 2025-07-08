/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { itemStyles } from '@vaadin/item/src/styles/vaadin-item-base-styles.js';

const menuItemStyles = css`
  :host::after {
    background: var(--vaadin-color-subtle);
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-chevron-down);
    rotate: -90deg;
    visibility: hidden;
    width: var(--vaadin-icon-size, 1lh);
  }

  :host([dir='rtl'])::after {
    rotate: 90deg;
  }

  /* TODO would be nice to only reserve the space for these if
    one or mote items in the list is checkable or has child items */
  :host([aria-haspopup='true'])::after,
  :host([menu-item-checked]) [part='checkmark'] {
    visibility: visible;
  }
`;

export const contextMenuItemStyles = [itemStyles, menuItemStyles];
