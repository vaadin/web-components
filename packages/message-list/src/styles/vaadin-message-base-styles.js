/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { registerCSSProperty } from '@vaadin/component-base/src/css-utils.js';

registerCSSProperty({
  name: '--_vaadin-message-typing-mask-pos',
  syntax: '<length-percentage>',
  inherits: false,
  initialValue: 0,
});

export const messageStyles = css`
  :host {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
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
    background: var(--vaadin-message-content-background, transparent);
    padding: var(--vaadin-message-content-padding, 0);
    border-radius: var(--vaadin-message-content-border-radius, 0);
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
    visibility: var(--_vaadin-message-avatar-visibility, revert-layer);
    display: var(--_vaadin-message-avatar-display, revert-layer);
  }

  ::slotted(vaadin-avatar-group) {
    width: fit-content;
  }

  ::slotted(vaadin-markdown) {
    white-space: normal;
  }

  [part='attachments'] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vaadin-gap-s);
    padding-bottom: var(--vaadin-gap-xs);
    justify-content: var(--vaadin-message-attachments-alignment, start);
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
    background: var(--vaadin-background-container-strong);
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

  :host([typing-indicator]:not([typing-indicator='text'])) [part='message'],
  :host([typing-indicator='minimal']) [part='content'] {
    mask-image: linear-gradient(
      90deg,
      hsla(0, 0%, 0%, 0.4) calc(var(--_vaadin-message-typing-mask-pos) - max(60px, 60%)),
      hsl(0, 0%, 0%) calc(var(--_vaadin-message-typing-mask-pos) - max(40px, 40%)),
      hsl(0, 0%, 0%),
      calc(var(--_vaadin-message-typing-mask-pos) - max(20px, 20%)),
      hsla(0, 0%, 0%, 0.4) var(--_vaadin-message-typing-mask-pos)
    );
    animation: --_vaadin-message-typing-slide 1.5s ease-in-out infinite;
    width: fit-content !important;
    color: var(--vaadin-text-color) !important;

    [part='time'] {
      display: none;
    }

    [part='header'] {
      display: contents;
    }
  }

  @keyframes --_vaadin-message-typing-slide {
    100% {
      --_vaadin-message-typing-mask-pos: calc(100% + max(60px, 60%));
    }
  }

  :host([typing-indicator='ellipsis']) {
    [part='message'] {
      line-height: inherit !important;
      color: var(--vaadin-text-color-secondary) !important;
    }

    [part='message']::before {
      content: '';
      display: block;
      width: var(--vaadin-icon-size, 1lh);
      height: var(--vaadin-icon-size, 1lh);
      mask: var(--_vaadin-icon-ellipsis);
      background: currentColor;
    }

    [part='header'],
    [part='message'] slot {
      display: none;
    }

    [part='content'] {
      align-self: center;
    }
  }

  :host([typing-indicator='minimal']) {
    width: auto !important;
    max-width: none !important;
    align-items: center !important;
    --vaadin-avatar-size: 1lh;

    [part='content'] {
      display: block;
      background: transparent !important;
      border: 0 !important;
      padding: 0 !important;
    }

    [part='header'],
    [part='name'],
    [part='message'] {
      display: contents;
      color: inherit;
      font-size: inherit;
    }

    [part='message'] {
      text-transform: lowercase;
    }
  }
`;
