/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const multiSelectComboBoxOverlayStyles = css`
  #overlay {
    width: var(
      --vaadin-multi-select-combo-box-overlay-width,
      var(--_vaadin-multi-select-combo-box-overlay-default-width, auto)
    );
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;
