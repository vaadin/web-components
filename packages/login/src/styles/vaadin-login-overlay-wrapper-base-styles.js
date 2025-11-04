/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const loginOverlayWrapper = css`
  [part='overlay'] {
    background: var(
      --vaadin-login-overlay-background,
      var(--vaadin-overlay-background, var(--vaadin-background-color))
    );
    border: var(--vaadin-login-overlay-border-width, var(--vaadin-overlay-border-width, 1px)) solid
      var(--vaadin-login-overlay-border-color, var(--vaadin-overlay-border-color, var(--vaadin-border-color-secondary)));
    border-radius: var(--vaadin-login-overlay-border-radius, var(--vaadin-radius-l));
    box-shadow: var(--vaadin-login-overlay-shadow, var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3)));
  }

  [part='card'] {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    overflow: hidden;
  }

  [part='brand'] {
    background: var(--vaadin-login-overlay-brand-background, var(--vaadin-background-container));
    display: flex;
    flex-direction: column;
    padding: var(--vaadin-login-overlay-brand-padding, var(--vaadin-padding-l));
  }

  ::slotted([slot='title']) {
    color: var(--vaadin-login-overlay-title-color, var(--vaadin-text-color));
    font-size: var(--vaadin-login-overlay-title-font-size, inherit);
    font-weight: var(--vaadin-login-overlay-title-font-weight, 600);
    line-height: var(--vaadin-login-overlay-title-line-height, inherit);
  }

  [part='description'] {
    color: var(--vaadin-login-overlay-description-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-login-overlay-description-font-size, inherit);
    font-weight: var(--vaadin-login-overlay-description-font-weight, inherit);
    line-height: var(--vaadin-login-overlay-description-line-height, inherit);
  }
`;

export const loginOverlayWrapperStyles = [overlayStyles, loginOverlayWrapper];
