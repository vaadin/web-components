/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const dialogOverlay = css`
  [part='header'],
  [part='header-content'],
  [part='footer'] {
    display: flex;
    z-index: 1;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    pointer-events: none;
  }

  [part='header'] {
    flex-wrap: nowrap;
  }

  ::slotted([slot='header-content']),
  ::slotted([slot='title']),
  ::slotted([slot='footer']) {
    display: contents;
    pointer-events: auto;
  }

  ::slotted([slot='title']) {
    font: inherit !important;
    overflow-wrap: anywhere;
  }

  [part='header-content'] {
    flex: 1;
  }

  :host([has-title]) [part='header-content'],
  [part='footer'] {
    justify-content: flex-end;
  }

  :host(:not([has-title]):not([has-header])) [part='header'],
  :host(:not([has-header])) [part='header-content'],
  :host(:not([has-title])) [part='title'],
  :host(:not([has-footer])) [part='footer'] {
    display: none !important;
  }

  :host(:is([has-title], [has-header], [has-footer])) [part='content'] {
    height: auto;
  }

  @media (min-height: 320px) {
    :host(:is([has-title], [has-header], [has-footer])) .resizer-container {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    :host(:is([has-title], [has-header], [has-footer])) [part='content'] {
      flex: 1;
      overflow: auto;
    }
  }

  /*
      NOTE(platosha): Make some min-width to prevent collapsing of the content
      taking the parent width, e. g., <vaadin-grid> and such.
    */
  [part='content'] {
    min-width: 12em; /* matches the default <vaadin-text-field> width */
  }

  :host([has-bounds-set]) [part='overlay'] {
    max-width: none;
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      outline: 3px solid !important;
    }
  }
`;

export const resizableOverlay = css`
  [part='overlay'] {
    display: flex;
    position: relative;
    max-height: 100%;
    overflow: visible;
  }

  [part='content'] {
    box-sizing: border-box;
    height: 100%;
  }

  .resizer-container {
    flex-grow: 1;
    overflow: auto;
    border-radius: inherit; /* prevent child elements being drawn outside part=overlay */
  }

  [part='overlay'][style] .resizer-container {
    width: 100%;
    min-height: 100%;
  }

  :host(:not([resizable])) .resizer {
    display: none;
  }

  :host([resizable]) [part='title'] {
    cursor: move;
    -webkit-user-select: none;
    user-select: none;
  }

  .resizer {
    position: absolute;
    width: 16px;
    height: 16px;
  }

  .resizer.edge {
    width: 8px;
    height: 8px;
    inset: -4px;
  }

  .resizer.edge.n {
    bottom: auto;
    width: auto;
    cursor: ns-resize;
  }

  .resizer.ne {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
  }

  .resizer.edge.e {
    left: auto;
    height: auto;
    cursor: ew-resize;
  }

  .resizer.se {
    right: -4px;
    bottom: -4px;
    cursor: nwse-resize;
  }

  .resizer.edge.s {
    top: auto;
    width: auto;
    cursor: ns-resize;
  }

  .resizer.sw {
    bottom: -4px;
    left: -4px;
    cursor: nesw-resize;
  }

  .resizer.edge.w {
    right: auto;
    height: auto;
    cursor: ew-resize;
  }

  .resizer.nw {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
  }
`;
