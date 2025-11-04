/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const container = css`
  [class$='container'] {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-input-field-container-gap, var(--vaadin-gap-xs));
    min-width: 100%;
    max-width: 100%;
    width: var(--vaadin-field-default-width, 12em);
  }
`;
