/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const notificationCardStyles = css`
  @layer base {
    @keyframes enter {
      0% {
        opacity: 0;
        translate: var(--_enter-translate, 0 100%);
        margin-block: 0;
        height: var(--_enter-height, auto);
        max-height: var(--_enter-max-height, none);
      }
    }

    :host {
      display: block;
    }

    [part='overlay'] {
      pointer-events: auto;
      box-sizing: border-box;
      width: 100%;
      padding: var(--vaadin-notification-padding, var(--_vaadin-padding));
      background: var(--vaadin-notification-background, var(--_vaadin-background-container));
      box-shadow:
        0 0 0 var(--vaadin-notification-border-width, 1px) var(--vaadin-notification-border-color, rgba(0, 0, 0, 0.1)),
        var(--vaadin-notification-box-shadow, 0 3px 10px -2px rgba(0, 0, 0, 0.15));
      border-radius: var(--vaadin-notification-border-radius, var(--_vaadin-radius-l));
      cursor: default;
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
  }
`;
