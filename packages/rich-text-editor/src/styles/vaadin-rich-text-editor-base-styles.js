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
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
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
    border-radius: inherit;
    contain: paint;
  }

  .vaadin-rich-text-editor-container:has([part='content']:focus-within),
  .vaadin-rich-text-editor-container:has([part~='toolbar-button']:active) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }
`;

export const content = css`
  :host {
    --_item-indent: var(--vaadin-padding-s);
    --_marker-indent: var(--vaadin-gap-s);
    --_list-indent: var(--_item-indent);
  }

  [part='content'] {
    box-sizing: border-box;
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    cursor: text;
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
    color: var(--vaadin-rich-text-editor-content-color, var(--vaadin-text-color));
    flex: 1;
    font-size: var(--vaadin-rich-text-editor-content-font-size, var(--vaadin-input-field-value-font-size, inherit));
    height: 100%;
    line-height: var(--vaadin-rich-text-editor-content-line-height, inherit);
    outline: none;
    overflow-y: auto;
    padding: var(--vaadin-rich-text-editor-content-padding, var(--vaadin-padding-container));
    tab-size: calc(var(--_item-indent) * 2);
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

  .ql-code-block-container {
    font-family: monospace;
    background-color: var(--vaadin-background-container);
    border-radius: var(--vaadin-radius-s);
    white-space: pre-wrap;
    margin-block: var(--vaadin-padding-s);
    padding: var(--vaadin-padding-container);
  }

  /* lists */
  .ql-editor ol {
    padding-inline-start: var(--_list-indent);
  }

  .ql-editor li {
    list-style-type: none;
    position: relative;
    padding-inline-start: var(--_item-indent);
  }

  .ql-editor li > .ql-ui::before {
    display: inline-block;
    width: var(--_item-indent);
    margin-inline: calc(var(--_item-indent) * -1) var(--_marker-indent);
    text-align: end;
    white-space: nowrap;
  }

  .ql-editor li[data-list='bullet'] > .ql-ui::before {
    content: '\\2022';
    font-size: 1.5rem;
    line-height: 1rem;
    align-self: baseline;
    vertical-align: text-top;
  }

  .ql-editor p,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6 {
    counter-set: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 0 */
  .ql-editor li[data-list='ordered'] {
    counter-increment: list-0;
  }

  .ql-editor li[data-list='ordered'] > .ql-ui::before {
    content: counter(list-0, decimal) '. ';
  }

  /* 1 */
  .ql-editor li[data-list='ordered'].ql-indent-1 {
    counter-increment: list-1;
  }

  .ql-editor li[data-list='ordered'].ql-indent-1 > .ql-ui::before {
    content: counter(list-1, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-1 {
    counter-set: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 2 */
  .ql-editor li[data-list='ordered'].ql-indent-2 {
    counter-increment: list-2;
  }

  .ql-editor li[data-list='ordered'].ql-indent-2 > .ql-ui::before {
    content: counter(list-2, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-2 {
    counter-set: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 3 */
  .ql-editor li[data-list='ordered'].ql-indent-3 {
    counter-increment: list-3;
  }

  .ql-editor li[data-list='ordered'].ql-indent-3 > .ql-ui::before {
    content: counter(list-3, decimal) '. ';
  }

  .ql-editor li[data-list].ql-indent-3 {
    counter-set: list-4 list-5 list-6 list-7 list-8 list-9;
  }

  /* 4 */
  .ql-editor li[data-list='ordered'].ql-indent-4 {
    counter-increment: list-4;
  }

  .ql-editor li[data-list='ordered'].ql-indent-4 > .ql-ui::before {
    content: counter(list-4, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-4 {
    counter-set: list-5 list-6 list-7 list-8 list-9;
  }

  /* 5 */
  .ql-editor li[data-list='ordered'].ql-indent-5 {
    counter-increment: list-5;
  }

  .ql-editor li[data-list='ordered'].ql-indent-5 > .ql-ui::before {
    content: counter(list-5, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-5 {
    counter-set: list-6 list-7 list-8 list-9;
  }

  /* 6 */
  .ql-editor li[data-list='ordered'].ql-indent-6 {
    counter-increment: list-6;
  }

  .ql-editor li[data-list='ordered'].ql-indent-6 > .ql-ui::before {
    content: counter(list-6, decimal) '. ';
  }

  .ql-editor li[data-list].ql-indent-6 {
    counter-set: list-7 list-8 list-9;
  }

  /* 7 */
  .ql-editor li[data-list='ordered'].ql-indent-7 {
    counter-increment: list-7;
  }

  .ql-editor li[data-list='ordered'].ql-indent-7 > .ql-ui::before {
    content: counter(list-7, lower-alpha) '. ';
  }

  .ql-editor li[data-list].ql-indent-7 {
    counter-set: list-8 list-9;
  }

  /* 8 */
  .ql-editor li[data-list='ordered'].ql-indent-8 {
    counter-increment: list-8;
  }

  .ql-editor li[data-list='ordered'].ql-indent-8 > .ql-ui::before {
    content: counter(list-8, lower-roman) '. ';
  }

  .ql-editor li[data-list].ql-indent-8 {
    counter-set: list-9;
  }

  /* indent 1 */
  .ql-editor .ql-indent-1 {
    padding-inline-start: calc(var(--_item-indent) * 2);
  }

  .ql-editor li.ql-indent-1 {
    padding-inline-start: calc(var(--_list-indent) + var(--_item-indent) * 2);
  }

  /* indent 2 */
  .ql-editor .ql-indent-2 {
    padding-inline-start: calc(var(--_item-indent) * 4);
  }

  .ql-editor li.ql-indent-2 {
    padding-inline-start: calc(var(--_list-indent) * 2 + var(--_item-indent) * 3);
  }

  /* indent 3 */
  .ql-editor .ql-indent-3 {
    padding-inline-start: calc(var(--_item-indent) * 6);
  }

  .ql-editor li.ql-indent-3 {
    padding-inline-start: calc(var(--_list-indent) * 3 + var(--_item-indent) * 4);
  }

  /* indent 4 */
  .ql-editor .ql-indent-4 {
    padding-inline-start: calc(var(--_item-indent) * 8);
  }

  .ql-editor li.ql-indent-4 {
    padding-inline-start: calc(var(--_list-indent) * 4 + var(--_item-indent) * 5);
  }

  /* indent 5 */
  .ql-editor .ql-indent-5 {
    padding-inline-start: calc(var(--_item-indent) * 10);
  }

  .ql-editor li.ql-indent-5 {
    padding-inline-start: calc(var(--_list-indent) * 5 + var(--_item-indent) * 6);
  }

  /* indent 6 */
  .ql-editor .ql-indent-6 {
    padding-inline-start: calc(var(--_item-indent) * 12);
  }

  .ql-editor li.ql-indent-6 {
    padding-inline-start: calc(var(--_list-indent) * 6 + var(--_item-indent) * 7);
  }

  /* indent 7 */
  .ql-editor .ql-indent-7 {
    padding-inline-start: calc(var(--_item-indent) * 14);
  }

  .ql-editor li.ql-indent-7 {
    padding-inline-start: calc(var(--_list-indent) * 7 + var(--_item-indent) * 8);
  }

  /* indent 8 */
  .ql-editor .ql-indent-8 {
    padding-inline-start: calc(var(--_item-indent) * 16);
  }

  .ql-editor li.ql-indent-8 {
    padding-inline-start: calc(var(--_list-indent) * 8 + var(--_item-indent) * 9);
  }
  /* quill core end */

  blockquote {
    border-inline-start: 4px solid var(--vaadin-border-color-secondary);
    margin: var(--vaadin-padding-container);
    padding-inline-start: var(--vaadin-padding-s);
  }

  code {
    background-color: var(--vaadin-background-container);
    border-radius: var(--vaadin-radius-s);
    padding: 0.125rem 0.25rem;
  }

  img {
    max-width: 100%;
  }

  .ql-editor > :is(p, ol, ul, blockquote, .ql-code-block-container):first-child {
    margin-top: 0;
  }

  .ql-editor > :is(p, ol, ul, blockquote, .ql-code-block-container):last-child {
    margin-bottom: 0;
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
    gap: var(--vaadin-rich-text-editor-toolbar-gap, var(--vaadin-gap-s));
    padding: var(--vaadin-rich-text-editor-toolbar-padding, var(--vaadin-padding-s));
  }

  [part~='toolbar-group'] {
    display: flex;
  }

  [part~='toolbar-button'] {
    background: var(--vaadin-rich-text-editor-toolbar-button-background, var(--vaadin-background-container));
    border: var(--vaadin-rich-text-editor-toolbar-button-border-width, 1px) solid
      var(--vaadin-rich-text-editor-toolbar-button-border-color, transparent);
    border-radius: var(--vaadin-rich-text-editor-toolbar-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-rich-text-editor-toolbar-button-text-color, var(--vaadin-text-color));
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
    background: currentColor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
    mask-size: var(--vaadin-icon-visual-size, 100%);
    mask-repeat: no-repeat;
    mask-position: 50%;
  }

  [part~='toolbar-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
    z-index: 1;
  }

  [part~='toolbar-button-pressed'],
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

  [part~='toolbar-button-outdent']::before {
    mask-image: var(--_vaadin-icon-outdent);
  }

  [part~='toolbar-button-indent']::before {
    mask-image: var(--_vaadin-icon-indent);
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

    [part~='toolbar-button-pressed'] {
      background: Highlight;
    }

    [part~='toolbar-button-pressed']::before {
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
