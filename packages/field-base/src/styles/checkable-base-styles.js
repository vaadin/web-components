/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css, unsafeCSS } from 'lit';

export const checkable = (part, propName = part) => css`
  @layer base {
    :host {
      align-items: center;
      display: inline-grid;
      gap: var(--vaadin-${unsafeCSS(propName)}-gap, 0.25lh var(--_vaadin-gap-container-inline));
      grid-template-columns: auto 1fr;
      /*
        Using minmax(auto, max-content) works around a Safari 17 issue where placing a checkbox
        inside a flex container with flex-direction: column causes the container to unexpectedly
        grow to the max available height.
      */
      grid-template-rows: minmax(auto, max-content);
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host(:not([has-label])) {
      column-gap: 0;
    }

    .vaadin-${unsafeCSS(propName)}-container {
      display: contents;
    }

    [part='${unsafeCSS(part)}'],
    ::slotted(input),
    [part='label'],
    ::slotted(label) {
      grid-row: 1;
    }

    [part='label'],
    ::slotted(label) {
      font-size: var(--vaadin-${unsafeCSS(propName)}-label-font-size, var(--vaadin-input-field-label-font-size, inherit));
      line-height: var(--vaadin-${unsafeCSS(propName)}-label-line-height, var(--vaadin-input-field-label-line-height, inherit));
      font-weight: var(--vaadin-${unsafeCSS(propName)}-font-weight, var(--vaadin-input-field-label-font-weight, 500));
      color: var(--vaadin-${unsafeCSS(propName)}-label-color, var(--vaadin-input-field-label-color, var(--vaadin-color)));
      word-break: break-word;
    }

    [part='${unsafeCSS(part)}'],
    ::slotted(input) {
      grid-column: 1;
    }

    [part='helper-text'],
    [part='error-message'] {
      grid-column: 2;
    }

    /* Baseline vertical alignment */
    :host::before {
      content: '\\2003';
      grid-column: 1;
      grid-row: 1;
      z-index: -1;
      width: 0;
    }

    /* visually hidden */
    ::slotted(input) {
      cursor: inherit;
      margin: 0;
      align-self: stretch;
      appearance: none;
      width: 100%;
      height: 100%;
    }

    /* Control container (checkbox, radio button) */
    [part='${unsafeCSS(part)}'] {
      background: var(--vaadin-${unsafeCSS(propName)}-background, var(--vaadin-background-color));
      border-color: var(--vaadin-${unsafeCSS(propName)}-border-color, var(--vaadin-input-field-border-color, var(--vaadin-border-color-strong)));
      border-radius: var(--vaadin-${unsafeCSS(propName)}-border-radius, var(--_vaadin-radius-s));
      border-style: solid;
      --_border-width: var(--vaadin-${unsafeCSS(propName)}-border-width, var(--vaadin-input-field-border-width, 1px));
      border-width: var(--_border-width);
      box-sizing: border-box;
      color: var(--vaadin-${unsafeCSS(propName)}-color, var(--vaadin-input-field-text-color, var(--vaadin-color)));
      height: var(--vaadin-${unsafeCSS(propName)}-size, 1lh);
      width: var(--vaadin-${unsafeCSS(propName)}-size, 1lh);
      position: relative;
    }

    :host(:is([checked], [indeterminate])) {
      --vaadin-${unsafeCSS(propName)}-background: var(--vaadin-color);
      --vaadin-${unsafeCSS(propName)}-border-color: transparent;
      --vaadin-${unsafeCSS(propName)}-color: var(--vaadin-background-color);
    }

    :host([disabled]) {
      --vaadin-${unsafeCSS(propName)}-background: var(--vaadin-input-field-disabled-background, var(--vaadin-background-container-strong));
      --vaadin-${unsafeCSS(propName)}-border-color: transparent;
      --vaadin-${unsafeCSS(propName)}-color: var(--vaadin-color-disabled);
    }

    /* Focus ring */
    :host([focus-ring]) [part='${unsafeCSS(part)}'] {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--_border-width) * -1);
    }

    :host([focus-ring]:is([checked], [indeterminate])) [part='${unsafeCSS(part)}'] {
      outline-offset: 1px;
    }

    :host([readonly][focus-ring]) [part='${unsafeCSS(part)}'] {
      --vaadin-${unsafeCSS(propName)}-border-color: transparent;
      outline-offset: calc(var(--_border-width) * -1);
      outline-style: dashed;
    }

    /* Checked indicator (checkmark, dot) */
    [part='${unsafeCSS(part)}']::after {
      content: '';
      position: absolute;
      background: currentColor;
      border-radius: inherit;
    }

    :host(:not([checked], [indeterminate])) [part='${unsafeCSS(part)}']::after {
      display: none;
    }

    @media (forced-colors: active) {
      :host(:is([checked], [indeterminate])) {
        --vaadin-${unsafeCSS(propName)}-border-color: CanvasText;
      }

      :host([readonly]) [part='${unsafeCSS(part)}']::after {
        background: CanvasText;
      }

      :host([disabled]) {
        --vaadin-${unsafeCSS(propName)}-border-color: GrayText;
      }

      :host([disabled]) [part='${unsafeCSS(part)}']::after {
        background: GrayText;
      }
    }
  }
`;
