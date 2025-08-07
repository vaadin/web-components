/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const tabStyles = css`
  :host {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--vaadin-tab-gap, var(--vaadin-gap-s));
    padding: var(--vaadin-tab-padding, var(--vaadin-padding-container));
    cursor: var(--vaadin-clickable-cursor);
    font-size: var(--vaadin-tab-font-size, 1em);
    font-weight: var(--vaadin-tab-font-weight, 500);
    line-height: var(--vaadin-tab-line-height, inherit);
    color: var(--vaadin-tab-color, var(--vaadin-color-subtle));
    background: var(--vaadin-tab-background, transparent);
    border-radius: var(--vaadin-tab-border-radius, var(--vaadin-radius-m));
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    position: relative;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    justify-content: start;
  }

  :host([selected]) {
    --vaadin-tab-background: var(--vaadin-background-container);
    --vaadin-tab-color: var(--vaadin-color);
  }

  :host([disabled]) {
    cursor: var(--vaadin-disabled-cursor);
    opacity: 0.5;
  }

  :host(:is([focus-ring], :focus-visible)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  slot {
    gap: inherit;
    align-items: inherit;
    justify-content: inherit;
  }

  ::slotted(a) {
    color: inherit;
    cursor: inherit;
    text-decoration: inherit;
    display: flex;
    align-items: inherit;
    justify-content: inherit;
    gap: inherit;
  }

  ::slotted(a)::before {
    content: '';
    position: absolute;
    inset: 0;
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
`;
