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
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const crudStyles = css`
  :host {
    --vaadin-grid-border-width: 0px;
    --vaadin-grid-border-radius: var(--vaadin-crud-border-radius, var(--vaadin-radius-l));
    --vaadin-crud-editor-max-height: 40%;
    --vaadin-crud-editor-max-width: 40%;
    border: var(--vaadin-crud-border-width, 1px) solid var(--vaadin-crud-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-crud-border-radius, var(--vaadin-radius-l));
    height: 400px;
    width: 100%;
    background: var(--vaadin-crud-background, var(--vaadin-background-color));
  }

  :host,
  #main {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  #main {
    flex: 1 1 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  ::slotted(vaadin-crud-grid) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  #container {
    display: flex;
    height: 100%;
  }

  :host([editor-position='bottom']) #container {
    flex-direction: column;
  }

  :host([editor-position='aside'][editor-opened]) #main {
    border-inline-end: var(--vaadin-crud-border-width, 1px) solid
      var(--vaadin-crud-border-color, var(--vaadin-border-color));
  }

  :host([editor-position='aside'][editor-opened]) ::slotted(vaadin-crud-grid) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([editor-position='aside'][editor-opened]) :is(#container, [part='editor']) {
    border-start-end-radius: inherit;
    border-end-end-radius: inherit;
  }

  :host([editor-position='bottom'][editor-opened]) #main {
    border-bottom: var(--vaadin-crud-border-width, 1px) solid
      var(--vaadin-crud-border-color, var(--vaadin-border-color));
  }

  :host([editor-position='bottom'][editor-opened]) :is(#container, [part='editor']) {
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
  }

  [part='toolbar'] {
    align-items: baseline;
    background: var(--vaadin-crud-toolbar-background, transparent);
    border-top: var(--vaadin-crud-border-width, 1px) solid var(--vaadin-crud-border-color, var(--vaadin-border-color));
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    padding: var(--vaadin-crud-toolbar-padding, var(--vaadin-padding));
  }

  :host([no-toolbar]) [part='toolbar'] {
    display: none;
  }

  [part='editor'] {
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 1;
  }

  [part='editor']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
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

  [part='header'] {
    color: var(--vaadin-crud-header-color, var(--vaadin-color));
    font-size: var(--vaadin-crud-header-font-size, 1em);
    font-weight: var(--vaadin-crud-header-font-weight, 600);
    line-height: var(--vaadin-crud-header-line-height, inherit);
    padding: var(--vaadin-crud-header-padding, var(--vaadin-padding));
  }

  ::slotted([slot='header']) {
    color: inherit !important;
    display: contents;
    font: inherit !important;
    overflow-wrap: anywhere;
  }

  ::slotted([slot='form']) {
    padding: var(--vaadin-crud-form-padding, var(--vaadin-padding));
  }

  [part='footer'] {
    background: var(--vaadin-crud-footer-background, transparent);
    border-top: var(--vaadin-crud-border-width, 1px) solid var(--vaadin-crud-border-color, var(--vaadin-border-color));
    display: flex;
    flex: none;
    gap: var(--vaadin-crud-footer-gap, var(--vaadin-gap-container-inline));
    padding: var(--vaadin-crud-footer-padding, var(--vaadin-padding));
  }

  ::slotted([slot='delete-button']) {
    margin-inline-start: auto;
  }
`;
