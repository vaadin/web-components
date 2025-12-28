/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './style-props.js';
import { css } from 'lit';

export const loaderStyles = css`
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      rotate: 1turn;
    }
  }

  [part='loader'] {
    animation:
      spin var(--vaadin-spinner-animation-duration, 1s) linear infinite,
      fade-in 0.3s 0.3s both;
    border: var(--vaadin-spinner-width, 2px) solid;
    --_spinner-color: var(--vaadin-spinner-color, var(--vaadin-text-color));
    --_spinner-color2: color-mix(in srgb, var(--_spinner-color) 20%, transparent);
    border-color: var(--_spinner-color) var(--_spinner-color) var(--_spinner-color2) var(--_spinner-color2);
    border-radius: 50%;
    box-sizing: border-box;
    height: var(--vaadin-spinner-size, 1lh);
    pointer-events: none;
    width: var(--vaadin-spinner-size, 1lh);
  }

  :host(:not([loading])) [part~='loader'] {
    display: none;
  }

  @media (forced-colors: active) {
    [part='loader'] {
      forced-color-adjust: none;
      --vaadin-spinner-color: CanvasText;
    }
  }
`;
