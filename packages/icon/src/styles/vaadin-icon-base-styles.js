/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const iconStyles = css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    vertical-align: middle;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    flex: none;
    fill: var(--vaadin-icon-color, currentColor);
    container-type: size;
  }

  :host::after,
  :host::before {
    line-height: 1;
    font-size: 100cqh;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }

  :host([hidden]) {
    display: none !important;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    /* prevent overflowing icon from clipping, see https://github.com/vaadin/flow-components/issues/5872 */
    overflow: visible;
  }

  :host(:is([icon-class], [font-icon-content])) svg {
    display: none;
  }

  :host([font-icon-content])::before {
    content: attr(font-icon-content);
  }

  .baseline {
    order: -1;
  }

  .baseline::before {
    content: '\\2003';
    display: inline-block;
    width: 0;
  }
`;
