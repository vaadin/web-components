/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const valueButton = css`
  :host {
    display: inline-block;
    min-width: 0;
    outline: none;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
    width: 0;
  }

  ::slotted(*) {
    flex: auto;
    padding-left: 0;
    padding-right: 0;
  }

  /* placeholder styles */
  ::slotted(*:not([selected])) {
    line-height: 1;
  }

  .vaadin-button-container {
    align-items: center;
    display: inline-flex;
    height: 100%;
    justify-content: center;
    min-height: inherit;
    text-align: inherit;
    text-shadow: inherit;
    width: 100%;
  }

  [part='label'] {
    line-height: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
`;
