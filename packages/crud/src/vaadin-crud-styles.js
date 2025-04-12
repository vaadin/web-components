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

export const crudStyles = css`
  :host {
    --vaadin-crud-editor-max-height: 40%;
    --vaadin-crud-editor-max-width: 40%;
    width: 100%;
    height: 400px;
  }

  :host,
  #main {
    position: relative;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    align-self: stretch;
  }

  #main {
    height: 100%;
    flex: 1 1 100%;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  [part='toolbar'] {
    display: flex;
    flex-shrink: 0;
    align-items: baseline;
    justify-content: flex-end;
  }

  :host([no-toolbar]) [part='toolbar'] {
    display: none;
  }

  #container {
    display: flex;
    height: 100%;
  }

  :host([editor-position='bottom']) #container {
    flex-direction: column;
  }

  [part='editor'] {
    z-index: 1;
    display: flex;
    height: 100%;
    flex-direction: column;
    outline: none;
  }

  :host(:not([editor-position=''])[editor-opened]:not([fullscreen])) [part='editor'] {
    flex: 1 0 100%;
  }

  :host([editor-position='bottom'][editor-opened]:not([fullscreen])) [part='editor'] {
    max-height: var(--vaadin-crud-editor-max-height);
  }

  :host([editor-position='aside'][editor-opened]:not([fullscreen])) [part='editor'] {
    min-width: 300px;
    max-width: var(--vaadin-crud-editor-max-width);
  }

  [part='scroller'] {
    display: flex;
    overflow: auto;
    flex: auto;
    flex-direction: column;
  }

  [part='footer'] {
    display: flex;
    flex: none;
    flex-direction: row-reverse;
  }
`;

export const crudDialogOverlayStyles = css`
  [part='overlay'] {
    min-width: 20em;
    max-width: 54em;
  }

  [part='footer'] {
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  /* Make buttons clickable */
  [part='footer'] ::slotted(:not([disabled])) {
    pointer-events: all;
  }

  :host([fullscreen]) {
    padding: 0;
    inset: 0;
  }

  :host([fullscreen]) [part='overlay'] {
    width: 100vw;
    height: 100vh;
    border-radius: 0 !important;
  }

  :host([fullscreen]) [part='content'] {
    flex: 1;
  }
`;
