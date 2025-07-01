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
      /* How much space to reserve for overlay box shadow */
      --_paint-area: 2em;
      /* Space between notifications and the viewport */
      --_padding: var(--vaadin-notification-viewport-inset, var(--vaadin-padding));
      /* Space between notifications in a stack and how much collapsed cards show below the top most */
      --_gap: var(--vaadin-notification-gap, var(--vaadin-gap-container-block));
      position: fixed;
      z-index: 1000;
      inset: 0;
      box-sizing: border-box;
      display: grid;
      /* top-stretch, top and bottom regions, bottom-stretch */
      grid-template-rows: auto 1fr auto;
      pointer-events: none;
      interpolate-size: allow-keywords;
      padding: var(--_padding);
      overflow: hidden;
    }

    :host > * {
      grid-column: 1;
    }

    [region-group] {
      position: relative;
      grid-row: 2 / 3;
    }

    [region] {
      z-index: 1;
      max-width: 100%;
      max-height: 100%;
      pointer-events: auto;
      scrollbar-width: none;
    }

    [region='top-stretch'] {
      grid-row: 1;
      z-index: 3;
    }

    [region='bottom-stretch'] {
      grid-row: 3;
      z-index: 3;
    }

    [region='middle'],
    [region-group] > [region] {
      position: absolute;
      width: var(--vaadin-notification-width, 40ch);
    }

    [region='middle'] {
      position: fixed;
      z-index: 4;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      max-width: calc(100% - var(--_padding) * 2);
    }

    /* scrollbar-width is supported in Safari 18.2, use the following for earlier */
    [region]::-webkit-scrollbar {
      display: none;
    }

    [region]:where(:hover, :focus-within) {
      overflow: auto;
      overscroll-behavior: contain;
      z-index: 2;
      padding: var(--_paint-area);
    }

    [region]:not([region='middle']):where(:hover, :focus-within) {
      margin: calc(var(--_paint-area) * -1);
    }

    [region-group='top'] > [region] {
      top: 0;
    }

    [region-group='bottom'] > [region] {
      bottom: 0;
    }

    [region-group] > [region$='start'] {
      inset-inline-start: 0;
    }

    [region-group] > [region$='center'] {
      inset-inline-start: 50%;
      translate: -50%;
      margin-inline: 0;
    }

    [region-group] > [region$='end'] {
      inset-inline-end: 0;
    }

    ::slotted(*) {
      margin-bottom: var(--_gap);
      transition: 400ms var(--vaadin-ease-fluid);
      position: relative;
      z-index: calc(var(--order) * -1);
      --_inset: calc(var(--_paint-area) * -1);
      --_clip-path: inset(var(--_inset));
    }

    :is([region^='bottom'], [region='middle']) ::slotted(*) {
      margin-top: var(--_gap);
      margin-bottom: 0;
    }

    @keyframes enter {
      0% {
        translate: var(--_enter-translate, 0 100%);
        margin-block: 0;
        height: var(--_enter-height, auto);
        max-height: var(--_enter-max-height, none);
      }
    }

    ::slotted(:is([opening], [closing])) {
      animation: enter 400ms var(--vaadin-ease-fluid);
      z-index: 9999;
    }

    ::slotted([closing]) {
      animation-direction: reverse;
    }

    [region]:not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
      --_inset-exclude: calc(100% - var(--_gap) - 2px);
      --_clip-path: inset(var(--_inset-exclude) var(--_inset) var(--_inset) var(--_inset));
    }

    :is([region^='bottom'], [region='middle']):not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
      --_clip-path: inset(var(--_inset) var(--_inset) var(--_inset-exclude) var(--_inset));
      --vaadin-notification-box-shadow: none;
    }

    @supports (interpolate-size: allow-keywords) {
      ::slotted(*) {
        --_enter-height: 0;
      }

      [region]:not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
        height: 0;
        --_clip-path-duration: 450ms;
      }
    }

    @supports not (interpolate-size: allow-keywords) {
      ::slotted(*) {
        max-height: 25em;
        --_enter-max-height: 0;
        --_clip-path-duration: 250ms;
      }

      [region]:not(:hover, :focus-within) ::slotted(:not([style*='order: 1;'])) {
        --_clip-path-duration: 500ms;
        max-height: 0;
      }
    }

    [region]:not(:hover, :focus-within) {
      ::slotted([style*='order: 2;']) {
        scale: 0.94;
      }

      ::slotted([style*='order: 3;']) {
        scale: 0.86;
      }

      ::slotted(:not([style*='order: 1;'], [style*='order: 2;'], [style*='order: 3;'])) {
        scale: 0.78;
        --_opacity: 0;
        margin-block: 0;
      }
    }
  }
`;
