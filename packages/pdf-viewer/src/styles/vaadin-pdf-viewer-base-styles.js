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

  [part='find-bar'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--vaadin-gap-xs);
    padding: var(--vaadin-pdf-viewer-toolbar-padding, var(--vaadin-padding-xs));
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
  }

  [part='find-bar'][hidden] {
    display: none;
  }

  .find-actions {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  ::slotted(span[slot='find-actions']) {
    min-width: 5em;
    margin-inline: var(--vaadin-gap-s);
    text-align: center;
    white-space: nowrap;
  }

  ::slotted(vaadin-text-field) {
    width: var(--vaadin-pdf-viewer-find-field-width, 14em);
    max-width: 100%;
  }

  [part='toolbar-group'] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100%;
    align-items: center;
    gap: var(--vaadin-gap-xs);
  }

  ::slotted(vaadin-integer-field) {
    width: var(--vaadin-pdf-viewer-page-field-width, 6em);
  }

  ::slotted(vaadin-select) {
    width: var(--vaadin-pdf-viewer-zoom-select-width, 10em);
    max-width: 100%;
  }

  [part='content'] {
    position: relative;
    outline: none;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
    padding: var(--vaadin-pdf-viewer-padding, var(--vaadin-padding-m));
  }

  .main {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    container-type: inline-size;
  }

  [part='sidebar'] {
    display: flex;
    flex-direction: column;
    flex: none;
    width: var(--vaadin-pdf-viewer-sidebar-width, 10rem);
    border-inline-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-sidebar-background, var(--vaadin-background-color));
  }

  [part='sidebar'][hidden] {
    display: none;
  }

  /* On narrow viewers, the sidebar covers the pages instead of taking space from them. */
  @container (max-width: 30rem) {
    [part='sidebar'] {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      z-index: 2;
      box-shadow: var(--vaadin-pdf-viewer-sidebar-shadow, 0 0 8px rgba(0, 0, 0, 0.2));
    }
  }

  [part='sidebar-header'] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--vaadin-gap-xs);
    padding: var(--vaadin-padding-xs);
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
  }

  [part='sidebar-header'][hidden],
  [part='thumbnails'][hidden],
  [part='outline'][hidden] {
    display: none;
  }

  [part='outline'] {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: var(--vaadin-padding-xs);
  }

  [part='outline-item'] {
    outline: none;
  }

  [part='outline-item-content'] {
    display: flex;
    align-items: flex-start;
    gap: var(--vaadin-gap-xs);
    padding: var(--vaadin-padding-xs);
    padding-inline-start: calc(var(--_level) * var(--vaadin-pdf-viewer-outline-indent, 1em) + var(--vaadin-padding-xs));
    border-radius: var(--vaadin-radius-s);
    cursor: var(--vaadin-clickable-cursor);
    font-size: var(--vaadin-pdf-viewer-outline-font-size, 0.875em);
    line-height: 1.4;
  }

  [part='outline-item']:focus-visible > [part='outline-item-content'] {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part='outline-item'][aria-disabled='true'] > [part='outline-item-content'] {
    cursor: default;
  }

  @media (any-hover: hover) {
    [part='outline-item-content']:hover {
      background: var(--vaadin-background-container);
    }
  }

  [part='outline-toggle'] {
    flex: none;
    width: 1lh;
    height: 1lh;
    background: currentColor;
    mask: var(--_vaadin-icon-chevron-right) 50% / 80% no-repeat;
  }

  [part='outline-toggle'][expanded] {
    rotate: 90deg;
  }

  [part='outline-toggle']:dir(rtl):not([expanded]) {
    scale: -1 1;
  }

  [part='outline-toggle'][hidden] {
    display: block;
    visibility: hidden;
  }

  @media (forced-colors: active) {
    [part='outline-toggle'] {
      background: CanvasText;
    }
  }

  [part='thumbnails'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--vaadin-gap-s);
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: var(--vaadin-padding-s);
    outline: none;
  }

  [part~='thumbnail'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    flex: none;
    padding: var(--vaadin-padding-xs);
    border-radius: var(--vaadin-radius-m);
    cursor: var(--vaadin-clickable-cursor);
    font-size: var(--vaadin-pdf-viewer-thumbnail-font-size, 0.875em);
    color: var(--vaadin-text-color-secondary);
  }

  @media (any-hover: hover) {
    [part~='thumbnail']:hover:not([part~='current']) {
      background: var(--vaadin-background-container);
    }
  }

  [part~='thumbnail']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part~='thumbnail'][part~='current'] {
    background: var(--vaadin-pdf-viewer-thumbnail-current-background, var(--vaadin-background-container-strong));
    color: var(--vaadin-text-color);
    font-weight: 600;
  }

  /* Not only a background color, which can have low contrast */
  [part~='thumbnail'][part~='current'] .thumbnail-image {
    outline: 2px solid var(--vaadin-pdf-viewer-thumbnail-current-color, var(--vaadin-text-color));
    outline-offset: 2px;
  }

  @media (forced-colors: active) {
    [part~='thumbnail'][part~='current'] .thumbnail-image {
      outline-color: Highlight;
    }
  }

  .thumbnail-image {
    width: 96px;
    direction: ltr;
    background: var(--vaadin-pdf-viewer-page-background, #fff);
    box-shadow: var(--vaadin-pdf-viewer-page-shadow, 0 0 0 1px var(--vaadin-border-color-secondary));
  }

  .thumbnail-image canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  [part='print-progress'] {
    position: absolute;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--vaadin-gap-s);
    width: min(20rem, 80%);
    padding: var(--vaadin-padding-l);
    border-radius: var(--vaadin-radius-l);
    background: var(--vaadin-background-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  [part='print-progress'][hidden] {
    display: none;
  }

  ::slotted(vaadin-progress-bar) {
    width: 100%;
  }

  .content-area {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }

  /* Drawn over the pages, which would cover an outline of the scroll container itself */
  .content-focus-ring {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  [part='content']:focus-visible + .content-focus-ring {
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
   * Text layer, adapted from pdf_viewer.css of pdf.js 6.3.289 (Apache License
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

  .text-layer > :not(.markedContent, .link),
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
    background: var(--vaadin-pdf-viewer-selection-background, color-mix(in srgb, Highlight 40%, transparent));
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

  .find-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* Keeps the text under the highlights readable */
    mix-blend-mode: multiply;
  }

  .find-match {
    position: absolute;
    border-radius: 2px;
    background: var(--vaadin-pdf-viewer-match-background, color-mix(in srgb, Mark 40%, transparent));
  }

  /* Orange, like the current match of browser find, with an outline of at least 3:1 contrast */
  .find-match.current {
    background: var(--vaadin-pdf-viewer-current-match-background, #ff9632);
    outline: 2px solid color-mix(in srgb, #ff9632, black 50%);
  }

  @media (forced-colors: active) {
    .find-layer {
      mix-blend-mode: normal;
    }

    .find-match {
      forced-color-adjust: none;
      background: transparent;
      outline: 1px solid Highlight;
    }

    .find-match.current {
      background: transparent;
      outline: 3px solid Highlight;
    }
  }

  .link-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
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
