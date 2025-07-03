/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const scrollerStyles = css`
  :host {
    display: block;
    overflow: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([scroll-direction='vertical']) {
    overflow-x: hidden;
  }

  :host([scroll-direction='horizontal']) {
    overflow-y: hidden;
  }

  :host([scroll-direction='none']) {
    overflow: hidden;
  }
`;
