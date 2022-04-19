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
    background-color: hsla(214, 53%, 23%, 0.1);
    cursor: default;
    font-family: var(--material-font-family);
  }

  :host([part~='overflow']) {
    position: relative;
    margin-inline-start: 0.5rem;
    padding-inline-end: 0.5rem;
  }

  :host([part~='overflow'])::before,
  :host([part~='overflow'])::after {
    position: absolute;
    content: '';
    width: 3px;
    height: 20px;
    border-left: 2px solid;
    border-radius: 4px 0 0 4px;
    border-color: hsla(214, 53%, 23%, 0.1);
  }

  :host([part~='overflow'])::before {
    left: -4px;
  }

  :host([part~='overflow'])::after {
    left: -8px;
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

  :host(:not([readonly]):not([disabled])) {
    padding-inline-end: 0;
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

  :host([readonly]) [part='remove-button'],
  :host([disabled]) [part='remove-button'] {
    display: none;
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'material-multi-select-combo-box-chip'
});
