/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, unsafeCSS } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const checkboxGroupStyles = (name = 'checkbox') => css`
  :host {
    width: fit-content;
  }

  .vaadin-group-field-container {
    display: contents;
  }

  :host,
  [part='group-field'] {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-${unsafeCSS(name)}-group-gap, var(--_vaadin-gap-container-block));
  }

  [part='group-field'] {
    gap: 0.5lh 1.5em;
  }

  :host([theme~='horizontal']) [part='group-field'] {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;
