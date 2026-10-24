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

  .main {
    position: relative;
    display: flex;
    /* Takes the height left by the toolbar, see .top-area */
    flex: 1 1 0;
    min-height: 40%;
    container-type: inline-size;
  }

  .content-area {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
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

  [part='loader'] {
    position: absolute;
    inset: 0;
    margin: auto;
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
