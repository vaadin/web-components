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
    width: var(--vaadin-pdf-viewer-zoom-select-width, 8.5em);
  }

  [part='content'] {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    scrollbar-gutter: stable;
    padding: var(--vaadin-pdf-viewer-padding, var(--vaadin-padding-m));
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
    /* Pages are paper: white unless the document paints a background itself. */
    background: var(--vaadin-pdf-viewer-page-background, #fff);
    box-shadow: var(--vaadin-pdf-viewer-page-shadow, 0 0 0 1px var(--vaadin-border-color-secondary));
  }

  [part='page'] canvas {
    display: block;
    width: 100%;
    height: 100%;
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
