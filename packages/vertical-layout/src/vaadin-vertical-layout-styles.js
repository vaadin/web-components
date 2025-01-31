/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
    margin: 1em;
  }

  :host([theme~='padding']) {
    padding: 1em;
  }

  :host([theme~='spacing']) {
    gap: 1em;
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
