/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const avatarStyles = css`
  :host {
    --vaadin-avatar-outline-width: var(--vaadin-focus-ring-width, 2px);
    background-clip: content-box;
    border: var(--vaadin-avatar-outline-width) solid transparent;
    border-radius: 50%;
    display: inline-block;
    flex: none;
    height: var(--vaadin-avatar-size, 64px);
    margin: calc(var(--vaadin-avatar-outline-width) * -1);
    overflow: hidden;
    width: var(--vaadin-avatar-size, 64px);
  }

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
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
    background-color: var(--vaadin-avatar-user-color);
    position: relative;
  }

  :host([has-color-index])::before {
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px var(--vaadin-avatar-user-color);
    content: '';
    inset: 0;
    position: absolute;
  }
`;
