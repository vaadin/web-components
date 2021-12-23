/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const multiSelectComboBoxTokens = css`
  :host {
    font-family: var(--lumo-font-family);
  }

  [part='compact-mode-label'] {
    display: flex;
    flex-grow: 1;
    align-items: center;
    margin: var(--lumo-space-xs);
    padding: 0 calc(0.375em + var(--lumo-border-radius) / 4 - 1px);
    color: var(--lumo-body-text-color);
    font-weight: 500;
    cursor: var(--lumo-clickable-cursor);
  }

  [part='tokens'] {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    width: 100%;
    min-width: 0;
  }

  [part='token'] {
    display: flex;
    align-items: center;
    padding-left: var(--lumo-space-s);
    margin: var(--lumo-space-xs);
    border-radius: var(--lumo-border-radius);
    background-color: var(--lumo-contrast-20pct);
    cursor: var(--lumo-clickable-cursor);
    white-space: nowrap;
    height: calc(var(--lumo-size-m) - 2 * var(--lumo-space-xs));
    box-sizing: border-box;
    min-width: 0;
  }

  [part='token'] + [part='token'] {
    margin-left: 0;
  }

  [part='token-label'] {
    display: flex;
    align-items: center;
    font-size: var(--lumo-font-size-s);
    color: var(--lumo-body-text-color);
    font-weight: 500;
    overflow: hidden;
  }

  [part='token-remove-button'] {
    font-size: var(--lumo-icon-size-s);
    padding-right: var(--lumo-space-xs);
  }

  [part='token-remove-button']::before {
    content: var(--lumo-icons-cross);
  }

  :host([disabled]) [part$='label'],
  :host([disabled]) [part$='button'] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
    pointer-events: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box-tokens', [fieldButton, multiSelectComboBoxTokens], {
  moduleId: 'lumo-multi-select-combo-box-tokens'
});
