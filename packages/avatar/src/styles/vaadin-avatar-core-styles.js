/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const avatarStyles = css`
  :host {
    position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: var(--vaadin-avatar-size, 64px);
    line-height: 1;
  }

  [part='abbr'] {
    font-size: 2.2em;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([has-color-index]) {
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
