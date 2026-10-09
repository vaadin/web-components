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

  /* The toolbar and the find bar take the height they need, but scroll when
     the pages would get less than their minimum height, e.g. with large text. */
  .header {
    flex: 0 1 auto;
    overflow-y: auto;
    container-type: inline-size;
    /* Keeps the focus ring of a control that is scrolled into view visible */
    scroll-padding-block: calc(var(--vaadin-focus-ring-width) * 2 + 2px);
  }

  /* The name in the middle, the button that collapses the toolbar at the end */
  [part='file-name'] {
    display: grid;
    grid-template-columns: 1fr minmax(0, max-content) 1fr;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    padding: var(--vaadin-padding-xs) var(--vaadin-padding-s);
    border-block-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-toolbar-background, var(--vaadin-background-color));
  }

  /* The full name is in the title, for names that don't fit */
  .file-name-text {
    grid-column: 2;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* No extra space around the button, so that the row is not taller than the name needs */
  ::slotted([slot='toolbar-toggle']) {
    grid-column: 3;
    justify-self: end;
    margin-block: 0;
  }

  [part='file-name'][hidden] {
    display: none;
  }

  /* Navigation at the start, viewing options in the middle and actions at the end */
  [part='toolbar'] {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
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

  [part='toolbar'][hidden],
  [part='find-bar'][hidden] {
    display: none;
  }

  .find-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    max-width: 100%;
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

  .navigation {
    grid-column: 1;
    justify-self: start;
  }

  .viewing {
    grid-column: 2;
    justify-self: center;
  }

  .actions {
    grid-column: 3;
    justify-self: end;
  }

  /* When the groups don't fit next to each other, they wrap and start from the
     start edge, with more space between the groups than between their controls. */
  @container (max-width: 41rem) {
    [part='toolbar'] {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      column-gap: var(--vaadin-gap-l);
    }

    [part='toolbar-group'],
    [part='find-bar'],
    .find-actions {
      justify-content: flex-start;
    }
  }

  /* The zoom select with its buttons looks like one field with step buttons. */
  [part~='zoom-controls'] {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    background: var(--vaadin-input-field-background, var(--vaadin-background-color));
  }

  [part~='zoom-controls'][part~='disabled'] {
    border-color: transparent;
    background: var(--vaadin-input-field-disabled-background, var(--vaadin-background-container-strong));
  }

  /* The box draws the background and the border of the select, also when disabled. */
  ::slotted(vaadin-select[slot='toolbar-zoom']) {
    flex: 0 1 auto;
    min-width: 0;
    --vaadin-input-field-background: transparent;
    --vaadin-input-field-disabled-background: transparent;
    --vaadin-input-field-invalid-background: transparent;
    --vaadin-input-field-border-width: 0px;
    --vaadin-input-field-border-color: transparent;
  }

  /* The buttons take the height of the select, like the step buttons of a number field */
  ::slotted(vaadin-pdf-viewer-button[slot='toolbar-zoom']) {
    height: auto;
    min-height: 0;
    margin-block: 0;
    padding-block: 0;
  }

  /* Next to the page field, so that the toolbar keeps its height */
  ::slotted([slot='page-error']) {
    align-self: center;
    font-size: var(--vaadin-input-field-error-font-size, 0.875em);
    color: var(--vaadin-input-field-error-color, var(--vaadin-text-color));
  }

  /* Kept for assistive technology while empty, so that the error is announced when it appears */
  ::slotted([slot='page-error']:empty) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  /* Wide enough for the page number, at least two digits for a page that was mistyped, and the page count after it, e.g. "12 / 34" */
  ::slotted(vaadin-integer-field) {
    width: var(--vaadin-pdf-viewer-page-field-width, calc((2 * var(--_page-digits, 1) + 2) * 1ch + 1.5em));
  }

  ::slotted(vaadin-select) {
    width: var(--vaadin-pdf-viewer-zoom-select-width, 10em);
    max-width: 100%;
  }

  [part='content'] {
    position: relative;
    outline: none;
    /* Pinching zooms the pages instead of the page of the application */
    touch-action: pan-x pan-y;
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
    /* Takes the height left by the toolbar, see .header */
    flex: 1 1 0;
    min-height: 40%;
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

  [part~='outline-item'] {
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

  [part~='outline-item']:focus-visible > [part='outline-item-content'] {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  /* The item of the current page, marked by more than a color */
  [part~='outline-item'][aria-current] > [part='outline-item-content'] {
    font-weight: 600;
    border-inline-start: 2px solid currentColor;
    /* A straight bar, not following the rounded corners */
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    padding-inline-start: calc(
      var(--_level) * var(--vaadin-pdf-viewer-outline-indent, 1em) + var(--vaadin-padding-xs) - 2px
    );
  }

  [part~='outline-item'][aria-disabled='true'] > [part='outline-item-content'] {
    cursor: default;
  }

  @media (any-hover: hover) {
    [part='outline-item-content']:hover {
      background: var(--vaadin-background-container);
    }
  }

  [part~='outline-toggle'] {
    flex: none;
    width: 1lh;
    height: 1lh;
    background: currentColor;
    mask: var(--_vaadin-icon-chevron-right) 50% / 80% no-repeat;
  }

  [part~='outline-toggle'][expanded] {
    rotate: 90deg;
  }

  [part~='outline-toggle']:dir(rtl):not([expanded]) {
    scale: -1 1;
  }

  [part~='outline-toggle'][hidden] {
    display: block;
    visibility: hidden;
  }

  @media (forced-colors: active) {
    [part~='outline-toggle'] {
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
    max-height: calc(100% - 2 * var(--vaadin-padding-l));
    overflow: auto;
    padding: var(--vaadin-padding-l);
    border-radius: var(--vaadin-radius-l);
    background: var(--vaadin-background-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  @media (forced-colors: active) {
    [part='print-progress'] {
      border: 1px solid CanvasText;
    }
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
    /* The page is white paper, so use the light system colors (Highlight)
       also in a dark color scheme. */
    color-scheme: light;
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

  /* The structure of tagged PDFs, for assistive technology only. It owns the text layer elements. */
  .struct-tree {
    position: absolute;
    inset: 0;
    contain: strict;
    pointer-events: none;
  }

  @media (forced-colors: active) {
    /* Pages and thumbnails lose their shadow in forced colors */
    [part='page'],
    .thumbnail-image {
      outline: 1px solid CanvasText;
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

  /* On touch devices, pages are zoomed by pinching and changed by scrolling, like in other PDF viewers
     on phones. The zoom buttons stay for zooming without two fingers. */
  @media (pointer: coarse) {
    ::slotted(
      :is(vaadin-select[slot='toolbar-zoom'], [slot='toolbar-page'], [slot='page-field'], [slot='page-error'])
    ) {
      display: none;
    }

    /* The remaining controls fit on one line: navigation at the start, zoom in the middle, actions at the end. */
    [part='toolbar'] {
      display: flex;
      justify-content: space-between;
    }
  }
`;

export const pdfViewerStyles = [loaderStyles, pdfViewerBaseStyles];
