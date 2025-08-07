/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const multiSelectComboBoxChipStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    box-sizing: border-box;
    gap: var(--vaadin-chip-gap, var(--vaadin-chip-padding, 0.3em));
    background: var(--vaadin-chip-background, var(--vaadin-background-container));
    color: var(--vaadin-chip-color, var(--vaadin-color));
    font-size: var(--vaadin-chip-font-size, 0.875em);
    font-weight: var(--vaadin-chip-font-weight, 500);
    line-height: var(--vaadin-input-field-value-line-height, inherit);
    padding: 0 var(--vaadin-chip-padding, 0.3em);
    height: var(--vaadin-chip-height, calc(1lh / 0.875));
    border-radius: var(--vaadin-chip-border-radius, var(--vaadin-radius-m));
    border: var(--vaadin-chip-border-width, 1px) solid
      var(--vaadin-chip-border-color, var(--vaadin-border-color-subtle));
    cursor: default;
  }

  :host(:not([slot='overflow'])) {
    min-width: min(
      max-content,
      var(--vaadin-multi-select-combo-box-chip-min-width, var(--vaadin-chip-min-width, 48px))
    );
  }

  :host([focused]) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-chip-border-width, 1px) * -1);
  }

  [part='label'] {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [part='remove-button'] {
    flex: none;
    display: block;
    margin-inline: auto calc(var(--vaadin-chip-padding, 0.3em) * -1);
    color: var(--vaadin-chip-remove-button-color, var(--vaadin-color-subtle));
    cursor: var(--vaadin-clickable-cursor);
  }

  [part='remove-button']::before {
    content: '';
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask-image: var(--_vaadin-icon-cross);
  }

  :host([disabled]) {
    cursor: var(--vaadin-disabled-cursor);
  }

  :host([disabled]) [part='label'] {
    --vaadin-chip-color: var(--vaadin-color-disabled);
  }

  :host([hidden]),
  :host(:is([readonly], [disabled], [slot='overflow'])) [part='remove-button'] {
    display: none !important;
  }

  :host([slot='overflow']) {
    position: relative;
    margin-inline-start: 8px;
    min-width: 1.5em;
  }

  :host([slot='overflow'])::before,
  :host([slot='overflow'])::after {
    content: '';
    position: absolute;
    inset: calc(var(--vaadin-chip-border-width, 1px) * -1);
    border-inline-start: 2px solid var(--vaadin-chip-border-color, var(--vaadin-border-color-subtle));
    border-radius: inherit;
  }

  :host([slot='overflow'])::before {
    left: calc(-4px - var(--vaadin-chip-border-width, 1px));
  }

  :host([slot='overflow'])::after {
    left: calc(-8px - var(--vaadin-chip-border-width, 1px));
  }

  :host([count='2']) {
    margin-inline-start: 4px;
  }

  :host([count='1']) {
    margin-inline-start: 0;
  }

  :host([count='2'])::after,
  :host([count='1'])::before,
  :host([count='1'])::after {
    display: none;
  }
`;
