/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const fieldOutlineStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    --_active-user-color: transparent;
  }

  :host([has-active-user]) {
    opacity: 1;
  }
`;
