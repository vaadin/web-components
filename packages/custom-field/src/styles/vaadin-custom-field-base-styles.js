/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { container } from '@vaadin/field-base/src/styles/container-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const customField = css`
  .vaadin-custom-field-container {
    width: 100%;
  }

  .inputs-wrapper {
    flex: none;
  }
`;

export const customFieldStyles = [field, container, customField];
