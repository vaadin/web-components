/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { inputFieldShared } from '@vaadin/vaadin-lumo-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box-item',
  css`
    @media (any-hover: hover) {
      :host(:hover[readonly]) {
        background-color: transparent;
        cursor: default;
      }
    }
  `,
  {
    moduleId: 'lumo-multi-select-combo-box-item',
  },
);

registerStyles(
  'vaadin-multi-select-combo-box-container',
  css`
    :host([auto-expand-vertically]) {
      padding-block: var(--lumo-space-xs);
    }
  `,
  { moduleId: 'lumo-multi-select-combo-box-container' },
);

const multiSelectComboBox = css`
  :host([has-value]) {
    padding-inline-start: 0;
  }

  :host([has-value]) ::slotted(input:placeholder-shown) {
    caret-color: var(--lumo-body-text-color) !important;
  }

  [part='label'] {
    flex-shrink: 0;
  }

  [part~='chip']:not(:last-of-type) {
    margin-inline-end: var(--lumo-space-xs);
  }

  :host([auto-expand-vertically]) [part~='chip'] {
    margin-block: calc(var(--lumo-space-xs) / 2);
  }

  :host([auto-expand-vertically]) ::slotted([slot='input']) {
    min-height: calc(var(--lumo-text-field-size, var(--lumo-size-m)) - 2 * var(--lumo-space-xs));
  }

  [part~='overflow']:not([hidden]) + :not(:empty) {
    margin-inline-start: var(--lumo-space-xs);
  }

  [part='toggle-button']::before {
    content: var(--lumo-icons-dropdown);
  }

  :host([readonly][has-value]) [part='toggle-button'] {
    color: var(--lumo-contrast-60pct);
    cursor: var(--lumo-clickable-cursor);
  }
`;

registerStyles('vaadin-multi-select-combo-box', [inputFieldShared, multiSelectComboBox], {
  moduleId: 'lumo-multi-select-combo-box',
});
