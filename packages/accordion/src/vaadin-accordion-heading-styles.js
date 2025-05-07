/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const accordionHeading = css`
  :host {
    background: var(--vaadin-accordion-heading-background, transparent);
    background-origin: border-box;
    border: var(--vaadin-accordion-heading-border, none);
    border-radius: var(--vaadin-accordion-heading-border-radius, var(--_vaadin-radius-m));
    box-sizing: border-box;
    color: var(--vaadin-accordion-heading-text-color, var(--_vaadin-color-strong));
    display: block;
    font-size: var(--vaadin-accordion-heading-font-size, inherit);
    font-weight: var(--vaadin-accordion-heading-font-weight, 500);
    gap: var(--vaadin-accordion-heading-gap, 0 var(--_vaadin-gap-container-inline));
    height: var(--vaadin-accordion-heading-height, auto);
    outline: calc(var(--vaadin-focus-ring-width) * var(--_focus-ring, 0)) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
    padding: var(--vaadin-accordion-heading-padding, var(--_vaadin-padding-container));
    -webkit-user-select: none;
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  button {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: inherit;
    display: flex;
    font: inherit;
    gap: inherit;
    outline: none;
    padding: 0;
  }

  [part='toggle'] {
    color: var(--_vaadin-color-subtle);
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
    color: var(--_vaadin-color-subtle);
  }

  :host([disabled]) [part='toggle'] {
    opacity: 0.5;
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
  }
`;
