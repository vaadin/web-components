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
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.5rem;
    margin-top: 0.25rem;
    margin-inline-end: 0.25rem;
    padding-inline-start: 0.5rem;
    border-radius: 1.25rem;
    background-color: hsla(214, 53%, 23%, 0.1);
    cursor: default;
    white-space: nowrap;
    font-family: var(--material-font-family);
  }

  [part='label'] {
    font-size: var(--material-small-font-size);
    color: var(--material-body-text-color);
  }

  /* Override field button */
  [part='remove-button'] {
    padding: 0 0.125rem;
    color: hsla(0, 0%, 100%, 0.9);
    font-size: inherit;
  }

  [part='remove-button']::before {
    content: var(--material-icons-clear);
    border-radius: 50%;
    background-color: hsla(214, 45%, 20%, 0.5);
  }

  :host(:not([disabled])) [part='remove-button']:hover {
    color: hsla(0, 0%, 100%, 0.9);
  }

  [part='remove-button']:hover::before {
    background-color: hsla(214, 41%, 17%, 0.83);
  }

  /* Disabled */
  :host([disabled]) [part] {
    pointer-events: none;
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
  }

  :host([disabled]) [part='remove-button'] {
    color: hsla(0, 0%, 100%, 0.75);
    -webkit-text-fill-color: hsla(0, 0%, 100%, 0.75);
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'material-multi-select-combo-box-chip'
});
