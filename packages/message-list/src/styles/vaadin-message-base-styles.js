/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageStyles = css`
  :host {
    display: flex;
    flex-direction: row;
    padding: var(--vaadin-message-padding, var(--vaadin-padding-s) var(--vaadin-padding-m));
    gap: var(--vaadin-message-gap, var(--vaadin-gap-xs) var(--vaadin-gap-s));
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:is(:focus-visible, [focus-ring])) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: inherit;
  }

  [part='header'] {
    align-items: baseline;
    display: flex;
    flex-flow: row wrap;
    gap: inherit;
    row-gap: 0;
    line-height: var(--vaadin-message-header-line-height, inherit);
  }

  [part='name'] {
    font-size: var(--vaadin-message-name-font-size, inherit);
    font-weight: var(--vaadin-message-name-font-weight, 500);
    color: var(--vaadin-message-name-color, var(--vaadin-text-color));
  }

  [part='time'] {
    font-size: var(--vaadin-message-time-font-size, max(11px, 0.75em));
    font-weight: var(--vaadin-message-time-font-weight, inherit);
    color: var(--vaadin-message-time-color, var(--vaadin-text-color-secondary));
  }

  [part='message'] {
    white-space: pre-wrap;
    font-size: var(--vaadin-message-font-size, inherit);
    font-weight: var(--vaadin-message-font-weight, inherit);
    line-height: var(--vaadin-message-line-height, inherit);
    color: var(--vaadin-message-text-color, var(--vaadin-text-color));
  }

  ::slotted([slot='avatar']) {
    flex: none;
  }

  ::slotted(vaadin-markdown) {
    white-space: normal;
  }
`;
