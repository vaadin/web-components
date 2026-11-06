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
    --_icon: var(--_vaadin-icon-download);
  }

  :host([icon='find']) {
    --_icon: var(--_vaadin-icon-search);
  }

  :host([icon='previous-match']) {
    --_icon: var(--_vaadin-icon-chevron-down);
  }

  :host([icon='previous-match']) [part~='icon'] {
    scale: 1 -1;
  }

  :host([icon='next-match']) {
    --_icon: var(--_vaadin-icon-chevron-down);
  }

  :host([icon='close']) {
    --_icon: var(--_vaadin-icon-cross);
  }

  /* The find button looks pressed while the find bar is open */
  :host([aria-pressed='true']) {
    background: var(--vaadin-background-container-strong);
  }

  @media (forced-colors: active) {
    :host([aria-pressed='true']) {
      background: Highlight;
    }

    [part~='icon'] {
      background: CanvasText;
    }

    :host([aria-pressed='true']) [part~='icon'] {
      background: HighlightText;
    }

    :host([disabled]) [part~='icon'] {
      background: GrayText;
    }
  }
`;
