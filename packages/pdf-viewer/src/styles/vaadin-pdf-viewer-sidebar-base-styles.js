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
  [part~='sidebar'] {
    display: flex;
    flex-direction: column;
    flex: none;
    width: var(--vaadin-pdf-viewer-sidebar-width, 10rem);
    border-inline-end: 1px solid var(--vaadin-pdf-viewer-border-color, var(--vaadin-border-color-secondary));
    background: var(--vaadin-pdf-viewer-sidebar-background, var(--vaadin-background-color));
  }

  [part~='sidebar'][hidden] {
    display: none;
  }

  /* The focus ring of the pages meets the sidebar at a square corner */
  :host([sidebar-opened]) .content-area::after {
    border-end-start-radius: 0;
  }

  [part~='thumbnails'] {
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
    font-size: 0.875em;
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
    background: var(--vaadin-background-container-strong);
    color: var(--vaadin-text-color);
    font-weight: 600;
  }

  /* Not only a background color, which can have low contrast */
  [part~='thumbnail'][part~='current'] .thumbnail-image {
    outline: 2px solid var(--vaadin-text-color);
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
