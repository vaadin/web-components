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
    align-items: center;
    background-color: initial;
    border: initial;
    color: inherit;
    display: flex;
    font: inherit;
    justify-content: inherit;
    margin: 0;
    outline: none;
    padding: 0;
    text-align: inherit;
    width: 100%;
  }
`;
