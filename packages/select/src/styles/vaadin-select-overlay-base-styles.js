/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const selectOverlayStyles = css`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  [part='overlay'] {
    min-width: var(--vaadin-select-overlay-width, var(--_vaadin-select-overlay-default-width));
  }

  [part='content'] {
    padding: var(--vaadin-item-overlay-padding, 4px);
  }

  [part='backdrop'] {
    background: transparent;
  }

  :host([theme~='align-start']) [part='overlay'] {
    text-align: start;
  }

  :host([theme~='align-center']) [part='overlay'] {
    text-align: center;
  }

  :host([theme~='align-end']) [part='overlay'] {
    text-align: end;
  }

  :host([theme~='align-left']) [part='overlay'] {
    text-align: left;
  }

  :host([theme~='align-right']) [part='overlay'] {
    text-align: right;
  }
`;
