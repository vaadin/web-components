/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const chip = css`
  :host {
    display: inline-flex;
    align-items: center;
    align-self: center;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-xxs);
    line-height: 1;
    padding: 0.3125em calc(0.5em + var(--lumo-border-radius-s) / 4);
    border-radius: var(--lumo-border-radius-s);
    border-radius: var(--lumo-border-radius);
    background-color: var(--lumo-contrast-20pct);
    cursor: var(--lumo-clickable-cursor);
    white-space: nowrap;
    box-sizing: border-box;
    min-width: 0;
  }

  :host(:not([part~='overflow'])) {
    padding-inline-end: 0;
  }

  :host([part~='overflow']) {
    position: relative;
    min-width: var(--lumo-size-xxs);
    margin-inline-start: var(--lumo-space-s);
  }

  :host([part~='overflow'])::before,
  :host([part~='overflow'])::after {
    position: absolute;
    content: '';
    width: 3px;
    height: 21px;
    border-left: 2px solid;
    border-radius: 4px 0 0 4px;
    border-color: var(--lumo-contrast-30pct);
  }

  :host([part~='overflow'])::before {
    left: -4px;
  }

  :host([part~='overflow'])::after {
    left: -8px;
  }

  :host([part~='overflow'][label='2']) {
    margin-inline-start: calc(var(--lumo-space-s) / 2);
  }

  :host([part~='overflow'][label='2'])::after {
    display: none;
  }

  :host([part~='overflow'][label='1']) {
    margin-inline-start: 0;
  }

  :host([part~='overflow'][label='1'])::before,
  :host([part~='overflow'][label='1'])::after {
    display: none;
  }

  [part='label'] {
    color: var(--lumo-body-text-color);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
  }

  [part='remove-button'] {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -0.3125em;
    margin-bottom: -0.3125em;
    width: var(--lumo-icon-size-s);
    height: var(--lumo-icon-size-s);
    font-size: 1.5em;
  }

  [part='remove-button']::before {
    content: var(--lumo-icons-cross);
  }

  :host([disabled]) [part] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
    pointer-events: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'lumo-multi-select-combo-box-chip'
});
