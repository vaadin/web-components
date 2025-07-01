/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const multiSelectComboBoxChipStyles = css`
  @layer base {
    :host {
      display: inline-flex;
      align-items: center;
      align-self: center;
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
      box-sizing: border-box;
      border-radius: var(--vaadin-chip-border-radius, var(--vaadin-radius-m));
      border: var(--vaadin-chip-border-width, 1px) solid var(--vaadin-chip-border-color, var(--vaadin-border-color));
      cursor: default;
    }

    :host(:not([slot='overflow'])) {
      min-width: min(max-content, var(--vaadin-chip-min-width, 6em));
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
      margin-inline-start: auto;
      margin-inline-end: calc(var(--vaadin-chip-padding, 0.3em) * -1);
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
      /* pointer-events: none; */
    }

    :host([hidden]),
    :host(:is([readonly], [disabled], [slot='overflow'])) [part='remove-button'] {
      display: none !important;
    }
  }
`;
