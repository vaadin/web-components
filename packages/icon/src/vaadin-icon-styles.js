/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const iconStyles = css`
  :host {
    align-items: center;
    box-sizing: border-box;
    container-type: size;
    display: inline-flex;
    fill: currentColor;
    height: 24px;
    justify-content: center;
    vertical-align: middle;
    width: 24px;
  }

  :host::after,
  :host::before {
    font-size: 100cqh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1;
    text-rendering: optimizeLegibility;
  }

  :host([hidden]) {
    display: none !important;
  }

  svg {
    display: block;
    height: 100%;
    /* prevent overflowing icon from clipping, see https://github.com/vaadin/flow-components/issues/5872 */
    overflow: visible;
    width: 100%;
  }

  :host(:is([icon-class], [font-icon-content])) svg {
    display: none;
  }

  :host([font-icon-content])::before {
    content: attr(font-icon-content);
  }
`;
