/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
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
    background: var(--vaadin-login-overlay-background, var(--vaadin-background-container));
    display: flex;
    flex-direction: column;
    padding: var(--vaadin-login-overlay-padding, var(--vaadin-padding));
  }

  [part='title'] {
    color: var(--vaadin-login-overlay-title-color, var(--vaadin-color));
    font-size: var(--vaadin-login-overlay-title-font-size, inherit);
    font-weight: var(--vaadin-login-overlay-title-font-weight, 600);
    line-height: var(--vaadin-login-overlay-title-line-height, inherit);
  }

  [part='description'] {
    color: var(--vaadin-login-overlay-description-color, var(--vaadin-color-subtle));
    font-size: var(--vaadin-login-overlay-description-font-size, inherit);
    font-weight: var(--vaadin-login-overlay-description-font-weight, inherit);
    line-height: var(--vaadin-login-overlay-description-line-height, inherit);
  }

  [part='form'] ::slotted(vaadin-login-form) {
    display: flex;
  }
`;

export const loginOverlayWrapperStyles = [overlayStyles, loginOverlayWrapper];
