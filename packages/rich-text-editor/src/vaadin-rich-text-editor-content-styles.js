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
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const contentStyles = css`
  [part='content'] {
    position: relative;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    flex: auto;
    flex-direction: column;
  }

  /*
    Quill core styles.
    CSS selectors removed: margin & padding reset, check list, indentation, video, colors, ordered & unordered list, h1-6, anchor
  */
  .ql-clipboard {
    position: absolute;
    top: 50%;
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
  }

  .ql-clipboard p {
    padding: 0;
    margin: 0;
  }

  .ql-editor {
    height: 100%;
    box-sizing: border-box;
    flex: 1;
    padding: 0.75em 1em;
    line-height: 1.42;
    outline: none;
    overflow-y: auto;
    -moz-tab-size: 4;
    tab-size: 4;
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
    padding-left: 1em;
    border-left: 0.25em solid #ccc;
    margin-top: 0.3125em;
    margin-bottom: 0.3125em;
  }

  code,
  pre {
    border-radius: 0.1875em;
    background-color: #f0f0f0;
  }

  pre {
    padding: 0.3125em 0.625em;
    margin-top: 0.3125em;
    margin-bottom: 0.3125em;
    white-space: pre-wrap;
  }

  code {
    padding: 0.125em 0.25em;
    font-size: 85%;
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

// Register a module with ID for backwards compatibility.
registerStyles('', contentStyles, { moduleId: 'vaadin-rich-text-editor-content-styles' });
