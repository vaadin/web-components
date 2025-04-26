/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const checkboxStyles = css`
  :host {
    align-items: baseline;
    display: inline-grid;
    gap: var(--vaadin-checkbox-gap, 0.5em);
    grid-template-columns: auto 1fr;
  }

  :host::before {
    content: none;
  }

  :host([hidden]) {
    display: none;
  }

  :host([focus-ring]) [part='checkbox'] {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  .vaadin-checkbox-container {
    display: contents;
  }

  [part='checkbox'],
  ::slotted(input),
  [part='label'] {
    grid-row: 1;
  }

  [part='checkbox'],
  ::slotted(input) {
    grid-column: 1;
  }

  [part='helper-text'],
  [part='error-message'] {
    grid-column: 2;
  }

  :host(:not([has-helper])) [part='helper-text'],
  :host(:not([has-error-message])) [part='error-message'] {
    display: none;
  }

  [part='checkbox'] {
    background-color: var(--vaadin-checkbox-background, transparent);
    border: var(--vaadin-checkbox-border-width, 1px) solid
      var(--vaadin-checkbox-border-color, var(--_vaadin-border-color-strong));
    border-radius: var(--vaadin-checkbox-border-radius, var(--_vaadin-radius-s));
    color: var(--vaadin-checkbox-color, transparent);
    height: var(--vaadin-checkbox-size, 1em);
    position: relative;
    width: var(--vaadin-checkbox-size, 1em);
  }

  [part='checkbox']::before {
    contain: paint;
    content: '\\202F';
    display: block;
    line-height: var(--vaadin-checkbox-size, 1em);
  }

  [part='checkbox']::after {
    content: '';
    height: var(--vaadin-checkbox-size, 1em);
    inset: 0;
    position: absolute;
    width: var(--vaadin-checkbox-size, 1em);
  }

  /* Checked, indeterminate */
  :host(:is([checked], [indeterminate])) {
    --vaadin-checkbox-background: var(--_vaadin-color-strong);
    --vaadin-checkbox-border-color: transparent;
    --vaadin-checkbox-color: var(--_vaadin-background);
  }

  :host([checked]) [part='checkbox']::after {
    background: currentColor;
    mask-image: var(--_vaadin-icon-checkmark);
  }

  :host([indeterminate]) [part='checkbox']::after {
    background: currentColor;
    mask-image: var(--_vaadin-icon-minus);
  }

  /* Read-only */
  :host([readonly]) {
    --vaadin-checkbox-background: transparent;
    --vaadin-checkbox-border-color: var(--_vaadin-border-color-strong);
    --vaadin-checkbox-color: var(--_vaadin-color-strong);
  }

  :host([readonly]) [part='checkbox'] {
    border-style: dashed;
  }

  /* Disabled */
  :host([disabled]) {
    --vaadin-checkbox-background: var(
      --vaadin-input-field-disabled-background,
      var(--_vaadin-background-container-strong)
    );
    --vaadin-checkbox-border-color: transparent;
    --vaadin-checkbox-color: var(--_vaadin-color-strong);
    --vaadin-checkbox-label-color: var(--vaadin-input-field-disabled-text-color, var(--_vaadin-color-subtle));
  }

  /* Visually hidden */
  ::slotted(input) {
    align-self: stretch;
    appearance: none;
    cursor: inherit;
    height: initial;
    margin: 0;
    width: initial;
  }

  [part='label'] {
    --vaadin-input-field-label-color: var(--vaadin-checkbox-label-color, var(--_vaadin-color-strong));
    --vaadin-input-field-label-font-size: var(--vaadin-checkbox-label-font-size, inherit);
    --vaadin-input-field-label-font-weight: var(--vaadin-checkbox-label-font-weight, 400);
    --vaadin-input-field-label-line-height: var(--vaadin-checkbox-label-line-height, inherit);
    padding: var(--vaadin-checkbox-label-padding, 0);
  }

  [part='required-indicator'] {
    display: inline-block;
  }

  @media (forced-colors: active) {
    [part='checkbox'] {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([disabled]) [part='checkbox'],
    :host([disabled]) [part='checkbox']::after {
      outline-color: GrayText;
    }

    :host(:is([checked], [indeterminate])) [part='checkbox']::after {
      border-radius: inherit;
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([focused]) [part='checkbox'],
    :host([focused]) [part='checkbox']::after {
      outline-width: 2px;
    }
  }
`;
