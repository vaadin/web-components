/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const drawerToggle = css`
  @layer base {
    [part='icon'] {
      background: currentColor;
      display: block;
      height: var(--vaadin-icon-size, 1lh);
      mask-image: var(--_vaadin-icon-menu);
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
  }
`;
