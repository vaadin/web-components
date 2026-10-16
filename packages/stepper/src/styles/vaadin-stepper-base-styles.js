/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const stepperStyles = css`
  :host {
    display: flex;
    align-items: flex-start;
    gap: var(--vaadin-stepper-gap, 0);
    font-size: var(--vaadin-stepper-font-size, 1em);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([orientation='vertical']) {
    flex-direction: column;
    align-items: stretch;
  }

  :host([theme~='small']) {
    --vaadin-stepper-indicator-size: 1.25rem;
    --vaadin-stepper-indicator-font-size: 0.75em;
    --vaadin-stepper-font-size: 0.875em;
  }
`;
