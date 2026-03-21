/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const accordionPanel = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='content'] {
    box-sizing: border-box;
    padding: var(--_vaadin-details-content-padding);
    padding-top: var(--_vaadin-details-content-padding-top);
    margin-inline-start: var(--_vaadin-details-content-margin-inline-start);
  }

  :host(:not([opened])) [part='content'] {
    display: none !important;
  }

  :host([focus-ring]) {
    --_focus-ring: 1;
  }
`;
