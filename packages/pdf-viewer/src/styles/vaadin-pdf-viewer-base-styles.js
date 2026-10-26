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

  .content-area {
    position: relative;
    display: flex;
    flex: 1 1 0;
    min-width: 0;
    min-height: 40%;
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

  :host([focus-ring]) .content-area::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    border-radius: max(0px, var(--vaadin-pdf-viewer-border-radius, var(--vaadin-radius-m)) - 1px);
    border-start-start-radius: 0;
    border-start-end-radius: 0;
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part='loader'] {
    position: absolute;
    inset: 0;
    margin: auto;
  }
`;

export const pdfViewerStyles = [loaderStyles, pdfViewerBaseStyles];
