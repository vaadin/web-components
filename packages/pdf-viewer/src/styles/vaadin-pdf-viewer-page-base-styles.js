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
    /* Lets wide pages scroll to both edges */
    align-items: safe center;
    gap: var(--vaadin-pdf-viewer-page-gap, var(--vaadin-gap-m));
  }

  [part='page'] {
    position: relative;
    flex: none;
    /* pdf.js draws text wrong in an RTL canvas */
    direction: ltr;
    /* pdf.js rounds the size of page layers down to these steps.
       1px keeps the text within a pixel of the canvas, as in pdf.js. */
    --scale-round-x: 1px;
    --scale-round-y: 1px;
    background: var(--vaadin-pdf-viewer-page-background, #fff);
    box-shadow: var(--vaadin-pdf-viewer-page-shadow, 0 0 0 1px var(--vaadin-border-color-secondary));
  }

  [part='page'] canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .link-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform-origin: 0 0;
    pointer-events: none;
  }

  .link {
    position: absolute;
    z-index: 2;
    pointer-events: auto;
    cursor: var(--vaadin-clickable-cursor);
  }

  /* Keeps the selection in the text while dragging over links, as in pdf.js */
  [part='page']:has(> .text-layer.selecting) .link {
    pointer-events: none;
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
