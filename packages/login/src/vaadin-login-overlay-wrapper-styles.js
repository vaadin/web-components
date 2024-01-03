/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const loginOverlayWrapperStyles = css`
  [part='overlay'] {
    outline: none;
  }

  [part='card'] {
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  [part='brand'] {
    box-sizing: border-box;
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  [part='brand'] h1 {
    color: inherit;
    margin: 0;
  }
`;
