/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const dropdownMenuButtonStyles = css`
  [part='indicator'] {
    display: inline-block;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask-image: var(--_vaadin-icon-chevron-down);
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: var(--vaadin-icon-visual-size, 100%);
  }
`;
