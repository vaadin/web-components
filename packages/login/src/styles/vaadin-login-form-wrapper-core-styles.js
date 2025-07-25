/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const loginFormWrapperStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted([slot='form-title']) {
    margin: 0;
  }

  [part='error-message'] {
    position: relative;
  }

  strong {
    font-weight: 600;
  }
`;
