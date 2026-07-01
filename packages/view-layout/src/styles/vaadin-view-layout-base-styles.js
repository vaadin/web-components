/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const viewLayoutStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='header'],
  [part='footer'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-m, 0.5rem);
  }

  [part='header'] > slot[name='title'],
  [part='header'] > slot[name='header'] {
    flex: 1;
    min-width: 0;
  }

  [part='content'] {
    flex: 1;
    min-height: 0;
  }

  :host([has-header]) ::slotted([slot='title']) {
    display: none;
  }
`;
