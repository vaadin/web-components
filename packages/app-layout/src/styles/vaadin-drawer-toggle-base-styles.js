/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const drawerToggle = css`
  [part='icon'] {
    background: currentColor;
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-menu) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    width: var(--vaadin-icon-size, 1lh);
  }

  [hidden] {
    display: none !important;
  }

  @media (forced-colors: active) {
    [part='icon'] {
      background: CanvasText;
    }
  }
`;
