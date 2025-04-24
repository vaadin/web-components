/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const accordionPanel = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='content'] {
    overflow: hidden;
  }

  :host(:not([opened])) [part='content'] {
    display: none;
    height: 0;
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='content'] {
      interpolate-size: allow-keywords;
      transition-behavior: allow-discrete;
      transition-duration: 150ms;
      transition-property: height, opacity, display;

      @starting-style {
        height: 0;
        opacity: 0;
      }
    }
  }
`;
