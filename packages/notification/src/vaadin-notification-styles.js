/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const notificationContainerStyles = css`
  :host {
    position: fixed;
    z-index: 1000;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    pointer-events: none;
  }

  [region-group] {
    flex: 1 1 0%;
    display: flex;
  }

  [region-group='top'] {
    align-items: flex-start;
  }

  [region-group='bottom'] {
    align-items: flex-end;
  }

  [region-group] > [region] {
    flex: 1 1 0%;
  }

  @media (max-width: 420px) {
    [region-group] {
      flex-direction: column;
      align-items: stretch;
    }

    [region-group='top'] {
      justify-content: flex-start;
    }

    [region-group='bottom'] {
      justify-content: flex-end;
    }

    [region-group] > [region] {
      flex: initial;
    }
  }
`;

export const notificationCardStyles = css`
  :host {
    display: block;
  }

  [part='overlay'] {
    pointer-events: auto;
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      outline: 3px solid;
    }
  }
`;
