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

export const pdfViewerSidebarStyles = css`
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

  @media (forced-colors: active) {
    /* Thumbnails lose their shadow in forced colors, like the pages */
    .thumbnail-image {
      outline: 1px solid CanvasText;
    }

    [part~='thumbnail'][part~='current'] .thumbnail-image {
      outline-color: Highlight;
    }
  }
`;
