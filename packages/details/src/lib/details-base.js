/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const styles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='content'] {
    display: none;
  }

  :host([opened]) [part='content'] {
    display: block;
  }
`;

export const template = (html) => html`
  <slot name="summary"></slot>
  <div part="content">
    <slot></slot>
  </div>
  <slot name="tooltip"></slot>
`;
