/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const customFieldStyles = css`
  :host {
    display: inline-flex;
  }

  :host::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
    /* Size and position this element on the same vertical position as the input-field element
           to make vertical align for the host element work as expected */
  }

  :host([hidden]) {
    display: none !important;
  }

  .vaadin-custom-field-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .inputs-wrapper {
    flex: none;
  }
`;
