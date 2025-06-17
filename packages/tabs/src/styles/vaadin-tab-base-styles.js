/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const tabStyles = css`
  @layer base {
    :host {
      display: flex;
      place-items: center;
      gap: var(--vaadin-tab-gap, var(--_vaadin-gap-container-inline));
      padding: var(--vaadin-tab-padding, var(--_vaadin-padding-container));
      cursor: var(--vaadin-clickable-cursor);
      font-size: var(--vaadin-tab-font-size, 1em);
      font-weight: var(--vaadin-tab-font-weight, 500);
      line-height: var(--vaadin-tab-line-height, inherit);
      color: var(--vaadin-tab-color, inherit);
      background: var(--vaadin-tab-background, transparent);
      border-radius: var(--vaadin-tab-border-radius, var(--_vaadin-radius-m));
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
      touch-action: manipulation;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([selected]) {
      --vaadin-tab-background: var(--_vaadin-background-container);
      --vaadin-tab-color: var(--_vaadin-color-strong);
    }

    :host([disabled]) {
      cursor: var(--vaadin-disabled-cursor);
      opacity: 0.5;
    }

    :host(:is([focus-ring], :focus-visible)) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
    }

    @media (forced-colors: active) {
      :host {
        border: 1px solid Canvas;
      }

      :host([selected]) {
        color: Highlight;
        border-color: Highlight;
      }

      :host([disabled]) {
        color: GrayText;
        opacity: 1;
      }
    }
  }
`;
