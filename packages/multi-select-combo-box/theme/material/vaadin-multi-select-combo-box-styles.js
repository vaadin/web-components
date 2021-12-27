/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  /* Make label always float */
  [part='label'] {
    transform: scale(0.75) !important;
  }

  [part='compact-mode-count'] {
    color: var(--material-body-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-body-font-size);
    cursor: default;
  }

  :host([disabled]) [part='compact-mode-count'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
    pointer-events: none;
  }

  [part='toggle-button']::before {
    content: var(--material-icons-dropdown);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'material-multi-select-combo-box'
});
