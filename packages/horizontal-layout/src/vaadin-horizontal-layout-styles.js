/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const horizontalLayoutStyles = css`
  :host {
    display: flex;
    box-sizing: border-box;
    --_vaadin-spacing-xs: var(--vaadin-spacing-xs, 0.25rem);
    --_vaadin-spacing-s: var(--vaadin-spacing-s, 0.5rem);
    --_vaadin-spacing-m: var(--vaadin-spacing-m, 1rem);
    --_vaadin-spacing-l: var(--vaadin-spacing-l, 1.5rem);
    --_vaadin-spacing-xl: var(--vaadin-spacing-xl, 2.5rem);
    --_gap: var(--_vaadin-spacing-m);
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
    gap: var(--_gap);
  }
`;
