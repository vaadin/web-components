/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const drawerToggle = css`
  :host {
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 4px;
    outline: none;
    cursor: default;
  }

  [part='icon'],
  [part='icon']::after,
  [part='icon']::before {
    position: absolute;
    top: 8px;
    width: 24px;
    height: 3px;
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
