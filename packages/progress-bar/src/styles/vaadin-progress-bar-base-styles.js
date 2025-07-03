/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const progressBarStyles = css`
  @layer base {
    :host {
      display: block;
      width: 100%; /* prevent collapsing inside non-stretching column flex */
      height: 0.5lh;
      contain: layout size;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part='bar'] {
      box-sizing: border-box;
      height: 100%;
      --_padding: var(--vaadin-progress-bar-padding, 0px);
      padding: var(--_padding); /* stylelint-disable-line length-zero-no-unit */
      background: var(--vaadin-progress-bar-background, var(--vaadin-background-container));
      border-radius: var(--vaadin-progress-bar-border-radius, var(--vaadin-radius-m));
      border: var(--vaadin-progress-bar-border-width, 1px) solid
        var(--vaadin-progress-bar-border-color, var(--vaadin-border-color));
    }

    [part='value'] {
      box-sizing: border-box;
      height: 100%;
      width: calc(var(--vaadin-progress-value) * 100%);
      background: var(--vaadin-progress-bar-value-background, var(--vaadin-border-color-strong));
      border-radius: calc(
        var(--vaadin-progress-bar-border-radius, var(--vaadin-radius-m)) - var(
            --vaadin-progress-bar-border-width,
            1px
          ) - var(--_padding)
      );
      transition: width 150ms;
    }

    /* Indeterminate progress */
    :host([indeterminate]) [part='value'] {
      --_w-min: clamp(0.5em, 5%, 1em);
      --_w-max: clamp(1em, 20%, 8em);
      animation: indeterminate var(--vaadin-progress-bar-animation-duration, 1s) linear infinite alternate;
      width: var(--_w-min);
    }

    :host([indeterminate][aria-valuenow]) [part='value'] {
      animation-delay: 150ms;
    }

    @keyframes indeterminate {
      0% {
        animation-timing-function: ease-in;
      }

      20% {
        margin-inline-start: 0%;
        width: var(--_w-max);
      }

      50% {
        margin-inline-start: calc(50% - var(--_w-max) / 2);
      }

      80% {
        width: var(--_w-max);
        margin-inline-start: calc(100% - var(--_w-max));
        animation-timing-function: ease-out;
      }

      100% {
        width: var(--_w-min);
        margin-inline-start: calc(100% - var(--_w-min));
      }
    }

    @keyframes indeterminate-reduced {
      100% {
        opacity: 0.2;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part='value'] {
        transition: none;
      }

      :host([indeterminate]) [part='value'] {
        width: 25%;
        animation: indeterminate-reduced 2s linear infinite alternate;
      }
    }
  }
`;
