/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
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
    background-color: var(--lumo-contrast-20pct);
    border-radius: var(--lumo-border-radius-s);
    color: var(--lumo-body-text-color);
    cursor: var(--lumo-clickable-cursor);
    font-size: var(--lumo-font-size-xxs);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
  }

  :host([disabled]) {
    background-color: var(--lumo-contrast-10pct);
  }

  :host([focused]) [part='remove-button'] {
    color: inherit;
  }

  :host([slot='overflow']) {
    margin-inline-start: var(--lumo-space-s);
    min-width: var(--lumo-size-xxs);
    position: relative;
  }

  :host([slot='overflow'])::before,
  :host([slot='overflow'])::after {
    border-color: var(--lumo-contrast-30pct);
    border-left: calc(var(--lumo-space-s) / 4) solid;
    border-radius: var(--lumo-border-radius-s);
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
  }

  :host([slot='overflow'])::before {
    left: calc(-1 * var(--lumo-space-s) / 2);
  }

  :host([slot='overflow'])::after {
    left: calc(-1 * var(--lumo-space-s));
  }

  :host([count='2']) {
    margin-inline-start: calc(var(--lumo-space-s) / 2);
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
    font-weight: 500;
    line-height: 1.25;
  }

  [part='remove-button'] {
    align-items: center;
    display: flex;
    font-size: 1.5em;
    height: 1.25em;
    justify-content: center;
    margin-bottom: -0.3125em;
    margin-inline-start: auto;
    margin-top: -0.3125em;
    transition: none;
    width: 1.25em;
  }

  [part='remove-button']::before {
    content: var(--lumo-icons-cross);
  }

  :host([disabled]) [part='label'] {
    color: var(--lumo-disabled-text-color);
    pointer-events: none;
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }
`;

registerStyles('vaadin-multi-select-combo-box-chip', [fieldButton, chip], {
  moduleId: 'lumo-multi-select-combo-box-chip',
});
