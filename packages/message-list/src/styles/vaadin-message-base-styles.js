/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
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

  [part='attachments'] {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  [part~='attachment'] {
    display: inline-flex;
    align-items: center;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: pointer;
    text-align: start;
  }

  [part~='attachment-image'] [part='attachment-preview'] {
    display: block;
    max-width: 200px;
    max-height: 150px;
  }

  [part~='attachment-file'] {
    gap: 6px;
  }

  [part='attachment-icon'] {
    display: inline-block;
    width: 1em;
    height: 1em;
    background: currentColor;
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>');
    mask-size: contain;
    mask-repeat: no-repeat;
    flex-shrink: 0;
  }

  [part='attachment-name'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
