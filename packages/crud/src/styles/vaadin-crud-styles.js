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

export const crudStyles = css`
  :host {
    width: 100%;
    height: 400px;
    --vaadin-crud-editor-max-height: 40%;
    --vaadin-crud-editor-max-width: 40%;
  }

  :host,
  #main {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    position: relative;
    overflow: hidden;
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
    flex-direction: column;
    height: 100%;
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
    flex-direction: column;
    overflow: auto;
    flex: auto;
  }

  [part='footer'] {
    display: flex;
    flex: none;
    flex-direction: row-reverse;
  }
`;
