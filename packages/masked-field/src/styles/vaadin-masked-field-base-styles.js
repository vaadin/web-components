/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const maskedFieldStyles = css`
  [part='input-field'] {
    position: relative;
  }

  [part='prompt'] {
    position: absolute;
    display: flex;
    overflow: hidden;
    align-items: center;
    box-sizing: border-box;
    color: var(--vaadin-input-field-placeholder-color, var(--vaadin-text-color-secondary));
    font: inherit;
    font-size: 1em;
    pointer-events: none;
    white-space: pre;
  }

  /* Holds the presented text so that the remainder starts where the caret is */
  [part='prompt'] > span {
    visibility: hidden;
  }

  :host(:not([has-format-prompt])) [part='prompt'],
  :host([placeholder]:not([has-value])) [part='prompt'] {
    display: none;
  }
`;
