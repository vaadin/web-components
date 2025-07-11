/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const loginOverlayWrapper = css`
  /* TODO move to overlay styles */
  :host {
    /* Needed for proper positioning */
    width: auto;
    height: auto;
    /* Reset visuals */
    border: none;
    padding: 0;
    background-color: transparent;
    /* Do not clip shadows */
    overflow: visible;
  }

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

  [part='title'] {
    color: inherit;
    margin: 0;
  }
`;

export const loginOverlayWrapperStyles = [overlayStyles, loginOverlayWrapper];
