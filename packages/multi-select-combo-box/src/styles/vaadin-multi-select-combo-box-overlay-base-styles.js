/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { comboBoxOverlayStyles } from '@vaadin/combo-box/src/styles/vaadin-combo-box-overlay-base-styles.js';

export const multiSelectComboBoxOverlayStyles = [
  comboBoxOverlayStyles,
  css`
    #overlay {
      width: var(
        --vaadin-multi-select-combo-box-overlay-width,
        var(--_vaadin-multi-select-combo-box-overlay-default-width, auto)
      );
    }
  `,
];
