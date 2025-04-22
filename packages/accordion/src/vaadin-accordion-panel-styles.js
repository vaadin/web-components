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
    height: 0;
    interpolate-size: allow-keywords;
    opacity: 0;
    transition-duration: 150ms;
    transition-property: height, opacity;
    visibility: hidden;
  }

  :host([opened]) [part='content'] {
    height: auto;
    opacity: 1;
    visibility: visible;
  }

  @media (prefers-reduced-motion) {
    [part='content'] {
      transition-property: none;
    }
  }
`;
