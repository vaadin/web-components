/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

import { css } from 'lit';
import { icons } from './vaadin-rich-text-editor-base-icons.js';

const base = css`
  :host {
    background: var(--vaadin-rich-text-editor-background, var(--vaadin-background-color));
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color-strong));
    border-radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :host(:focus-within) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: -1px;
  }

  :host([hidden]) {
    display: none !important;
  }

  .announcer {
    clip: rect(0, 0, 0, 0);
    position: fixed;
  }

  input[type='file'] {
    display: none;
  }

  .vaadin-rich-text-editor-container {
    display: flex;
    flex: auto;
    flex-direction: column;
    max-height: inherit;
    min-height: inherit;
  }
`;

export const content = css`
  [part='content'] {
    box-sizing: border-box;
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /*
    Quill core styles.
    CSS selectors removed: margin & padding reset, check list, indentation, video, colors, ordered & unordered list, h1-6, anchor
  */
  .ql-clipboard {
    height: 1px;
    left: -100000px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
  }

  .ql-clipboard p {
    margin: 0;
    padding: 0;
  }

  .ql-editor {
    box-sizing: border-box;
    color: var(--vaadin-rich-text-editor-editor-color, var(--vaadin-color));
    flex: 1;
    font-size: var(--vaadin-rich-text-editor-editor-font-size, inherit);
    height: 100%;
    line-height: var(--vaadin-rich-text-editor-editor-line-height, inherit);
    outline: none;
    overflow-y: auto;
    padding: var(--vaadin-rich-text-editor-editor-padding, var(--vaadin-padding-container));
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .ql-editor > * {
    cursor: text;
  }

  .ql-align-left {
    text-align: left;
  }

  .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-align-right {
    text-align: right;
  }
  /* quill core end */

  blockquote {
    border-inline-start: 4px solid var(--vaadin-border-color);
    margin: var(--vaadin-padding-container);
    padding-inline-start: var(--vaadin-padding);
  }

  code,
  pre {
    background-color: var(--vaadin-background-container);
    border-radius: var(--vaadin-radius-s);
  }

  pre {
    white-space: pre-wrap;
    margin-block: var(--vaadin-padding);
    padding: var(--vaadin-padding-container);
  }

  code {
    padding: 0.125rem 0.25rem;
  }

  img {
    max-width: 100%;
  }

  /* RTL specific styles */
  :host([dir='rtl']) .ql-editor {
    direction: rtl;
    text-align: right;
  }
`;

const toolbar = css`
  [part='toolbar'] {
    background-color: var(--vaadin-rich-text-editor-toolbar-background, var(--vaadin-background-container));
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: var(--vaadin-rich-text-editor-toolbar-gap, var(--vaadin-gap-container-inline));
    padding: var(--vaadin-rich-text-editor-toolbar-padding, var(--vaadin-padding));
  }

  [part~='toolbar-group'] {
    display: flex;
  }

  [part~='toolbar-button'] {
    background: var(--vaadin-rich-text-editor-toolbar-button-background, var(--vaadin-background-container));
    border: var(--vaadin-rich-text-editor-toolbar-button-border-width, 1px) solid
      var(--vaadin-rich-text-editor-toolbar-button-border-color, transparent);
    border-radius: var(--vaadin-rich-text-editor-toolbar-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-rich-text-editor-toolbar-button-text-color, var(--vaadin-color));
    cursor: var(--vaadin-clickable-cursor);
    flex-shrink: 0;
    font-family: var(--vaadin-rich-text-editor-toolbar-button-font-family, inherit);
    font-size: var(--vaadin-rich-text-editor-toolbar-button-font-size, inherit);
    font-weight: var(--vaadin-rich-text-editor-toolbar-button-font-weight, 500);
    height: var(--vaadin-rich-text-editor-toolbar-button-height, auto);
    line-height: var(--vaadin-rich-text-editor-toolbar-button-line-height, inherit);
    padding: var(--vaadin-rich-text-editor-toolbar-button-padding, var(--vaadin-padding-container));
    position: relative;
  }

  [part~='toolbar-button']::before {
    background: currentcolor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
  }

  [part~='toolbar-button']:focus {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
    z-index: 1;
  }

  [part~='toolbar-button'][on],
  [part~='toolbar-button'][aria-expanded='true'] {
    --vaadin-rich-text-editor-toolbar-button-background: var(--vaadin-background-container-strong);
  }

  [part~='toolbar-button-undo']::before {
    mask-image: var(--_vaadin-icon-undo);
  }

  [part~='toolbar-button-redo']::before {
    mask-image: var(--_vaadin-icon-redo);
  }

  [part~='toolbar-button-bold']::before {
    mask-image: var(--_vaadin-icon-bold);
  }

  [part~='toolbar-button-italic']::before {
    mask-image: var(--_vaadin-icon-italic);
  }

  [part~='toolbar-button-underline']::before {
    mask-image: var(--_vaadin-icon-underline);
  }

  [part~='toolbar-button-strike']::before {
    mask-image: var(--_vaadin-icon-strikethrough);
  }

  [part~='toolbar-button-color']::before {
    mask-image: var(--_vaadin-icon-color);
  }

  [part~='toolbar-button-color']::after {
    background-color: var(--_color-value, currentColor);
  }

  [part~='toolbar-button-background']::before {
    mask-image: var(--_vaadin-icon-background);
  }

  [part~='toolbar-button-background']::after {
    background-color: var(--_background-value, currentColor);
  }

  [part~='toolbar-button-color']::after,
  [part~='toolbar-button-background']::after {
    bottom: 50%;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-color-underline);
    position: absolute;
    transform: translateY(50%);
    width: var(--vaadin-icon-size, 1lh);
  }

  [part~='toolbar-button-h1']::before {
    mask-image: var(--_vaadin-icon-h1);
  }

  [part~='toolbar-button-h2']::before {
    mask-image: var(--_vaadin-icon-h2);
  }

  [part~='toolbar-button-h3']::before {
    mask-image: var(--_vaadin-icon-h3);
  }

  [part~='toolbar-button-subscript']::before {
    mask-image: var(--_vaadin-icon-subscript);
  }

  [part~='toolbar-button-superscript']::before {
    mask-image: var(--_vaadin-icon-superscript);
  }

  [part~='toolbar-button-list-ordered']::before {
    mask-image: var(--_vaadin-icon-list-number);
  }

  [part~='toolbar-button-list-bullet']::before {
    mask-image: var(--_vaadin-icon-list-bullet);
  }

  [part~='toolbar-button-align-left']::before {
    mask-image: var(--_vaadin-icon-align-left);
  }

  [part~='toolbar-button-align-center']::before {
    mask-image: var(--_vaadin-icon-align-center);
  }

  [part~='toolbar-button-align-right']::before {
    mask-image: var(--_vaadin-icon-align-right);
  }

  [part~='toolbar-button-image']::before {
    mask-image: var(--_vaadin-icon-image);
  }

  [part~='toolbar-button-link']::before {
    mask-image: var(--_vaadin-icon-link);
  }

  [part~='toolbar-button-blockquote']::before {
    mask-image: var(--_vaadin-icon-quote);
  }

  [part~='toolbar-button-code-block']::before {
    mask-image: var(--_vaadin-icon-code);
  }

  [part~='toolbar-button-clean']::before {
    mask-image: var(--_vaadin-icon-clear);
  }

  @media (forced-colors: active) {
    [part~='toolbar-button']::before {
      background: CanvasText;
    }

    [part~='toolbar-button'][on] {
      background: Highlight;
    }

    [part~='toolbar-button'][on]::before {
      background: HighlightText;
    }
  }
`;

const states = css`
  :host([readonly]) [part='toolbar'] {
    display: none;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
    -webkit-user-select: none;
    user-select: none;
  }
`;

export const richTextEditorStyles = [icons, base, content, toolbar, states];
