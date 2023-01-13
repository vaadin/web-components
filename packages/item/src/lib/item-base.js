/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const styles = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }
`;

export const template = (html) => html`
  <span part="checkmark" aria-hidden="true"></span>
  <div part="content">
    <slot></slot>
  </div>
`;
