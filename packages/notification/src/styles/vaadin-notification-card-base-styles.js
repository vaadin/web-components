/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayAnimationStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-animation-base-styles.js';

const notificationCard = css`
  :host {
    display: block;
    position: relative;
    --vaadin-overlay-animation-duration: 0.3s;
    --vaadin-overlay-animation-delay: 0.1s;
    transition-duration: var(--vaadin-overlay-animation-duration);
  }

  :host([slot^='top']) {
    display: flex;
    align-items: end;
    --vaadin-overlay-translate-closed: 0% -30%;
  }

  :host([slot^='bottom']) {
    --vaadin-overlay-translate-closed: 0% 30%;
  }

  /* Cards on the sides slide in horizontally, once the vertical collapse is done */
  @media (min-width: 600px) and (min-height: 600px) {
    :host([slot$='start']) {
      --vaadin-overlay-translate-closed: -30% 0%;
      --vaadin-overlay-animation-delay: var(--vaadin-overlay-animation-duration);
    }

    :host([slot$='end']) {
      --vaadin-overlay-translate-closed: 30% 0%;
      --vaadin-overlay-animation-delay: var(--vaadin-overlay-animation-duration);
    }
  }

  /* Cards scale down in place instead of sliding back out */
  :host([closing]) {
    --vaadin-overlay-translate-closed: 0%;
    --vaadin-overlay-scale-closed: 0.98;
    --vaadin-overlay-animation-delay: 0s;
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

  /* The other cards make room for a card that opens, and close the gap when it is removed */
  @supports (interpolate-size: allow-keywords) {
    :host {
      interpolate-size: allow-keywords;
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

  /* Without interpolate-size, only the margins animate, and max-height stands in for the height */
  @supports not (interpolate-size: allow-keywords) {
    :host {
      transition-property: margin-top, margin-bottom;
    }

    /* Set while opening only, so that a card taller than this is never cut off once it is open */
    :host([opening]) {
      max-height: 25em;
    }

    :host([opening]:not(:nth-child(1 of [slot='middle']))) {
      animation: --notification-enter
        calc(var(--vaadin-overlay-animation-duration) + var(--vaadin-overlay-animation-delay));
    }

    :host([closing]) {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  @media (prefers-reduced-motion) {
    :host {
      transition-duration: 0s;
    }

    /* The height animation of the fallback above is a keyframe animation, not a transition */
    :host([opening]:not(:nth-child(1 of [slot='middle']))) {
      animation-name: --no-op;
    }

    :host([closing]) {
      transition-delay: var(--vaadin-overlay-animation-duration);
    }
  }

  @keyframes --notification-enter {
    0% {
      max-height: 0;
    }
  }
`;

export const notificationCardStyles = [overlayAnimationStyles, notificationCard];
