/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css } from 'lit';

export const crudEditStyles = css`
  [part='icon'] {
    background: currentColor;
    display: block;
    height: var(--vaadin-icon-size, 1lh);
    mask-image: var(--_vaadin-icon-edit);
    width: var(--vaadin-icon-size, 1lh);
  }

  @media (forced-colors: active) {
    [part='icon'] {
      background: CanvasText;
    }
  }
`;
