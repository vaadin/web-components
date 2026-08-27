/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageListStyles = css`
  :host {
    display: block;
    overflow: auto;
    box-sizing: border-box;
    padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-snap-type: y proximity;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    max-width: var(--vaadin-message-list-max-width, none);
    margin-inline: auto;
  }

  [part='list']::after {
    content: '';
    display: block;
    scroll-snap-align: var(--_vaadin-message-list-scroll-snap-align, none);
  }
`;
