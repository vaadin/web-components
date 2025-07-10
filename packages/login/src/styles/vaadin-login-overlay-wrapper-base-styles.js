/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const loginOverlayWrapper = css`
  [part='overlay'] {
    outline: none;
  }

  [part='card'] {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    overflow: hidden;
  }

  [part='brand'] {
    background: var(--vaadin-login-brand-background, var(--vaadin-background-container));
    display: flex;
    flex-direction: column;
    padding: var(--vaadin-login-brand-padding, var(--vaadin-padding));
  }

  [part='title'] {
    color: var(--vaadin-login-title-color, var(--vaadin-color));
    font-size: var(--vaadin-login-title-font-size, inherit);
    font-weight: var(--vaadin-login-title-font-weight, 600);
    line-height: var(--vaadin-login-title-line-height, inherit);
  }

  [part='description'] {
    color: var(--vaadin-login-description-color, var(--vaadin-color-subtle));
    font-size: var(--vaadin-login-description-font-size, inherit);
    font-weight: var(--vaadin-login-description-font-weight, inherit);
    line-height: var(--vaadin-login-description-line-height, inherit);
  }

  [part='form'] ::slotted(vaadin-login-form) {
    display: flex;
  }
`;

export const loginOverlayWrapperStyles = [overlayStyles, loginOverlayWrapper];
