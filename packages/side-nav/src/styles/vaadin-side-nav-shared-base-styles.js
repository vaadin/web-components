/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const sharedStyles = css`
  @layer base {
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--vaadin-side-nav-items-gap, var(--_vaadin-gap-container-block));
      cursor: default;
      -webkit-tap-highlight-color: transparent;
    }

    :host([hidden]),
    [hidden] {
      display: none !important;
    }

    button {
      appearance: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: inherit;
      cursor: var(--vaadin-clickable-cursor);
      flex: none;
    }

    [part='toggle-button'] {
      border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-s));
      color: var(--_vaadin-color);
    }

    [part='toggle-button']::before {
      content: '';
      display: block;
      background: currentColor;
      mask-image: var(--_vaadin-icon-chevron-down);
      width: var(--vaadin-icon-size, 1lh);
      height: var(--vaadin-icon-size, 1lh);
      rotate: -90deg;
    }

    :host([dir='rtl']) [part='toggle-button']::before {
      scale: -1;
    }

    :host(:is(vaadin-side-nav-item[expanded], vaadin-side-nav:not([collapsed]))) [part='toggle-button'] {
      rotate: 90deg;
    }

    :host([dir='rtl']:is(vaadin-side-nav-item[expanded], vaadin-side-nav:not([collapsed]))) [part='toggle-button'] {
      rotate: -90deg;
    }

    @media (prefers-reduced-motion: no-preference) {
      [part='toggle-button'] {
        transition: rotate 150ms;
      }
    }

    :host([disabled]) [part='toggle-button'] {
      opacity: 0.5;
    }

    [part='children'] {
      padding: 0;
      margin: 0;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: var(--vaadin-side-nav-items-gap, var(--_vaadin-gap-container-block));
    }

    :focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }

    @media (forced-colors: active) {
      [part='toggle-button']::before {
        background: CanvasText;
      }
    }
  }
`;
