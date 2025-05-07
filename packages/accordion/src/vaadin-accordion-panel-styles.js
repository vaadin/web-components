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
    content-visibility: hidden;
    contain-intrinsic-height: auto none;
    opacity: 0;
  }

  /*
  Safari doesn't transition content-visibility gracefully,
  even with 'transition-behavior: allow-discrete'.
  Let Safari transition display instead.
  Using 'display: none' breaks the transition in Firefox.
  */
  @supports (font: -apple-system-body) {
    :host(:not([opened])) [part='content'] {
      content-visibility: initial;
      display: none;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    :host {
      display: grid;
      transition-property: grid-template-rows;
      transition-duration: 150ms;
      grid-template-rows: min-content 0fr;
      @starting-style {
        /* Needed for Safari, which otherwise transitions the initial rendered state */
        grid-template-rows: min-content 1fr;
      }
    }

    :host([opened]) {
      grid-template-rows: min-content 1fr;
    }

    [part='content'] {
      transition-behavior: allow-discrete;
      transition-duration: inherit;
      transition-property: display, content-visibility, opacity;
    }
  }

  :host([focus-ring]) {
    --_focus-ring: 1;
  }
`;
