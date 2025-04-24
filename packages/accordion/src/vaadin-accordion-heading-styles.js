/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const accordionHeading = css`
  :host {
    display: block;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  button {
    appearance: none;
    background: var(--vaadin-accordion-heading-background, transparent);
    background-origin: border-box;
    border: var(--vaadin-accordion-heading-border, none);
    border-radius: var(--vaadin-accordion-heading-border-radius, var(--_vaadin-radius-m));
    color: var(--vaadin-accordion-heading-text-color, var(--_vaadin-color-strong));
    display: flex;
    font: inherit;
    font-size: var(--vaadin-accordion-heading-font-size, inherit);
    font-weight: var(--vaadin-accordion-heading-font-weight, 500);
    gap: var(--vaadin-accordion-heading-gap, 0 var(--_vaadin-gap-container-inline));
    height: var(--vaadin-accordion-heading-height, auto);
    padding: var(--vaadin-accordion-heading-padding, var(--_vaadin-padding-container));
    width: 100%;
  }

  button:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  [part='toggle']::before {
    background: var(--_vaadin-color-subtle);
    content: '';
    display: inherit;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-chevron-right);
    transition-duration: 150ms;
    transition-property: transform;
    width: var(--vaadin-icon-size, 1lh);
  }

  :host([opened]) [part='toggle']::before {
    transform: rotate(90deg);
  }

  @media (prefers-reduced-motion) {
    [part='toggle']::before {
      transition-property: none;
    }
  }
`;
