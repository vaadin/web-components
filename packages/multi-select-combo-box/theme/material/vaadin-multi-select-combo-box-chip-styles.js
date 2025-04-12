/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
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
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.08);
    cursor: default;
    font-family: var(--material-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-inline-end: 0.25rem;
  }

  :host([focused]) {
    background-color: rgba(0, 0, 0, 0.16);
  }

  :host([slot='overflow']) {
    position: relative;
    margin-inline-start: 0.5rem;
  }

  :host([slot='overflow'])::before,
  :host([slot='overflow'])::after {
    position: absolute;
    width: 100%;
    height: 100%;
    border-color: rgba(0, 0, 0, 0.08);
    border-radius: 0.25rem;
    border-left: 0.125rem solid;
    content: '';
  }

  :host([slot='overflow'])::before {
    left: -0.25rem;
  }

  :host([slot='overflow'])::after {
    left: -0.5rem;
  }

  :host([count='2']) {
    margin-inline-start: 0.25rem;
  }

  :host([count='2'])::after {
    display: none;
  }

  :host([count='1']) {
    margin-inline-start: 0;
  }

  :host([count='1'])::before,
  :host([count='1'])::after {
    display: none;
  }

  [part='label'] {
    color: var(--material-body-text-color);
    font-size: var(--material-caption-font-size);
    line-height: 1;
  }

  /* Override field button */
  [part='remove-button'] {
    display: flex;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 0.75em;
    line-height: 20px;
    margin-inline-start: auto;
  }

  [part='remove-button']::before {
    content: var(--material-icons-clear);
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    pointer-events: none;
    -webkit-text-fill-color: var(--material-disabled-text-color);
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'material-multi-select-combo-box-chip',
});
