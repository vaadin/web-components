/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { contentStyles } from './vaadin-rich-text-editor-content-styles.js';
import { toolbarStyles } from './vaadin-rich-text-editor-toolbar-styles.js';

export const baseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  .announcer {
    position: fixed;
    clip: rect(0, 0, 0, 0);
  }

  input[type='file'] {
    display: none;
  }

  .vaadin-rich-text-editor-container {
    display: flex;
    flex-direction: column;
    min-height: inherit;
    max-height: inherit;
    flex: auto;
  }
`;

export const statesStyles = css`
  :host([readonly]) [part='toolbar'] {
    display: none;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  :host([disabled]) [part~='toolbar-button'] {
    background-color: transparent;
  }
`;

export const richTextEditorStyles = [baseStyles, contentStyles, toolbarStyles, statesStyles];
