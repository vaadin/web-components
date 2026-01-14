/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const sliderStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;
