/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const iconStyles = css`
  :host {
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
    font-size: inherit !important;
    box-sizing: border-box;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    flex: none;
    fill: var(--vaadin-icon-color, currentColor);
    container-type: size;
  }

  :host::after,
  :host::before {
    line-height: 1;
    font-size: var(--vaadin-icon-visual-size, 100cqh);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }

  :host([hidden]) {
    display: none !important;
  }

  svg {
    display: block;
    width: var(--vaadin-icon-visual-size, 100%);
    height: var(--vaadin-icon-visual-size, 100%);
    /* prevent overflowing icon from clipping, see https://github.com/vaadin/flow-components/issues/5872 */
    overflow: visible;

    @container style(--vaadin-icon-stroke-width) {
      stroke-width: var(--vaadin-icon-stroke-width);
    }
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
    content: '\\2003' / '';
    display: inline-block;
    width: 0;
  }

  :host(:is([icon-class], [font-family])) .baseline {
    font-family: var(--vaadin-icon-baseline-font-family, inherit);
  }
`;
