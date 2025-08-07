/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

export const richTextEditorPopupOverlay = css`
  [part='overlay'] {
    padding: var(--vaadin-rich-text-editor-overlay-padding, var(--vaadin-padding-container));
  }

  [part='content'] {
    display: grid;
    gap: var(--vaadin-rich-text-editor-overlay-gap, var(--vaadin-gap-s));
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  [part='content'] ::slotted(button) {
    border: var(--vaadin-rich-text-editor-overlay-color-option-border-width, 1px) solid
      var(--vaadin-rich-text-editor-overlay-color-option-border-color, transparent);
    border-radius: var(--vaadin-rich-text-editor-overlay-color-option-border-radius, 9999px);
    cursor: var(--vaadin-clickable-cursor);
    font-size: var(--vaadin-rich-text-editor-overlay-color-option-font-size, inherit);
    height: var(--vaadin-rich-text-editor-overlay-color-option-height, 1lh);
    line-height: var(--vaadin-rich-text-editor-overlay-color-option-line-height, inherit);
    padding: var(--vaadin-rich-text-editor-overlay-color-option-padding, 0);
    width: var(--vaadin-rich-text-editor-overlay-color-option-width, 1lh);
  }

  [part='content'] ::slotted(button:focus-visible) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }
`;

export const richTextEditorPopupOverlayStyles = [overlayStyles, richTextEditorPopupOverlay];
