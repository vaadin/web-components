/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, unsafeCSS } from 'lit';
import { registerCSSProperty } from '@vaadin/component-base/src/css-utils.js';

/**
 * The custom properties that make up the overlay animation CSS API. Both the
 * property registrations and the `overlayAnimationProperties` snippet below are
 * derived from this list, so a new property only needs to be added here.
 *
 * Only the closed state is part of the API. The opened state is left out of the
 * keyframes so that it comes from the part itself, see the keyframes below.
 *
 * `--vaadin-overlay-transform-closed` has no initial value, which makes it resolve
 * to `none` in the keyframes unless a theme sets it.
 */
const animationProperties = [
  { name: '--vaadin-overlay-animation-duration', syntax: '<time>', initialValue: '0s' },
  { name: '--vaadin-overlay-animation-delay', syntax: '<time>', initialValue: '0s' },
  { name: '--vaadin-overlay-animation-timing-function', syntax: '*', initialValue: 'ease' },
  { name: '--vaadin-overlay-opacity-closed', syntax: '<number>', initialValue: '0' },
  { name: '--vaadin-overlay-translate-closed', syntax: '<length>+ | <percentage>+', initialValue: '0px' },
  { name: '--vaadin-overlay-scale-closed', syntax: '<number> | <percentage>', initialValue: '1' },
  { name: '--vaadin-overlay-transform-closed', syntax: '*' },
];

animationProperties.forEach((property) => {
  registerCSSProperty({ inherits: false, ...property });
});

/**
 * The overlay animation properties as a set of `inherit` declarations. The properties are
 * registered as non-inheriting, so components with more than one shadow root boundary
 * between the host and the overlay need to forward them explicitly.
 */
export const overlayAnimationProperties = unsafeCSS(
  animationProperties.map(({ name }) => `${name}: inherit;`).join('\n'),
);

export const overlayAnimationStyles = css`
  :host,
  [part='overlay'],
  [part='backdrop'] {
    ${overlayAnimationProperties}
  }

  :host(:where([opening], [closing])) {
    /* This empty animation only reports the state, the parts run the visible animation */
    /* The state ends with it, so a theme animating a part for longer must extend the duration */
    animation-name: --no-op;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-delay: var(--vaadin-overlay-animation-delay);
  }

  :host(:where([closing])) [part='overlay'],
  :host(:where([closing])) ::slotted(*) {
    pointer-events: none !important;
  }

  :host(:where([opening], [closing])) :is([part='overlay'], [part='backdrop']) {
    animation-name: --fade, --transform;
    animation-duration: var(--vaadin-overlay-animation-duration);
    animation-timing-function: var(--vaadin-overlay-animation-timing-function);
    animation-delay: var(--vaadin-overlay-animation-delay);
    /* Fill backwards only, so the closed value applies during the delay without overriding theme styles */
    animation-fill-mode: backwards;

    @media (prefers-reduced-motion) {
      animation-name: --fade;
    }
  }

  :host(:where([opening], [closing])) [part='backdrop'] {
    animation-name: --fade;
    animation-timing-function: linear;
    --vaadin-overlay-opacity-closed: 0;
  }

  :host(:where([closing])) :is([part='overlay'], [part='backdrop']) {
    animation-direction: reverse;
  }

  @keyframes --no-op {
  }

  /* Only the closed state is declared, so the animations end at the value the part already has */
  @keyframes --transform {
    0% {
      transform: var(--vaadin-overlay-transform-closed);
      translate: var(--vaadin-overlay-translate-closed);
      scale: var(--vaadin-overlay-scale-closed);
    }
  }

  @keyframes --fade {
    0% {
      opacity: var(--vaadin-overlay-opacity-closed);
    }
  }
`;
