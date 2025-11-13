/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageInputButtonStyles = css`
  :host {
    flex: none;
    align-self: end;
    margin: var(
      --vaadin-input-field-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    --vaadin-button-border-width: 0;
    --vaadin-button-background: transparent;
    --vaadin-button-text-color: var(--vaadin-text-color);
    --vaadin-button-padding: 0;
  }
`;
