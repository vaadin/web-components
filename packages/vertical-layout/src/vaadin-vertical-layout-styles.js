/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, unsafeCSS } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const enableLayoutImprovements = window.Vaadin.featureFlags.layoutImprovements;

export const verticalLayoutStyles = css`
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

  ${enableLayoutImprovements
    ? unsafeCSS`
    ::slotted([data-full-height]) {
      flex: 1;
    }
  
    ::slotted(vaadin-horizontal-layout[data-full-height]),
    ::slotted(vaadin-vertical-layout[data-full-height]) {
      min-height: 0;
    }
  `
    : unsafeCSS``}
`;
