/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const drawerToggle = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    position: relative;
    outline: none;
    height: 24px;
    width: 24px;
    padding: 4px;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    position: absolute;
    top: 8px;
    height: 3px;
    width: 24px;
    background-color: #000;
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
