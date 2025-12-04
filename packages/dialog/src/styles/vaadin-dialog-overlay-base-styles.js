/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

export const dialogOverlayBase = css`
  /* Optical centering */
  :host::before,
  :host::after {
    content: '';
    flex-basis: 0;
    flex-grow: 1;
  }

  :host::after {
    flex-grow: 1.1;
  }

  :host {
    cursor: default;
  }

  [part='overlay']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='overlay'] {
    background: var(--vaadin-dialog-background, var(--vaadin-overlay-background, var(--vaadin-background-color)));
    background-origin: border-box;
    border: var(--vaadin-dialog-border-width, var(--vaadin-overlay-border-width, 1px)) solid
      var(--vaadin-dialog-border-color, var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary)));
    box-shadow: var(--vaadin-dialog-shadow, var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3)));
    border-radius: var(--vaadin-dialog-border-radius, var(--vaadin-radius-l));
    width: max-content;
    min-width: min(var(--vaadin-dialog-min-width, 4em), 100%);
    max-width: min(var(--vaadin-dialog-max-width, 100%), 100%);
    max-height: 100%;
  }

  [part='header'],
  [part='header-content'],
  [part='footer'] {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex: none;
    pointer-events: none;
    z-index: 1;
    gap: var(--vaadin-dialog-toolbar-gap, var(--vaadin-gap-s));
  }

  ::slotted(*) {
    pointer-events: auto;
  }

  [part='header'],
  [part='content'],
  [part='footer'] {
    padding: var(--vaadin-dialog-padding, var(--vaadin-padding-l));
  }

  :host([theme~='no-padding']) [part='content'] {
    padding: 0 !important;
  }

  :host(:is([has-header], [has-title])) [part='content'] {
    padding-top: 0;
  }

  :host([has-footer]) [part='content'] {
    padding-bottom: 0;
  }

  [part='header'] {
    flex-wrap: nowrap;
  }

  ::slotted([slot='header-content']),
  ::slotted([slot='title']),
  ::slotted([slot='footer']) {
    display: contents;
  }

  ::slotted([slot='title']) {
    font: inherit !important;
    color: inherit !important;
    overflow-wrap: anywhere;
  }

  [part='title'] {
    color: var(--vaadin-dialog-title-color, var(--vaadin-text-color));
    font-weight: var(--vaadin-dialog-title-font-weight, 600);
    font-size: var(--vaadin-dialog-title-font-size, 1em);
    line-height: var(--vaadin-dialog-title-line-height, inherit);
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
`;

const dialogResizableOverlay = css`
  [part='overlay'] {
    position: relative;
    overflow: visible;
    display: flex;
  }

  :host([has-bounds-set]) [part='overlay'] {
    min-width: 0;
    max-width: none;
    max-height: none;
  }

  /* Content part scrolls by default */
  [part='content'] {
    flex: 1;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    clip-path: border-box;
  }

  [part='header'],
  :host(:not([has-header])) [part='content'] {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  [part='footer'],
  :host(:not([has-footer])) [part='content'] {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .resizer-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 100%;
    border-radius: calc(
      var(--vaadin-dialog-border-radius, var(--vaadin-radius-l)) - var(
          --vaadin-dialog-border-width,
          var(--vaadin-overlay-border-width, 1px)
        )
    );
  }

  :host(:not([resizable])) .resizer {
    display: none;
  }

  .resizer {
    position: absolute;
    height: 16px;
    width: 16px;
  }

  .resizer.edge {
    height: 8px;
    width: 8px;
    inset: -4px;
  }

  .resizer.edge.n {
    width: auto;
    bottom: auto;
    cursor: ns-resize;
  }

  .resizer.ne {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
  }

  .resizer.edge.e {
    height: auto;
    left: auto;
    cursor: ew-resize;
  }

  .resizer.se {
    bottom: -4px;
    right: -4px;
    cursor: nwse-resize;
  }

  .resizer.edge.s {
    width: auto;
    top: auto;
    cursor: ns-resize;
  }

  .resizer.sw {
    bottom: -4px;
    left: -4px;
    cursor: nesw-resize;
  }

  .resizer.edge.w {
    height: auto;
    right: auto;
    cursor: ew-resize;
  }

  .resizer.nw {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
  }
`;

export const dialogOverlayStyles = [overlayStyles, dialogOverlayBase, dialogResizableOverlay];
