/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const loginOverlayWrapperStyles = css`
  [part='overlay'] {
    outline: none;
  }

  [part='card'] {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    max-width: 100%;
    overflow: hidden;
  }

  [part='brand'] {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    justify-content: flex-end;
    overflow: hidden;
  }

  [part='title'] {
    margin: 0;
    color: inherit;
  }
`;
