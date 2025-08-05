/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageInputStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    max-height: 50vh;
    flex-shrink: 0;
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color-strong));
    border-radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    background: var(--vaadin-input-field-background, var(--vaadin-background-color));
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus-within) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-input-field-border-width, 1px) * -1);
  }

  :host([disabled]) {
    --vaadin-input-field-value-color: var(--vaadin-input-field-disabled-text-color, var(--vaadin-color-disabled));
    --vaadin-input-field-background: var(
      --vaadin-input-field-disabled-background,
      var(--vaadin-background-container-strong)
    );
    --vaadin-input-field-border-color: transparent;
  }

  ::slotted([slot='textarea']) {
    flex: 1;
    --vaadin-input-field-border-width: 0 !important;
    --vaadin-focus-ring-width: 0;
    --vaadin-input-field-background: transparent !important;
  }

  ::slotted([slot='button']) {
    flex: none;
    align-self: end;
    margin: var(--vaadin-input-field-padding, var(--vaadin-padding-container));
    --vaadin-button-border-width: 0;
    --vaadin-button-background: transparent;
    --vaadin-button-text-color: var(--vaadin-color);
    --vaadin-button-padding: 0;
  }

  :host([theme~='icon-button']) ::slotted([slot='button']) {
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    color: transparent;
    position: relative;
    contain: strict;
  }

  :host([theme~='icon-button']) ::slotted([slot='button'])::before {
    content: '';
    position: absolute;
    inset: 0;
    mask-image: var(--_vaadin-icon-paper-airplane);
    background: var(--vaadin-button-text-color);
  }

  :host([dir='rtl'][theme~='icon-button']) ::slotted([slot='button'])::before {
    scale: -1;
  }

  @media (forced-colors: active) {
    :host([theme~='icon-button']) ::slotted([slot='button']) {
      forced-color-adjust: none;
      --vaadin-button-text-color: CanvasText;
    }
  }
`;
