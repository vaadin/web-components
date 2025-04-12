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
    height: 400px;
    width: 100%;
  }

  :host,
  #main {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  #main {
    flex: 1 1 100%;
    height: 100%;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  [part='toolbar'] {
    align-items: baseline;
    display: flex;
    flex-shrink: 0;
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
    display: flex;
    flex-direction: column;
    height: 100%;
    outline: none;
    z-index: 1;
  }

  :host(:not([editor-position=''])[editor-opened]:not([fullscreen])) [part='editor'] {
    flex: 1 0 100%;
  }

  :host([editor-position='bottom'][editor-opened]:not([fullscreen])) [part='editor'] {
    max-height: var(--vaadin-crud-editor-max-height);
  }

  :host([editor-position='aside'][editor-opened]:not([fullscreen])) [part='editor'] {
    max-width: var(--vaadin-crud-editor-max-width);
    min-width: 300px;
  }

  [part='scroller'] {
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: auto;
  }

  [part='footer'] {
    display: flex;
    flex: none;
    flex-direction: row-reverse;
  }
`;

export const crudDialogOverlayStyles = css`
  [part='overlay'] {
    max-width: 54em;
    min-width: 20em;
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
    inset: 0;
    padding: 0;
  }

  :host([fullscreen]) [part='overlay'] {
    border-radius: 0 !important;
    height: 100vh;
    width: 100vw;
  }

  :host([fullscreen]) [part='content'] {
    flex: 1;
  }
`;
