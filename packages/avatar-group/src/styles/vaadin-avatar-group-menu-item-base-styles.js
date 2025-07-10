/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { itemStyles } from '@vaadin/item/src/styles/vaadin-item-base-styles.js';

const menuItemStyles = css`
  [part='content'] {
    display: flex;
    align-items: center;
    gap: inherit;
  }
`;

export const avatarGroupMenuItemStyles = [itemStyles, menuItemStyles];
