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
      gap: var(--vaadin-button-gap, 0 var(--_vaadin-gap-container-inline));

      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
      cursor: var(--vaadin-clickable-cursor);
      box-sizing: border-box;
      vertical-align: middle;
      flex-shrink: 0;
      height: var(--vaadin-button-height, auto);
      margin: var(--vaadin-button-margin, 0);
      padding: var(--vaadin-button-padding, var(--_vaadin-padding-container));
      font-family: var(--vaadin-button-font-family, inherit);
      font-size: var(--vaadin-button-font-size, inherit);
      line-height: var(--vaadin-button-line-height, inherit);
      font-weight: var(--vaadin-button-font-weight, 500);
      color: var(--vaadin-button-text-color, var(--_vaadin-color-strong));
      background: var(--vaadin-button-background, var(--_vaadin-background-container));
      background-origin: border-box;
      border: var(
        --vaadin-button-border,
        var(--vaadin-button-border-width, 1px) solid var(--vaadin-button-border-color, var(--_vaadin-border-color))
      );
      border-radius: var(--vaadin-button-border-radius, var(--_vaadin-radius-m));
      touch-action: manipulation;
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
      outline-style: solid;
      outline-width: var(--vaadin-focus-ring-width, var(--_vaadin-focus-ring-width));
      outline-color: var(--vaadin-focus-ring-color, var(--_vaadin-focus-ring-color));
      outline-offset: 1px;
    }

    :host([theme~='primary']) {
      --vaadin-button-background: var(--_vaadin-color-strong);
      --vaadin-button-text-color: var(--_vaadin-background);
      --vaadin-button-border-color: transparent;
    }

    :host([theme~='tertiary']) {
      --vaadin-button-text-color: var(--_vaadin-button-text-color);
      --vaadin-button-background: transparent;
      --vaadin-button-border-color: transparent;
    }

    :host([disabled]) {
      pointer-events: var(--_vaadin-button-disabled-pointer-events, none);
      cursor: var(--vaadin-disabled-cursor);
      opacity: 0.5;
    }

    :host([disabled][theme~='primary']) {
      --vaadin-button-text-color: var(--_vaadin-background-container-strong);
      --vaadin-button-background: var(--_vaadin-color-subtle);
    }

    @media (forced-colors: active) {
      :host {
        --vaadin-button-border-width: 1px;
        --vaadin-button-background: ButtonFace;
        --vaadin-button-text-color: ButtonText;
      }

      :host([theme~='primary']) {
        forced-color-adjust: none;
        --vaadin-button-background: CanvasText;
        --vaadin-button-text-color: Canvas;
        --vaadin-icon-color: Canvas;
      }

      ::slotted(*) {
        forced-color-adjust: auto;
      }

      :host([disabled]) {
        --vaadin-button-background: transparent !important;
        --vaadin-button-border-color: GrayText !important;
        --vaadin-button-text-color: GrayText !important;
        opacity: 1;
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
