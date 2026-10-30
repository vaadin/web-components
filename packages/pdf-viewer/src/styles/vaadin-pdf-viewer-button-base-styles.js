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

  /* Left and right, as up and down are for the pages */
  :host([icon='previous-match']) {
    --_icon: var(
      --vaadin-pdf-viewer-icon-previous-match,
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>')
    );
  }

  :host([icon='next-match']) {
    --_icon: var(--vaadin-pdf-viewer-icon-next-match, var(--_vaadin-icon-chevron-right));
  }

  :host([icon$='-match']:dir(rtl)) [part='icon'] {
    scale: -1 1;
  }

  :host([icon='collapse-toolbar']) {
    --_icon: var(--vaadin-pdf-viewer-icon-collapse-toolbar, var(--_vaadin-icon-chevron-up));
  }

  :host([icon='expand-toolbar']) {
    --_icon: var(--vaadin-pdf-viewer-icon-expand-toolbar, var(--_vaadin-icon-chevron-down));
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
  }

  @media (forced-colors: active) {
    :host([aria-pressed='true']) {
      background: Highlight;
    }

    :host([aria-pressed='true']) [part='icon'] {
      background: HighlightText;
    }

    [part='icon'] {
      background: CanvasText;
    }

    :host([disabled]) [part='icon'] {
      background: GrayText;
    }
  }
`;
