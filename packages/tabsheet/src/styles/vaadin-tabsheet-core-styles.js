/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const tabSheetStyles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='tabs-container'] {
    position: relative;
    display: flex;
    align-items: center;
  }

  ::slotted([slot='tabs']) {
    flex: 1;
    align-self: stretch;
    min-width: 8em;
  }

  [part='content'] {
    position: relative;
    flex: 1;
    box-sizing: border-box;
  }
`;
