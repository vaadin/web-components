/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const buttonStyles = css`
  @layer base {
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--vaadin-button-gap, 0 var(--_vaadin-gap-icon));

      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      box-sizing: border-box;
      vertical-align: middle;
      flex-shrink: 0;
      height: var(--vaadin-button-height, auto);
      margin: var(--vaadin-button-margin, 0);
      padding: var(--vaadin-button-padding, var(--_vaadin-padding-container-text));
      font-family: var(--vaadin-button-font-family, inherit);
      font-size: var(--vaadin-button-font-size, inherit);
      line-height: var(--vaadin-button-line-height, inherit);
      font-weight: var(--vaadin-button-font-weight, 500);
      color: var(--vaadin-button-text-color, var(--_vaadin-color-strong));
      background: var(--vaadin-button-background, var(--_vaadin-bg-container));
      background-origin: border-box;
      border: var(
        --vaadin-button-border,
        var(--vaadin-button-border-width, 1px) solid var(--vaadin-button-border-color, var(--_vaadin-border-color))
      );
      border-radius: var(--vaadin-button-border-radius, var(--_vaadin-radius-m));
    }

    :host([hidden]) {
      display: none !important;
    }

    .vaadin-button-container,
    [part='prefix'],
    [part='suffix'],
    [part='label'] {
      display: contents;
    }

    :host([focus-ring]) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: 1px;
    }

    :host([theme~='primary']) {
      --vaadin-button-background: var(--_vaadin-color-strong);
      --vaadin-button-text-color: var(--_vaadin-bg);
      --vaadin-button-border-color: transparent;
    }

    :host([theme~='tertiary']) {
      --vaadin-button-text-color: var(--_vaadin-button-text-color);
      --vaadin-button-background: transparent;
      --vaadin-button-border-color: transparent;
    }

    :host([disabled]) {
      pointer-events: var(--_vaadin-button-disabled-pointer-events, none);
      cursor: not-allowed;
      opacity: 0.5;
    }

    :host([disabled][theme~='primary']) {
      --vaadin-button-text-color: var(--_vaadin-bg-container-strong);
      --vaadin-button-background: var(--_vaadin-color-weak);
    }

    @media (forced-colors: active) {
      :host {
        border: 1px solid;
      }
    }
  }
`;

export const buttonTemplate = (html) => html`
  <div class="vaadin-button-container">
    <span part="prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <span part="label">
      <slot></slot>
    </span>
    <span part="suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </div>
  <slot name="tooltip"></slot>
`;
