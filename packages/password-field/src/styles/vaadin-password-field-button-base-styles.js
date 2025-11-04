/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';

const passwordFieldBase = css`
  :host {
    --vaadin-button-background: transparent;
    --vaadin-button-padding: 0;
    color: var(--vaadin-input-field-button-text-color, inherit);
    display: block;
    border: none;
    cursor: var(--vaadin-clickable-cursor);
  }

  :host::before {
    background: currentColor;
    content: '';
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-eye) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    width: var(--vaadin-icon-size, 1lh);
  }

  :host([aria-pressed='true'])::before {
    mask-image: var(--_vaadin-icon-eye-slash);
  }

  @media (forced-colors: active) {
    :host::before {
      background: CanvasText;
    }

    :host([disabled])::before {
      background: GrayText;
    }
  }
`;

export const passwordFieldButton = [buttonStyles, passwordFieldBase];
