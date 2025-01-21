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
    --vaadin-spacing-xs: 0.25rem;
    --vaadin-spacing-s: 0.5rem;
    --vaadin-spacing-m: 1rem;
    --vaadin-spacing-l: 1.5rem;
    --vaadin-spacing-xl: 2.5rem;
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
    gap: var(--vaadin-spacing-m);
  }
`;
