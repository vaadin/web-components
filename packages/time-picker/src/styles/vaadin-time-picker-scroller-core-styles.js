/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const timePickerScrollerStyles = css`
  :host {
    display: block;
    min-height: 1px;
    overflow: auto;

    /* Fixes item background from getting on top of scrollbars on Safari */
    transform: translate3d(0, 0, 0);

    /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
    box-shadow: 0 0 0 white;
  }

  #selector {
    border-width: var(--_vaadin-time-picker-items-container-border-width);
    border-style: var(--_vaadin-time-picker-items-container-border-style);
    border-color: var(--_vaadin-time-picker-items-container-border-color, transparent);
    position: relative;
  }
`;
