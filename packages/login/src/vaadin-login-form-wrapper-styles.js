/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const loginFormWrapperStyles = css`
  :host {
    overflow: hidden;
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='form'] {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  [part='form-title'] {
    margin: 0;
  }

  [part='error-message'] {
    position: relative;
  }
`;
