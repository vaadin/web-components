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

  [part~='icon'] {
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--_icon) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
  }

  :host([icon='previous-page']) {
    --_icon: var(--_vaadin-icon-chevron-down);
  }

  :host([icon='previous-page']) [part~='icon'] {
    scale: 1 -1;
  }

  :host([icon='next-page']) {
    --_icon: var(--_vaadin-icon-chevron-down);
  }

  :host([icon='zoom-out']) {
    --_icon: var(--_vaadin-icon-minus);
  }

  :host([icon='zoom-in']) {
    --_icon: var(--_vaadin-icon-plus);
  }

  :host([icon='download']) {
    --_icon: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>');
  }

  @media (forced-colors: active) {
    [part~='icon'] {
      background: CanvasText;
    }

    :host([disabled]) [part~='icon'] {
      background: GrayText;
    }
  }
`;
