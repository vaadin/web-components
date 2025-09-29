/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const loginFormWrapperStyles = css`
  :host {
    background: var(--vaadin-login-form-background, transparent);
    border-radius: var(--vaadin-login-form-border-radius, 0);
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    gap: var(--vaadin-login-form-gap, var(--vaadin-gap-l));
    padding: var(--vaadin-login-form-padding, var(--vaadin-padding-l));
    max-width: 100%;
    width: var(--vaadin-login-form-width, 360px);
  }

  :host([hidden]) {
    display: none !important;
  }

  ::slotted(form) {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-login-form-gap, var(--vaadin-gap-m));
  }

  ::slotted([slot='form-title']) {
    color: var(--vaadin-login-form-title-color, var(--vaadin-text-color));
    font-size: var(--vaadin-login-form-title-font-size, 1.25rem);
    font-weight: var(--vaadin-login-form-title-font-weight, 600);
    line-height: var(--vaadin-login-form-title-line-height, inherit);
  }

  :host([error]) [part='error-message'] {
    display: grid;
  }

  [part='error-message'] {
    color: var(--vaadin-login-form-error-color, var(--vaadin-text-color));
    font-size: var(--vaadin-login-form-error-font-size, inherit);
    font-weight: var(--vaadin-login-form-error-font-weight, 400);
    gap: var(--vaadin-login-form-error-gap, 0 var(--vaadin-gap-s));
    grid-template-columns: auto 1fr;
    line-height: var(--vaadin-login-form-error-line-height, inherit);
  }

  [part='error-message']::before {
    background: currentColor;
    content: '';
    display: inline-block;
    flex: none;
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-warn) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    width: var(--vaadin-icon-size, 1lh);
  }

  [part='error-message-description'] {
    grid-column: 2;
  }
`;
