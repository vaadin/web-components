/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const messageStyles = css`
  :host {
    display: flex;
    flex-direction: row;
    outline: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  [part='header'] {
    align-items: baseline;
    display: flex;
    flex-flow: row wrap;
  }

  [part='name'] {
    font-weight: 500;
  }

  [part='message'] {
    white-space: pre-wrap;
  }

  ::slotted([slot='avatar']) {
    --vaadin-avatar-outline-width: 0;
    flex-shrink: 0;
  }
`;
