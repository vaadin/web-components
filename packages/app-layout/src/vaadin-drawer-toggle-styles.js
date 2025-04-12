/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const drawerToggle = css`
  :host {
    align-items: center;
    cursor: default;
    display: inline-flex;
    height: 24px;
    justify-content: center;
    outline: none;
    padding: 4px;
    position: relative;
    width: 24px;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    background-color: #000;
    height: 3px;
    position: absolute;
    top: 8px;
    width: 24px;
  }

  [part='icon']::after,
  [part='icon']::before {
    content: '';
  }

  [part='icon']::after {
    top: 6px;
  }

  [part='icon']::before {
    top: 12px;
  }
`;
