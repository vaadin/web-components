/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/user-colors.js';
import { css } from 'lit';

export const fieldOutlineStyles = css`
  :host {
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    --_active-user-color: transparent;
    outline: 3px solid var(--_active-user-color);
    outline-offset: -1px;
    /* TODO doesn't inherit correctly from vaadin-input-container for some reason, so we use the internal _radius property */
    border-radius: var(--_radius, inherit);
  }

  :host([has-active-user]) {
    opacity: 1;
  }

  :host([context$='item']) {
    inset: 2px;
  }
`;
