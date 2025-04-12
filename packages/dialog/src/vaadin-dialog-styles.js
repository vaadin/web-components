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
    align-items: center;
    display: flex;
    flex: none;
    flex-wrap: wrap;
    pointer-events: none;
    z-index: 1;
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
    max-height: 100%;
    overflow: visible;
    position: relative;
  }

  [part='content'] {
    box-sizing: border-box;
    height: 100%;
  }

  .resizer-container {
    border-radius: inherit; /* prevent child elements being drawn outside part=overlay */
    flex-grow: 1;
    overflow: auto;
  }

  [part='overlay'][style] .resizer-container {
    min-height: 100%;
    width: 100%;
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
    height: 16px;
    position: absolute;
    width: 16px;
  }

  .resizer.edge {
    height: 8px;
    inset: -4px;
    width: 8px;
  }

  .resizer.edge.n {
    bottom: auto;
    cursor: ns-resize;
    width: auto;
  }

  .resizer.ne {
    cursor: nesw-resize;
    right: -4px;
    top: -4px;
  }

  .resizer.edge.e {
    cursor: ew-resize;
    height: auto;
    left: auto;
  }

  .resizer.se {
    bottom: -4px;
    cursor: nwse-resize;
    right: -4px;
  }

  .resizer.edge.s {
    cursor: ns-resize;
    top: auto;
    width: auto;
  }

  .resizer.sw {
    bottom: -4px;
    cursor: nesw-resize;
    left: -4px;
  }

  .resizer.edge.w {
    cursor: ew-resize;
    height: auto;
    right: auto;
  }

  .resizer.nw {
    cursor: nwse-resize;
    left: -4px;
    top: -4px;
  }
`;
