/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const checkboxGroupStyles = css`
  .vaadin-group-field-container {
    width: 100%;
  }

  [part='group-field'] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vaadin-checkbox-group-gap, 0.5em 1em);
  }

  :host([theme~='vertical']) [part='group-field'] {
    flex-direction: column;
  }
`;
