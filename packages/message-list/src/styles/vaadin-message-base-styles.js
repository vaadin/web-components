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
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus-visible),
  :is(:focus-visible, [focus-ring]) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
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
    gap: var(--vaadin-gap-s);
    padding-bottom: var(--vaadin-gap-xs);
  }

  [part~='attachment'] {
    display: inline-grid;
    grid-template-columns: max-content 1fr;
    gap: var(--vaadin-message-attachment-gap, var(--vaadin-gap-s));
    align-items: center;
    background: var(--vaadin-message-attachment-background, var(--vaadin-background-container));
    color: var(--vaadin-message-attachment-text-color, var(--vaadin-text-color));
    cursor: var(--vaadin-clickable-cursor);
    border: var(--vaadin-message-attachment-border-width, 0) solid
      var(--vaadin-message-attachment-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-message-attachment-border-radius, var(--vaadin-radius-m));
    padding: 0;
    margin: 0;
    font: inherit;
    font-size: var(--vaadin-message-attachment-font-size, inherit);
    line-height: var(--vaadin-message-attachment-line-height, inherit);
    font-weight: var(--vaadin-message-attachment-font-weight, inherit);
    text-align: start;
    contain: content;
  }

  [part='attachment-icon'] {
    grid-column: 1;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--_vaadin-message-attachment-icon-background, var(--vaadin-background-container-strong));
    color: var(--_vaadin-message-attachment-icon-color);
    padding: var(--vaadin-message-attachment-padding, var(--vaadin-padding-s));
    contain: content;

    &::before {
      content: '\\2003' / '';
      display: inline-flex;
      align-items: center;
      flex: none;
      height: var(--vaadin-icon-size, 1lh);
      width: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-file);
      mask-size: var(--vaadin-icon-visual-size, 100%);
      mask-position: 50%;
      mask-repeat: no-repeat;
      background: currentColor;
    }
  }

  [part='attachment-preview'] {
    grid-column: 1 / -1;
    max-width: 100px;
    max-height: 100px;
  }

  [part='attachment-name'] {
    grid-column: 2;
    padding: var(--vaadin-message-attachment-padding, var(--vaadin-padding-s));
    padding-inline-start: 0;
  }
`;
