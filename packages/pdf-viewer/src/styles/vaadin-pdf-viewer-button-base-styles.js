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

export const pdfViewerButtonStyles = css`
  :host {
    padding: var(--vaadin-button-padding, var(--vaadin-padding-block-container));
  }

  [part='icon'] {
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--_icon) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
  }

  :host([icon='previous-page']) {
    --_icon: var(--vaadin-pdf-viewer-icon-previous-page, var(--_vaadin-icon-chevron-up));
  }

  :host([icon='next-page']) {
    --_icon: var(--vaadin-pdf-viewer-icon-next-page, var(--_vaadin-icon-chevron-down));
  }

  :host([icon='zoom-out']) {
    --_icon: var(--vaadin-pdf-viewer-icon-zoom-out, var(--_vaadin-icon-minus));
  }

  :host([icon='zoom-in']) {
    --_icon: var(--vaadin-pdf-viewer-icon-zoom-in, var(--_vaadin-icon-plus));
  }

  :host([icon='previous-match']) {
    --_icon: var(--vaadin-pdf-viewer-icon-previous-page, var(--_vaadin-icon-chevron-up));
  }

  :host([icon='next-match']) {
    --_icon: var(--vaadin-pdf-viewer-icon-next-page, var(--_vaadin-icon-chevron-down));
  }

  :host([icon='sidebar']) {
    --_icon: var(--vaadin-pdf-viewer-icon-sidebar, var(--_vaadin-icon-sidebar));
  }

  :host([icon='download']) {
    --_icon: var(--vaadin-pdf-viewer-icon-download, var(--_vaadin-icon-download));
  }

  :host([icon='print']) {
    --_icon: var(--vaadin-pdf-viewer-icon-print, var(--_vaadin-icon-print));
  }

  :host([icon='thumbnails']) {
    --_icon: var(--vaadin-pdf-viewer-icon-thumbnails, var(--_vaadin-icon-layout-grid));
  }

  :host([icon='outline']) {
    --_icon: var(--vaadin-pdf-viewer-icon-outline, var(--_vaadin-icon-list-tree));
  }

  :host([icon='find']) {
    --_icon: var(--vaadin-pdf-viewer-icon-find, var(--_vaadin-icon-search));
  }

  :host([icon='close']) {
    --_icon: var(--vaadin-pdf-viewer-icon-close, var(--_vaadin-icon-cross));
  }

  :host([aria-pressed='true']) {
    background: var(--vaadin-background-container-strong);
    /* Not only a background color, which can have low contrast */
    box-shadow: inset 0 -2px 0 currentColor;
  }

  @media (forced-colors: active) {
    :host([aria-pressed='true']) {
      border: 2px solid ButtonText;
    }

    [part='icon'] {
      background: CanvasText;
    }

    :host([disabled]) [part='icon'] {
      background: GrayText;
    }
  }
`;
