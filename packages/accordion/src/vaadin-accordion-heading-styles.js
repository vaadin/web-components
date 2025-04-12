/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const accordionHeading = css`
  :host {
    display: block;
    outline: none;
    -webkit-user-select: none;
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  button {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: inherit;
    padding: 0;
    border: initial;
    margin: 0;
    background-color: initial;
    color: inherit;
    font: inherit;
    outline: none;
    text-align: inherit;
  }
`;
