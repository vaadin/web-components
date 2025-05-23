/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
      border: var(--vaadin-avatar-outline-width) solid transparent;
      margin: calc(var(--vaadin-avatar-outline-width) * -1);
      background: var(--vaadin-avatar-background, var(--_vaadin-background-container-strong));
      background-clip: content-box;
      --vaadin-avatar-outline-width: var(--vaadin-focus-ring-width, 2px);
      vertical-align: middle;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
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
      font-size: 5.6em;
    }

    [part='abbr'] {
      font-size: 2.75em;
    }

    [part='icon'] > text {
      display: none;
    }

    [part='icon'] {
      mask-image: var(--_vaadin-icon-user);
      background: currentColor;
      margin: 14%;
    }

    :host([hidden]),
    [hidden] {
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

    :host([focus-ring]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }
  }
`;
