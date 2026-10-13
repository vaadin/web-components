/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const formItemStyles = css`
  :host {
    align-items: baseline;
    display: inline-flex;
    justify-self: stretch;
  }

  :host([label-position='top']) {
    align-items: normal;
    flex-direction: column;
  }

  :host([data-form-layout-auto-responsive]) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  :host([data-form-layout-has-labels-aside]) {
    align-items: baseline;
    column-gap: var(--vaadin-form-layout-label-spacing, 1em);
    grid-template-columns: var(--vaadin-form-layout-label-width, 8em) minmax(0, 1fr);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='label'] {
    color: var(--vaadin-form-item-label-color, var(--vaadin-input-field-label-color, var(--vaadin-text-color)));
    flex: 0 0 auto;
    font-size: var(--vaadin-form-item-label-font-size, var(--vaadin-input-field-label-font-size, inherit));
    font-weight: var(--vaadin-form-item-label-font-weight, var(--vaadin-input-field-label-font-weight, 500));
    line-height: var(--vaadin-form-item-label-line-height, var(--vaadin-input-field-label-line-height, inherit));
    position: relative;
    text-align: var(--vaadin-form-layout-label-text-align, start);
    width: var(--vaadin-form-layout-label-width, 8em);
    word-break: break-word;
    box-sizing: border-box;
  }

  :host(:is([label-position='top'], [data-form-layout-auto-responsive])) [part='label'] {
    text-align: inherit;
    width: auto;
  }

  :host([data-form-layout-has-labels-aside]) [part='label'] {
    text-align: var(--vaadin-form-layout-label-text-align, start);
  }

  :host([required]) [part='label'] {
    padding-inline-end: 1em;
  }

  [part='required-indicator'] {
    display: inline-block;
    position: absolute;
    width: 1em;
    text-align: center;
    color: var(--vaadin-input-field-required-indicator-color, var(--vaadin-text-color-secondary));
  }

  [part='required-indicator']::after {
    content: var(--vaadin-input-field-required-indicator, '*');
  }

  :host(:not([required])) [part='required-indicator'] {
    display: none;
  }

  #spacing {
    flex: 0 0 auto;
    width: var(--vaadin-form-layout-label-spacing, 1em);
  }

  :host([data-form-layout-auto-responsive]) #spacing {
    display: none;
  }

  #content {
    flex: 1 1 auto;
    min-width: 0;
  }

  #content ::slotted(.full-width) {
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
  }
`;
