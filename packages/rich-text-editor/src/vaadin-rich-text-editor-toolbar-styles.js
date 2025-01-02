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
import { iconsStyles } from './vaadin-rich-text-editor-icons.js';

export const buttonsStyles = css`
  [part='toolbar'] {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  [part~='toolbar-button'] {
    width: 2em;
    height: 2em;
    margin: 0;
    padding: 0;
    font: inherit;
    line-height: 1;
    text-transform: none;
    background: transparent;
    border: none;
    position: relative;
  }

  [part~='toolbar-button']:hover {
    outline: none;
  }

  @media (forced-colors: active) {
    [part~='toolbar-button']:focus,
    [part~='toolbar-button']:hover {
      outline: 1px solid !important;
    }

    [part~='toolbar-button'][on] {
      outline: 2px solid;
      outline-offset: -1px;
    }
  }

  [part~='toolbar-button']::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  [part~='toolbar-button-undo']::before,
  [part~='toolbar-button-redo']::before,
  [part~='toolbar-button-list-ordered']::before,
  [part~='toolbar-button-list-bullet']::before,
  [part~='toolbar-button-align-left']::before,
  [part~='toolbar-button-align-center']::before,
  [part~='toolbar-button-align-right']::before,
  [part~='toolbar-button-image']::before,
  [part~='toolbar-button-link']::before,
  [part~='toolbar-button-clean']::before {
    font-family: 'vaadin-rte-icons', sans-serif;
  }

  [part~='toolbar-group'] {
    display: flex;
    margin: 0 0.5em;
  }

  [part~='toolbar-button-bold']::before {
    content: 'B';
    font-weight: 700;
  }

  [part~='toolbar-button-italic']::before {
    content: 'I';
    font-style: italic;
  }

  [part~='toolbar-button-underline']::before {
    content: 'U';
    text-decoration: underline;
  }

  [part~='toolbar-button-strike']::before {
    content: 'T';
    text-decoration: line-through;
  }

  [part~='toolbar-button-h1']::before {
    content: 'H1';
    font-size: 1.25em;
  }

  [part~='toolbar-button-h2']::before {
    content: 'H2';
    font-size: 1em;
  }

  [part~='toolbar-button-h3']::before {
    content: 'H3';
    font-size: 0.875em;
  }

  [part~='toolbar-button-h1']::before,
  [part~='toolbar-button-h2']::before,
  [part~='toolbar-button-h3']::before {
    letter-spacing: -0.05em;
  }

  [part~='toolbar-button-subscript']::before,
  [part~='toolbar-button-superscript']::before {
    content: 'X';
  }

  [part~='toolbar-button-subscript']::after,
  [part~='toolbar-button-superscript']::after {
    content: '2';
    position: absolute;
    top: 50%;
    left: 70%;
    font-size: 0.625em;
  }

  [part~='toolbar-button-superscript']::after {
    top: 20%;
  }

  [part~='toolbar-button-blockquote']::before {
    content: '\\201D';
    font-size: 2em;
    height: 0.6em;
  }

  [part~='toolbar-button-code-block']::before {
    content: '</>';
    font-size: 0.875em;
  }

  [part~='toolbar-button-background']::before,
  [part~='toolbar-button-color']::before {
    content: 'A';
    font-size: 1em;
  }

  [part~='toolbar-button-color']::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 25%;
    right: 25%;
    width: 50%;
    height: 4px;
    background-color: var(--_color-value, currentColor);
  }

  [part~='toolbar-button-background']::before {
    z-index: 1;
  }

  [part~='toolbar-button-background']::after {
    content: '';
    position: absolute;
    inset: 20%;
    background: repeating-linear-gradient(
      135deg,
      var(--_background-value, currentColor),
      var(--_background-value, currentColor) 1px,
      transparent 1px,
      transparent 2px
    );
  }
`;

export const toolbarStyles = [iconsStyles, buttonsStyles];

// Register a module with ID for backwards compatibility.
registerStyles('', toolbarStyles, { moduleId: 'vaadin-rich-text-editor-toolbar-styles' });
