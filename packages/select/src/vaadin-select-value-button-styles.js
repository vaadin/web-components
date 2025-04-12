/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const valueButton = css`
  :host {
    display: inline-block;
    position: relative;
    width: 0;
    min-width: 0;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    user-select: none;
  }

  ::slotted(*) {
    flex: auto;
    padding-right: 0;
    padding-left: 0;
  }

  /* placeholder styles */
  ::slotted(*:not([selected])) {
    line-height: 1;
  }

  .vaadin-button-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
    text-align: inherit;
    text-shadow: inherit;
  }

  [part='label'] {
    width: 100%;
    overflow: hidden;
    line-height: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
