/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const multiSelectComboBoxChipStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    align-self: center;
    white-space: nowrap;
    box-sizing: border-box;
  }

  [part='label'] {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([hidden]),
  :host(:is([readonly], [disabled], [slot='overflow'])) [part='remove-button'] {
    display: none !important;
  }

  @media (forced-colors: active) {
    :host {
      outline: 1px solid;
      outline-offset: -1px;
    }
  }
`;
