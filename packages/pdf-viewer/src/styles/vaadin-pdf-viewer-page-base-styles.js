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

export const pdfViewerPageStyles = css`
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
   * Text layer, adapted from pdf_viewer.css of pdf.js 6.4.299 (Apache License
   * 2.0, Copyright Mozilla Foundation). The text is transparent and placed over
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
    /* The page is white paper, so use the light system colors (Highlight)
       also in a dark color scheme. */
    color-scheme: only light;
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
    user-select: text;
  }

  .text-layer > :not(.markedContent, .link, .link-text),
  .text-layer .markedContent span:not(.markedContent, .link-text) {
    z-index: 1;
    --font-height: 0;
    font-size: calc(var(--text-scale-factor) * var(--font-height));
    --scale-x: 1;
    --rotate: 0deg;
    transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
  }

  /* Unlike in pdf.js, marked content has a box that covers the page. Chrome
     ignores the aria-owns of the structure tree for elements without a box.
     As it has the size of the page, the text in it keeps its position. */
  .text-layer .markedContent {
    inset: 0;
    pointer-events: none;
  }

  .text-layer .markedContent > :not(.markedContent) {
    pointer-events: auto;
  }

  /* The text next to a link, for assistive technology only, see placeLinks().
     Generated content is not selected, copied or found with the text of the page. */
  .text-layer .link-text {
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    user-select: none;
  }

  .text-layer .link-text::before {
    content: attr(data-text);
  }

  .text-layer ::selection {
    color: transparent;
    /* The system color, which is translucent where the system needs it */
    background: var(--vaadin-pdf-viewer-selection-background, Highlight);
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

  .text-layer.selecting .end-of-content {
    top: 0;
  }

  /* The text and link layers have the size of the page without its rotation, and rotate with the page. */
  :is(.text-layer, .link-layer)[data-main-rotation='90'] {
    transform: rotate(90deg) translateY(-100%);
  }

  :is(.text-layer, .link-layer)[data-main-rotation='180'] {
    transform: rotate(180deg) translate(-100%, -100%);
  }

  :is(.text-layer, .link-layer)[data-main-rotation='270'] {
    transform: rotate(270deg) translateX(-100%);
  }

  /* The structure of tagged PDFs, for assistive technology only. It owns the text layer elements. */
  .struct-tree {
    position: absolute;
    inset: 0;
    contain: strict;
    pointer-events: none;
  }

  .link-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform-origin: 0 0;
    pointer-events: none;
  }

  /* Links are in the text layer, next to their text, or in the link layer when they have no text */
  .link {
    position: absolute;
    z-index: 2;
    pointer-events: auto;
    cursor: var(--vaadin-clickable-cursor, pointer);
  }

  .link:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  @media (forced-colors: active) {
    /* Pages lose their shadow in forced colors */
    [part='page'] {
      outline: 1px solid CanvasText;
    }
  }
`;
