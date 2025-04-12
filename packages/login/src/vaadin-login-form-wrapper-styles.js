/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const loginFormWrapperStyles = css`
  :host {
    display: inline-block;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='form'] {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  [part='form-title'] {
    margin: 0;
  }

  [part='error-message'] {
    position: relative;
  }
`;
