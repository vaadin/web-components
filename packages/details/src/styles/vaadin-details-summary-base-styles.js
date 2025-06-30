/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css, unsafeCSS } from 'lit';

export const detailsSummary = (partName = 'vaadin-details-summary') => css`
  @layer base {
    :host {
      align-items: center;
      background: var(--${unsafeCSS(partName)}-background, transparent);
      background-origin: border-box;
      border: var(--${unsafeCSS(partName)}-border, none);
      border-radius: var(--${unsafeCSS(partName)}-border-radius, var(--_vaadin-radius-m));
      box-sizing: border-box;
      color: var(--${unsafeCSS(partName)}-text-color, var(--vaadin-color));
      cursor: var(--vaadin-clickable-cursor);
      display: flex;
      font-size: var(--${unsafeCSS(partName)}-font-size, inherit);
      font-weight: var(--${unsafeCSS(partName)}-font-weight, 500);
      gap: var(--${unsafeCSS(partName)}-gap, 0 var(--_vaadin-gap-container-inline));
      height: var(--${unsafeCSS(partName)}-height, auto);
      outline: calc(var(--vaadin-focus-ring-width) * var(--_focus-ring, 0)) solid var(--vaadin-focus-ring-color);
      outline-offset: 1px;
      padding: var(--${unsafeCSS(partName)}-padding, var(--_vaadin-padding-container));
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }

    :host([focus-ring]) {
      --_focus-ring: 1;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part='toggle'] {
      color: var(--vaadin-color-subtle);
    }

    @media (prefers-reduced-motion: no-preference) {
      [part='toggle'] {
        transition-property: rotate;
        transition-duration: 150ms;
        animation: delay-initial-transition 1ms;
      }

      @keyframes delay-initial-transition {
        0% {
          rotate: 0deg;
        }
      }
    }

    [part='toggle']::before {
      background: currentColor;
      content: '';
      display: block;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-chevron-down);
      width: var(--vaadin-icon-size, 1lh);
      rotate: -90deg;
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: var(--vaadin-disabled-cursor);
    }

    :host([dir='rtl']) [part='toggle']::before {
      scale: -1;
    }

    :host([opened]) [part='toggle'] {
      rotate: 90deg;
    }

    :host([dir='rtl'][opened]) [part='toggle'] {
      rotate: -90deg;
    }

    @media (forced-colors: active) {
      [part='toggle']::before {
        background: CanvasText;
      }

      :host([disabled]) {
        color: GrayText;
        opacity: 1;
      }

      :host([disabled]) [part='toggle']::before {
        background: GrayText;
      }
    }
  }
`;
