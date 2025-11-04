/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css, unsafeCSS } from 'lit';

export const group = (name = 'checkbox') => css`
  :host {
    width: fit-content;
    gap: var(--vaadin-${unsafeCSS(name)}-group-gap, var(--vaadin-gap-xs));
  }

  .vaadin-group-field-container {
    display: contents;
  }

  :host,
  [part='group-field'] {
    display: flex;
    flex-direction: column;
  }

  [part='group-field'] {
    gap: var(--vaadin-gap-xs) var(--vaadin-gap-xl);
  }

  :host([theme~='horizontal']) [part='group-field'] {
    flex-flow: row wrap;
  }
`;
