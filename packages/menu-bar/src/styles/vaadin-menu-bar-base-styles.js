/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const menuBarStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    display: flex;
    flex-wrap: nowrap;
    margin: calc((var(--vaadin-focus-ring-width) + 1px) * -1);
    overflow: hidden;
    padding: calc(var(--vaadin-focus-ring-width) + 1px);
    position: relative;
    width: 100%;
  }

  [part='container'] ::slotted(vaadin-menu-bar-button:not(:first-of-type)) {
    margin-inline-start: calc(var(--vaadin-button-border-width, 1px) * -1);
  }
`;
