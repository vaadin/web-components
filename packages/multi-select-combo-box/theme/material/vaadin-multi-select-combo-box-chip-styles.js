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
    background-color: rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    cursor: default;
    font-family: var(--material-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 1.25rem;
    margin-inline-end: 0.25rem;
  }

  :host([focused]) {
    background-color: rgba(0, 0, 0, 0.16);
  }

  :host([slot='overflow']) {
    margin-inline-start: 0.5rem;
    position: relative;
  }

  :host([slot='overflow'])::before,
  :host([slot='overflow'])::after {
    border-color: rgba(0, 0, 0, 0.08);
    border-left: 0.125rem solid;
    border-radius: 0.25rem;
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
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
    align-items: center;
    box-sizing: border-box;
    display: flex;
    font-size: 0.75em;
    height: 20px;
    justify-content: center;
    line-height: 20px;
    margin-inline-start: auto;
    padding: 0;
    width: 20px;
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
