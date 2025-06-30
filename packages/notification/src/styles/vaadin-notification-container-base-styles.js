/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const notificationContainerStyles = css`
  @layer base {
    :host {
      position: fixed;
      z-index: 1000;
      inset: 0;
      box-sizing: border-box;
      display: grid;
      gap: 1px;
      /* top-stretch, top and bottom regions, bottom-stretch */
      grid-template-rows: auto 1fr auto;
      pointer-events: none;
      interpolate-size: allow-keywords;
    }

    :host > * {
      grid-column: 1;
    }

    [region-group] {
      position: relative;
    }

    [region-group='top'] {
      grid-row: 2 / 4;
    }

    [region-group='bottom'] {
      grid-row: 1 / 3;
    }

    [region='top-stretch'] {
      grid-row: 1;
      padding-top: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
      margin-bottom: calc(var(--vaadin-notification-margin, var(--_vaadin-gap-container-block)) * -1);
    }

    [region='bottom-stretch'] {
      grid-row: 3;
      padding-bottom: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
      margin-top: calc(var(--vaadin-notification-margin, var(--_vaadin-gap-container-block)) * -1);
    }

    [region='middle'],
    [region-group] > [region] {
      position: absolute;
      width: min(100%, var(--vaadin-notification-width, 40ch));
      max-height: 100%;
      box-sizing: border-box;
    }

    [region] {
      z-index: 1;
    }

    [region='middle'] {
      position: fixed;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      padding-top: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
    }

    [region] {
      pointer-events: auto;
      scrollbar-width: none;
    }

    /* scrollbar-width is supported in Safari 18.2, use the following for earlier */
    [region]::-webkit-scrollbar {
      display: none;
    }

    [region]:is(:hover, :focus-within) {
      overflow: auto;
      overscroll-behavior: contain;
      z-index: 2;
    }

    [region-group='top'] > [region] {
      top: 0;
      padding-top: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
    }

    [region-group='bottom'] > [region] {
      bottom: 0;
      padding-bottom: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
    }

    [region-group] > [region$='start'] {
      inset-inline-start: 0;
    }

    [region-group] > [region$='center'] {
      inset-inline-start: 50%;
      translate: -50%;
    }

    [region-group] > [region$='end'] {
      inset-inline-end: 0;
    }

    ::slotted(*) {
      margin: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
      margin-top: 0;
      transition: 400ms var(--_vaadin-ease-in-out-quart);
      position: relative;
      z-index: calc(var(--order) * -1);
    }

    [region^='bottom'] ::slotted(*) {
      margin-top: var(--vaadin-notification-margin, var(--_vaadin-gap-container-block));
      margin-bottom: 0;
    }

    @keyframes enter {
      0% {
        opacity: 0;
        translate: var(--_enter-translate, 0 100%);
        margin-block: 0;
        height: var(--_enter-height, auto);
        max-height: var(--_enter-max-height, none);
      }
    }

    ::slotted(:is([opening], [closing])) {
      animation: enter 400ms var(--_vaadin-ease-in-out-quart);
    }

    ::slotted([closing]) {
      animation-direction: reverse;
    }

    ::slotted(:not([style*='order: 1;'])) {
      clip-path: inset(-2em -1em -1em -1em);
    }

    [region^='bottom'] ::slotted(:not([style*='order: 1;'])) {
      clip-path: inset(-1em -1em -2em -1em);
    }

    [region]:has(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
      clip-path: inset(-1em);
    }

    @supports (interpolate-size: allow-keywords) {
      ::slotted(*) {
        --_enter-height: 0;
      }

      [region]:not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
        height: 0;
      }
    }

    @supports not (interpolate-size: allow-keywords) {
      ::slotted(*) {
        max-height: 25em;
        --_enter-max-height: 0;
      }

      [region]:not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
        max-height: 0;
      }
    }

    [region]:not(:hover, :focus-within) {
      ::slotted([style*='order: 2;']) {
        scale: 0.96;
      }

      ::slotted([style*='order: 3;']) {
        scale: 0.9;
      }

      ::slotted(:not([style*='order: 1;'], [style*='order: 2;'], [style*='order: 3;'])) {
        scale: 0.84;
        opacity: 0;
        margin-block: 0;
      }
    }
  }
`;
