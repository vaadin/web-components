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
    transition-duration: var(--vaadin-overlay-animation-duration);
  }

  :host([closing]) [part='overlay'] {
    animation-fill-mode: both;
  }

  /*
   * This empty animation only reports the state of the card. The card needs one of its own,
   * because what collapses it is a transition, which does not report the state, and because
   * the same keyframes run for both states, so nothing restarts when it closes right away.
   */
  :host(:where([opening], [closing])) {
    animation-name: --no-op;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-delay: var(--vaadin-overlay-animation-delay);
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

  :host([closing]) {
    animation-direction: reverse;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-delay: var(--vaadin-overlay-animation-duration);
    transition-delay: var(--vaadin-overlay-animation-duration);
  }

  /* Cards scale down in place instead of sliding back out */
  /* WebKit/Safari needs these to be explicitly set on the part=overlay element as well */
  :host([closing]),
  :host([closing]) [part='overlay'] {
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
  @media (prefers-reduced-motion: no-preference) {
    @supports (interpolate-size: allow-keywords) {
      :host {
        interpolate-size: allow-keywords;
        transition-property: height, margin-top, margin-bottom;
      }

      @starting-style {
        :host([opening]:not(:nth-child(1 of [slot='middle']))),
        :host([closing]) {
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
      }
    }

    /* Without interpolate-size, only the margins animate, and max-height stands in for the height */
    @supports not (interpolate-size: allow-keywords) {
      :host([opening]:not(:nth-child(1 of [slot='middle']))),
      :host([closing]) {
        animation-name: --notification-max-height, --notification-margins;
        animation-duration: calc(var(--vaadin-overlay-animation-duration) * 2 + var(--vaadin-overlay-animation-delay));
        animation-delay: 0s;
        animation-timing-function: ease-in-out, cubic-bezier(0.4, 1.1, 0, 1);
      }
    }
  }

  @media (prefers-reduced-motion) {
    /* The height animation of the fallback above is a keyframe animation, not a transition */
    :host(:is([opening], [closing])) {
      animation-name: --fade !important;
    }
  }

  @keyframes --no-op {
  }

  @keyframes --notification-max-height {
    0% {
      max-height: 0;
    }

    50% {
      max-height: 20em;
    }
  }

  @keyframes --notification-margins {
    0% {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
`;

export const notificationCardStyles = [overlayAnimationStyles, notificationCard];
