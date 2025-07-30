/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const notificationCardStyles = css`
  @keyframes enter {
    0% {
      translate: var(--_enter-translate, 0 100%);
      margin-block: 0;
      height: var(--_enter-height, auto);
      max-height: var(--_enter-max-height, none);
    }
  }

  @keyframes enter-overlay {
    0% {
      opacity: 0;
    }
  }

  @keyframes exit-overlay {
    100% {
      opacity: 0;
    }
  }

  :host {
    display: block;
  }

  [part='overlay'] {
    pointer-events: auto;
    box-sizing: border-box;
    width: 100%;
    padding: var(--vaadin-notification-padding, var(--vaadin-padding));
    background: var(--vaadin-notification-background, var(--vaadin-background-container));
    border: var(--vaadin-notification-border-width, 1px) solid
      var(--vaadin-notification-border-color, var(--vaadin-border-color));
    box-shadow: var(--vaadin-notification-box-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3));
    border-radius: var(--vaadin-notification-border-radius, var(--vaadin-radius-l));
    cursor: default;
    animation: enter-overlay 400ms var(--vaadin-ease-fluid);
    clip-path: var(--_clip-path);
    opacity: var(--_opacity);
    transition: 400ms var(--vaadin-ease-fluid);
    transition-property: clip-path, opacity, box-shadow;
    transition-duration: var(--_clip-path-duration, 400ms), 400ms, 400ms;
  }

  :host([closing]) [part='overlay'] {
    animation: exit-overlay 400ms var(--vaadin-ease-fluid);
  }

  :host([slot^='top']) {
    display: flex;
    align-items: end;
    --_enter-translate: 0 -100%;
  }

  @media (forced-colors: active) {
    [part='overlay'] {
      border: 3px solid;
    }
  }
`;
