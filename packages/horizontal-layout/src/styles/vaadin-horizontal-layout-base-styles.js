/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: flex;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Theme variations */
  :host([theme~='margin']) {
    margin: var(--vaadin-horizontal-layout-margin, var(--vaadin-padding-m));
  }

  :host([theme~='padding']) {
    padding: var(--vaadin-horizontal-layout-padding, var(--vaadin-padding-m));
  }

  :host([theme~='spacing']) {
    gap: var(--vaadin-horizontal-layout-gap, var(--vaadin-gap-s));
  }

  :host([theme~='wrap']) {
    flex-wrap: wrap;
  }

  :host([has-end]:not([has-middle])) ::slotted([last-start-child]) {
    margin-inline-end: auto;
  }

  ::slotted([first-middle-child]) {
    margin-inline-start: auto;
  }

  ::slotted([last-middle-child]) {
    margin-inline-end: auto;
  }

  :host(:not([has-middle])) ::slotted([first-end-child]) {
    margin-inline-start: auto;
  }
`;

// Layout improvements are part of a feature for Flow users where children that have been configured to use full size
// using `HasSize.setSizeFull()` and others, get additional styles so that they effectively take the remaining space in
// the layout, rather than explicitly use 100% width/height. The respective data attributes are set by Flow's `HasSize`
// class.
const enableLayoutImprovements = window.Vaadin.featureFlags.layoutComponentImprovements;
const layoutImprovementStyles = css`
  ::slotted([data-width-full]) {
    flex: 1;
  }

  ::slotted(vaadin-horizontal-layout[data-width-full]),
  ::slotted(vaadin-vertical-layout[data-width-full]) {
    min-width: 0;
  }
`;

export const horizontalLayoutStyles = enableLayoutImprovements ? [baseStyles, layoutImprovementStyles] : [baseStyles];
