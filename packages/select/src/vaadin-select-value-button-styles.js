/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const valueButton = css`
  :host {
    position: relative;
    display: inline-block;
    width: 0;
    min-width: 0;
    outline: none;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
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
    width: 100%;
    height: 100%;
    min-height: inherit;
    align-items: center;
    justify-content: center;
    text-align: inherit;
    text-shadow: inherit;
  }

  [part='label'] {
    overflow: hidden;
    width: 100%;
    line-height: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
