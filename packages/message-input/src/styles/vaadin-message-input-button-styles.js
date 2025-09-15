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
    margin: var(--vaadin-input-field-padding, var(--vaadin-padding-container));
    --vaadin-button-border-width: 0;
    --vaadin-button-background: transparent;
    --vaadin-button-text-color: var(--vaadin-color);
    --vaadin-button-padding: 0;
  }

  :host([theme~='icon-button']) {
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    color: transparent;
    position: relative;
    contain: strict;
  }

  :host([theme~='icon-button'])::before {
    content: '';
    position: absolute;
    inset: 0;
    mask-image: var(--_vaadin-icon-paper-airplane);
    background: var(--vaadin-button-text-color);
  }

  :host([dir='rtl'][theme~='icon-button'])::before {
    scale: -1;
  }

  @media (forced-colors: active) {
    :host([theme~='icon-button']) {
      forced-color-adjust: none;
      --vaadin-button-text-color: CanvasText;
    }
  }
`;
