/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const avatarStyles = css`
  :host {
    --vaadin-avatar-outline-width: var(--vaadin-focus-ring-width, 2px);
    display: inline-block;
    overflow: hidden;
    width: var(--vaadin-avatar-size, 64px);
    height: var(--vaadin-avatar-size, 64px);
    flex: none;
    border: var(--vaadin-avatar-outline-width) solid transparent;
    border-radius: 50%;
    margin: calc(var(--vaadin-avatar-outline-width) * -1);
    background-clip: content-box;
  }

  img {
    width: 100%;
    height: 100%;
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
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px var(--vaadin-avatar-user-color);
    content: '';
    inset: 0;
  }
`;
