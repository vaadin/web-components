/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const avatarStyles = css`
  @layer base {
    :host {
      display: inline-block;
      flex: none;
      border-radius: 50%;
      cursor: default;
      color: var(--vaadin-avatar-color, inherit);
      line-height: 0;
      overflow: hidden;
      height: var(--vaadin-avatar-size, 2em);
      width: var(--vaadin-avatar-size, 2em);
      border: var(--vaadin-focus-ring-width) solid transparent;
      margin: calc(var(--vaadin-focus-ring-width) * -1);
      background: var(--vaadin-avatar-background, var(--_vaadin-background-container-strong));
      background-clip: content-box;
      vertical-align: middle;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      position: relative;
    }

    :host([role='button']) {
      cursor: var(--vaadin-clickable-cursor);
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    [part='icon'] {
      height: 100%;
      mask: var(--_vaadin-icon-user) no-repeat center / 74%;
      background: currentColor;
    }

    [part='abbr'] {
      font-size: 2.75em;
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
      border: 2px solid var(--vaadin-avatar-user-color);
    }

    :host([focus-ring]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc((var(--vaadin-focus-ring-width)) * -1);
    }
  }
`;
