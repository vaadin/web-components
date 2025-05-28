/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const gridFilterStyles = css`
  :host {
    display: inline-flex;
    max-width: 100%;
  }

  ::slotted(*) {
    width: 100%;
    box-sizing: border-box;
  }
`;
