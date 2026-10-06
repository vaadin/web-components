/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/styles/loader-styles.js';

const pdfViewerBaseStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 400px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-pdf-viewer-border-radius, var(--vaadin-radius-m));
    background: var(--vaadin-pdf-viewer-background, var(--vaadin-background-container));
    color: var(--vaadin-pdf-viewer-text-color, var(--vaadin-text-color));
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='toolbar'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--vaadin-pdf-viewer-toolbar-gap, var(--vaadin-gap-s));
    padding: var(--vaadin-pdf-viewer-toolbar-padding, var(--vaadin-padding-xs));
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
  }

  [part='toolbar-group'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  ::slotted(vaadin-integer-field) {
    width: var(--vaadin-pdf-viewer-page-field-width, 6em);
  }

  ::slotted(vaadin-select) {
    width: var(--vaadin-pdf-viewer-zoom-select-width, 9em);
  }

  [part='content'] {
    position: relative;
    outline: none;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
    padding: var(--vaadin-pdf-viewer-padding, var(--vaadin-padding-m));
  }

  [part='content']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  #pages {
    display: flex;
    flex-direction: column;
    /* Pages wider than the view start at the edge, so that they can be scrolled to both edges. */
    align-items: safe center;
    gap: var(--vaadin-pdf-viewer-page-gap, var(--vaadin-gap-m));
  }

  [part='page'] {
    position: relative;
    flex: none;
    /* PDF content is laid out left to right. pdf.js draws text glyph by glyph,
       which goes wrong when the canvas inherits a right-to-left direction. */
    direction: ltr;
    /* Used by the text layer of pdf.js */
    --scale-round-x: 1px;
    --scale-round-y: 1px;
    /* Pages are paper: white unless the document paints a background itself. */
    background: var(--vaadin-pdf-viewer-page-background, #fff);
    box-shadow: var(--vaadin-pdf-viewer-page-shadow, 0 0 0 1px var(--vaadin-border-color-secondary));
  }

  [part='page'] canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /*
   * Text layer, adapted from pdf_viewer.css of pdf.js (Apache License 2.0,
   * Copyright Mozilla Foundation). The text is transparent and placed over
   * the same text on the canvas, so that it can be selected and read by
   * assistive technology.
   */
  .text-layer {
    position: absolute;
    inset: 0;
    overflow: clip;
    line-height: 1;
    text-align: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-size-adjust: none;
    forced-color-adjust: none;
    transform-origin: 0 0;
    caret-color: CanvasText;
    z-index: 0;
    --min-font-size: 1;
    --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
    --min-font-size-inv: calc(1 / var(--min-font-size));
  }

  .text-layer :is(span, br) {
    position: absolute;
    color: transparent;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }

  .text-layer > :not(.markedContent),
  .text-layer .markedContent span:not(.markedContent) {
    z-index: 1;
    --font-height: 0;
    font-size: calc(var(--text-scale-factor) * var(--font-height));
    --scale-x: 1;
    --rotate: 0deg;
    transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
  }

  .text-layer .markedContent {
    display: contents;
  }

  .text-layer ::selection {
    color: transparent;
    background: var(
      --vaadin-pdf-viewer-selection-background,
      color-mix(in srgb, var(--vaadin-focus-ring-color) 35%, transparent)
    );
  }

  .text-layer br::selection {
    background: transparent;
  }

  /* Keeps the selection from jumping to other pages when dragging over empty space. */
  .text-layer .end-of-content {
    display: block;
    position: absolute;
    inset: 100% 0 0;
    z-index: 0;
    cursor: default;
    user-select: none;
  }

  .text-layer:active .end-of-content {
    top: 0;
  }

  .link-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .link-layer a {
    position: absolute;
    pointer-events: auto;
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  .link-layer a:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  [part='loader'] {
    position: absolute;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
  }

  [part='error-message'] {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--vaadin-padding-l);
    overflow: auto;
    overflow-wrap: anywhere;
    text-align: center;
    color: var(--vaadin-pdf-viewer-error-color, var(--vaadin-text-color-secondary));
  }

  [part='error-message'][hidden] {
    display: none;
  }
`;

export const pdfViewerStyles = [loaderStyles, pdfViewerBaseStyles];
