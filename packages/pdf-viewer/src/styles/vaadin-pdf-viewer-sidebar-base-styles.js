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

  :host([sidebar-opened]:not([sidebar-overlay])) .content-area::after {
    border-end-start-radius: 0;
  }

  [part~='backdrop'] {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  [part~='backdrop'][hidden] {
    display: none;
  }

  :host([sidebar-overlay]) [part~='sidebar'] {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 3;
    max-width: 100%;
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
    outline: var(--_focus-ring-width, var(--vaadin-focus-ring-width)) solid
      var(--_focus-ring-color, var(--vaadin-focus-ring-color));
  }

  [part~='thumbnail'][part~='current'] {
    color: var(--vaadin-text-color);
    font-weight: 600;
  }

  [part~='thumbnail'][part~='current'] .thumbnail-image {
    outline: 2px solid var(--vaadin-text-color-secondary);
  }

  .thumbnail-image {
    width: 96px;
    /* pdf.js draws text wrong in an RTL canvas */
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
    .thumbnail-image {
      outline: 1px solid CanvasText;
    }

    [part~='thumbnail'][part~='current'] .thumbnail-image {
      outline-color: Highlight;
    }
  }
`;
