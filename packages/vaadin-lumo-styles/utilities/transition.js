/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

export const transition = css`
  .transition {
    transition: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
      transform, filter, backdrop-filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-all {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-colors {
    transition: color, background-color, border-color, text-decoration-color, fill,
      stroke 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-none {
    transition: none;
  }
  .transition-opacity {
    transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-shadow {
    transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-transform {
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
