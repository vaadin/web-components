/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBox = css`
  :host([has-value]) {
    padding-inline-start: 0;
  }

  :host([readonly]) [part='chip'],
  :host([disabled]) [part='chip'] {
    opacity: 0.5;
  }

  [part='chip']:not(:last-of-type) {
    margin-inline-end: var(--lumo-space-xs);
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'lumo-multi-select-combo-box'
});
