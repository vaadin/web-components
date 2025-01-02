/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const avatarStyles = css`
  :host {
    display: inline-block;
    flex: none;
    border-radius: 50%;
    overflow: hidden;
    height: var(--vaadin-avatar-size, 64px);
    width: var(--vaadin-avatar-size, 64px);
    border: var(--vaadin-avatar-outline-width) solid transparent;
    margin: calc(var(--vaadin-avatar-outline-width) * -1);
    background-clip: content-box;
    --vaadin-avatar-outline-width: var(--vaadin-focus-ring-width, 2px);
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  [part='icon'] {
    font-size: 5.6em;
  }

  [part='abbr'] {
    font-size: 2.2em;
  }

  [part='icon'] > text {
    font-family: 'vaadin-avatar-icons';
  }

  :host([hidden]) {
    display: none !important;
  }

  svg[hidden] {
    display: none !important;
  }

  :host([has-color-index]) {
    position: relative;
    background-color: var(--vaadin-avatar-user-color);
  }

  :host([has-color-index])::before {
    position: absolute;
    content: '';
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px var(--vaadin-avatar-user-color);
  }
`;
