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
    /* Pages are paper: white unless the document paints a background itself. */
    background: var(--vaadin-pdf-viewer-page-background, #fff);
    box-shadow: var(--vaadin-pdf-viewer-page-shadow, 0 0 0 1px var(--vaadin-border-color-secondary));
  }

  [part='page'] canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (forced-colors: active) {
    /* Pages lose their shadow in forced colors */
    [part='page'] {
      outline: 1px solid CanvasText;
    }
  }
`;
