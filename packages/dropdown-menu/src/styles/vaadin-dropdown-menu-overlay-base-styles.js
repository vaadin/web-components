/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { contextMenuOverlayStyles } from '@vaadin/context-menu/src/styles/vaadin-context-menu-overlay-base-styles.js';

const dropdownMenuOverlay = css`
  [part='overlay'] {
    min-width: var(--vaadin-dropdown-menu-overlay-width, var(--_vaadin-dropdown-menu-overlay-default-width));
  }
`;

export const dropdownMenuOverlayStyles = [...contextMenuOverlayStyles, dropdownMenuOverlay];
