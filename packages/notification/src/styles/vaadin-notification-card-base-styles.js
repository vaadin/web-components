/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayAnimationStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

export const notificationCardStyles = css`
  ${overlayAnimationStyles}

  :host {
    display: block;
    --vaadin-overlay-animation-duration: 0.3s;
  }

  :host([slot^='top']) {
    display: flex;
    align-items: end;
  }

  :host([slot^='top']) {
    --vaadin-overlay-translate-closed: 0%, -30%;
  }

  :host([slot^='bottom']) {
    --vaadin-overlay-translate-closed: 0%, 30%;
  }

  :host([closing]) {
    --vaadin-overlay-translate-closed: 0%;
  }

  [part='overlay'] {
    pointer-events: auto;
    box-sizing: border-box;
    width: var(--vaadin-notification-width, 40ch);
    max-width: 100%;
    padding: var(--vaadin-notification-padding, var(--vaadin-padding-s));
    background: var(--vaadin-notification-background, var(--vaadin-background-container));
    border: var(--vaadin-notification-border-width, 1px) solid
      var(--vaadin-notification-border-color, var(--vaadin-border-color-secondary));
    box-shadow: var(--vaadin-notification-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3));
    border-radius: var(--vaadin-notification-border-radius, var(--vaadin-radius-l));
    cursor: default;
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      border: 3px solid !important;
    }
  }

  @supports (interpolate-size: allow-keywords) {
    :host {
      interpolate-size: allow-keywords;
      transition-duration: var(--vaadin-overlay-animation-duration);
      transition-property: height, margin-top, margin-bottom;
    }

    @starting-style {
      :host(:not(:nth-child(1 of [slot='middle']))) {
        height: 0;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
    }

    :host([closing]) {
      height: 0;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      transition-delay: var(--vaadin-overlay-animation-duration);
      animation-duration: calc(var(--vaadin-overlay-animation-duration) * 2);
    }
  }

  @supports not (interpolate-size: allow-keywords) {
    :host {
      transition-duration: var(--vaadin-overlay-animation-duration);
      transition-property: max-height, margin-top, margin-bottom;
      max-height: 25em;
    }

    :host([opening]:not(:nth-child(1 of [slot='middle']))) {
      animation: _notification-enter calc(var(--vaadin-overlay-animation-duration) * 3) cubic-bezier(0.5, 1, 0.89, 1);
    }

    :host([closing]) {
      max-height: 0;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      animation-duration: calc(var(--vaadin-overlay-animation-duration) * 1.5);
      transition-delay: calc(var(--vaadin-overlay-animation-duration) / 2);
    }
  }

  @keyframes _notification-enter {
    0% {
      max-height: 0;
    }
  }
`;
