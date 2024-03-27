/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '../color.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const helper = css`
  [part='helper-text'] {
    font-size: 0.75rem;
    line-height: 1;
    color: var(--material-secondary-text-color);
  }

  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: 6px;
  }

  /* According to Material guidelines, helper text should be hidden when error message is set and input is invalid */
  :host([has-helper][invalid][has-error-message]) [part='helper-text'] {
    display: none;
  }
`;
