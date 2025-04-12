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
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { contentStyles } from './vaadin-rich-text-editor-content-styles.js';
import { toolbarStyles } from './vaadin-rich-text-editor-toolbar-styles.js';

export const baseStyles = css`
  :host {
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
  }
`;

export const statesStyles = css`
  :host([readonly]) [part='toolbar'] {
    display: none;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
  }

  :host([disabled]) [part~='toolbar-button'] {
    background-color: transparent;
  }
`;

export const richTextEditorStyles = [baseStyles, contentStyles, toolbarStyles, statesStyles];
