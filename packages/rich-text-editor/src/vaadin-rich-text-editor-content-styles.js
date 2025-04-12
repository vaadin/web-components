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
    display: flex;
    position: relative;
    box-sizing: border-box;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
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
    margin: 0;
    padding: 0;
  }

  .ql-editor {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    padding: 0.75em 1em;
    overflow-y: auto;
    outline: none;
    line-height: 1.42;
    text-align: left;
    word-wrap: break-word;
    white-space: pre-wrap;
    -moz-tab-size: 4;
    tab-size: 4;
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
    margin-top: 0.3125em;
    margin-bottom: 0.3125em;
    padding-left: 1em;
    border-left: 0.25em solid #ccc;
  }

  code,
  pre {
    border-radius: 0.1875em;
    background-color: #f0f0f0;
  }

  pre {
    margin-top: 0.3125em;
    margin-bottom: 0.3125em;
    padding: 0.3125em 0.625em;
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
