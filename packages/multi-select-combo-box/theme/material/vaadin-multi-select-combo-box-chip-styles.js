/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { fieldButton } from '@vaadin/vaadin-material-styles/mixins/field-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const chip = css`
  :host {
    height: 1.25rem;
    margin-inline-end: 0.25rem;
    padding: 0 0.5rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.08);
    cursor: default;
    font-family: var(--material-font-family);
  }

  :host([focused]) {
    background-color: rgba(0, 0, 0, 0.16);
  }

  :host(:not([part~='overflow']):not([readonly]):not([disabled])) {
    padding-inline-end: 0;
  }

  :host([part~='overflow']) {
    position: relative;
    margin-inline-start: 0.5rem;
  }

  :host([part~='overflow'])::before,
  :host([part~='overflow'])::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    border-left: 0.125rem solid;
    border-radius: 0.25rem;
    border-color: rgba(0, 0, 0, 0.08);
  }

  :host([part~='overflow'])::before {
    left: -0.25rem;
  }

  :host([part~='overflow'])::after {
    left: -0.5rem;
  }

  :host([part~='overflow-two']) {
    margin-inline-start: 0.25rem;
  }

  :host([part~='overflow-two'])::after {
    display: none;
  }

  :host([part~='overflow-one']) {
    margin-inline-start: 0;
  }

  :host([part~='overflow-one'])::before,
  :host([part~='overflow-one'])::after {
    display: none;
  }

  [part='label'] {
    font-size: var(--material-caption-font-size);
    line-height: 1;
    color: var(--material-body-text-color);
  }

  /* Override field button */
  [part='remove-button'] {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    margin-inline-start: auto;
    line-height: 20px;
    padding: 0;
    font-size: 0.75em;
  }

  [part='remove-button']::before {
    content: var(--material-icons-clear);
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
    pointer-events: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'material-multi-select-combo-box-chip',
});
