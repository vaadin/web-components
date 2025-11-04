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
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
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
    --vaadin-input-field-value-color: var(--vaadin-input-field-disabled-text-color, var(--vaadin-text-color-disabled));
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
`;
