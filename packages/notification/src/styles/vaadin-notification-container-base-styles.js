/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const notificationContainerStyles = css`
  :host {
    /* How much space to reserve for overlay box shadow, to prevent clipping it with overflow:auto */
    --_paint-area: 2em;
    /* Space between notifications and the viewport */
    --_padding: var(--vaadin-notification-viewport-inset, var(--vaadin-padding-s));
    /* Space between notifications */
    --_gap: var(--vaadin-notification-container-gap, var(--vaadin-gap-s));
    display: grid;
    /* top-stretch, top and bottom regions, bottom-stretch */
    grid-template-rows: auto 1fr auto;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: max(env(safe-area-inset-top, 0px), var(--_padding)) max(env(safe-area-inset-right, 0px), var(--_padding))
      max(env(safe-area-inset-bottom, 0px), var(--_padding)) max(env(safe-area-inset-left, 0px), var(--_padding));
    border: 0;
    background: transparent;
    pointer-events: none;
    interpolate-size: allow-keywords;
  }

  :host > * {
    grid-column: 1;
  }

  [region-group] {
    position: relative;
    grid-row: 2 / 3;
  }

  [region] {
    max-width: 100%;
    max-height: 100%;
    pointer-events: auto;
    scrollbar-width: none;
  }

  /* scrollbar-width is supported since Safari 18.2, use the following for earlier */
  [region]::-webkit-scrollbar {
    display: none;
  }

  [region='top-stretch'] {
    grid-row: 1;
    z-index: 2;
    --vaadin-notification-width: 100%;
  }

  [region='bottom-stretch'] {
    grid-row: 3;
    z-index: 2;
    --vaadin-notification-width: 100%;
  }

  [region='middle'],
  [region-group] > [region] {
    position: absolute;
  }

  [region='middle'] {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    max-width: calc(100% - var(--_padding) * 2);
  }

  [region]:where(:hover, :focus-within) {
    z-index: 1;
    overflow: auto;
    overscroll-behavior: contain;
    padding: var(--_paint-area);
  }

  [region]:not([region='middle'], [region$='center']):where(:hover, :focus-within) {
    margin-inline: calc(var(--_paint-area) * -1);
  }

  [region]:not([region='middle']):where(:hover, :focus-within) {
    margin-block: calc(var(--_paint-area) * -1);
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
    left: 50%;
    translate: -50%;
  }

  [region-group] > [region$='end'] {
    inset-inline-end: 0;
  }

  ::slotted(*) {
    margin-bottom: var(--_gap);
  }

  :is([region^='bottom'], [region='middle']) ::slotted(*) {
    margin-top: var(--_gap);
    margin-bottom: 0;
  }
`;
