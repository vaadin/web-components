/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const textAreaStyles = css`
  .vaadin-text-area-container {
    flex: auto;
  }

  /* The label, helper text and the error message should neither grow nor shrink. */
  [part='label'],
  [part='helper-text'],
  [part='error-message'] {
    flex: none;
  }

  [part='input-field'] {
    overflow: auto;
    flex: auto;
    -webkit-overflow-scrolling: touch;
  }

  ::slotted(textarea) {
    overflow: hidden;
    width: 100%;
    min-width: 0;
    height: 100%;
    flex: auto;
    padding: 0 0.25em;
    border: 0;
    border-radius: 0;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    /* Disable default invalid style in Firefox */
    box-shadow: none;
    color: inherit;
    font: inherit;
    font-size: 1em;
    line-height: normal;
    outline: none;
    resize: none;
  }

  /* Override styles from <vaadin-input-container> */
  [part='input-field'] ::slotted(textarea) {
    box-sizing: border-box;
    align-self: stretch;
    white-space: pre-wrap;
  }

  [part='input-field'] ::slotted(:not(textarea)) {
    align-self: flex-start;
  }

  /* Workaround https://bugzilla.mozilla.org/show_bug.cgi?id=1739079 */
  :host([disabled]) ::slotted(textarea) {
    user-select: none;
  }
`;
