/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const group = css`
  [part='label'],
  [part='helper-text'],
  [part='error-message'] {
    width: auto;
    min-width: auto;
  }

  [part='group-field'] {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-gap-xs) var(--vaadin-gap-xl);
  }

  :host([theme~='horizontal']) [part='group-field'] {
    flex-flow: row wrap;
    align-items: center;
    padding-block: var(--vaadin-padding-block-container);
    border-block: var(--vaadin-input-field-border-width, 1px) solid transparent;
  }

  :host([theme~='label-aside']) [part='group-field'] {
    padding-block-start: var(--vaadin-padding-block-container);
    border-block-start: var(--vaadin-input-field-border-width, 1px) solid transparent;
  }
`;
