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
    content: '\\\\\\\\2003';
    display: inline-block;
    width: 0;
    /* Size and position this element on the same vertical position as the input-field element
           to make vertical align for the host element work as expected */
  }

  :host([hidden]) {
    display: none !important;
  }

  .vaadin-custom-field-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .inputs-wrapper {
    flex: none;
  }
`;
