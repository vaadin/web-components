/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const richTextEditorPopupOverlayStyles = css`
  [part='overlay'] {
    padding: var(--vaadin-rte-overlay-padding, var(--vaadin-padding-container));
  }

  [part='content'] {
    display: grid;
    gap: var(--vaadin-rte-overlay-gap, var(--vaadin-gap-container-inline));
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  [part='content'] ::slotted(button) {
    border: var(
      --vaadin-rte-overlay-button-border,
      var(--vaadin-rte-button-border-width, 1px) solid var(--vaadin-rte-button-border-color, transparent)
    );
    border-radius: var(--vaadin-rte-overlay-button-border-radius, 9999px);
    cursor: var(--vaadin-clickable-cursor);
    font-size: var(--vaadin-rte-overlay-button-font-size, inherit);
    height: var(--vaadin-rte-overlay-button-height, 1lh);
    line-height: var(--vaadin-rte-overlay-button-line-height, inherit);
    padding: var(--vaadin-rte-overlay-button-padding, 0);
    width: var(--vaadin-rte-overlay-button-width, 1lh);
  }

  [part='content'] ::slotted(button:focus) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }
`;
