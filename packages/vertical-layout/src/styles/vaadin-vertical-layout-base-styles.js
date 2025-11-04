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
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Theme variations */
  :host([theme~='margin']) {
    margin: var(--vaadin-vertical-layout-margin, var(--vaadin-padding-m));
  }

  :host([theme~='padding']) {
    padding: var(--vaadin-vertical-layout-padding, var(--vaadin-padding-m));
  }

  :host([theme~='spacing']) {
    gap: var(--vaadin-vertical-layout-gap, var(--vaadin-gap-s));
  }

  :host([theme~='wrap']) {
    flex-wrap: wrap;
  }
`;

// Layout improvements are part of a feature for Flow users where children that have been configured to use full size
// using `HasSize.setSizeFull()` and others, get additional styles so that they effectively take the remaining space in
// the layout, rather than explicitly use 100% width/height. The respective data attributes are set by Flow's `HasSize`
// class.
const enableLayoutImprovements = window.Vaadin.featureFlags.layoutComponentImprovements;
const layoutImprovementStyles = css`
  ::slotted([data-height-full]) {
    flex: 1;
  }

  ::slotted(vaadin-horizontal-layout[data-height-full]),
  ::slotted(vaadin-vertical-layout[data-height-full]) {
    min-height: 0;
  }
`;

export const verticalLayoutStyles = enableLayoutImprovements ? [baseStyles, layoutImprovementStyles] : [baseStyles];
