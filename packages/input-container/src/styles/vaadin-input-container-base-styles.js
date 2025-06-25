/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const inputContainerStyles = css`
  @layer base {
    :host {
      display: flex;
      align-items: center;
      --_radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
      border-radius:
      /* See https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius */
        var(--vaadin-input-field-top-start-radius, var(--_radius))
        var(--vaadin-input-field-top-end-radius, var(--_radius))
        var(--vaadin-input-field-bottom-end-radius, var(--_radius))
        var(--vaadin-input-field-bottom-start-radius, var(--_radius));
      border: var(--vaadin-input-field-border-width, 1px) solid
        var(--vaadin-input-field-border-color, var(--vaadin-border-color-strong));
      box-sizing: border-box;
      cursor: text;
      padding: var(--vaadin-input-field-padding, var(--vaadin-padding-container));
      gap: var(--vaadin-input-field-gap, var(--vaadin-gap-container-inline));
      background: var(--vaadin-input-field-background, var(--vaadin-background-color));
      color: var(--vaadin-input-field-value-color, var(--vaadin-color));
      font-size: var(--vaadin-input-field-value-font-size, inherit);
      line-height: var(--vaadin-input-field-value-line-height, inherit);
      font-weight: var(--vaadin-input-field-value-font-weight, 400);
    }

    :host([dir='rtl']) {
      --_radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
      border-radius:
      /* Don't use logical props, see https://github.com/vaadin/vaadin-time-picker/issues/145 */
        var(--vaadin-input-field-top-end-radius, var(--_radius))
        var(--vaadin-input-field-top-start-radius, var(--_radius))
        var(--vaadin-input-field-bottom-start-radius, var(--_radius))
        var(--vaadin-input-field-bottom-end-radius, var(--_radius));
    }

    :host([hidden]) {
      display: none !important;
    }

    /* Reset the native input styles */
    ::slotted(:is(input, textarea)) {
      appearance: none;
      align-self: stretch;
      box-sizing: border-box;
      flex: auto;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      height: auto;
      outline: none;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 0;
      min-width: 0;
      font: inherit;
      font-size: 1em;
      color: inherit;
      background: transparent;
      cursor: inherit;
      caret-color: var(--vaadin-input-field-value-color);
    }

    ::slotted(*) {
      flex: none;
    }

    slot[name$='fix'] {
      cursor: auto;
    }

    ::slotted(:is(input, textarea))::placeholder {
      /* Use ::slotted(:is(input, textarea):placeholder-shown) to style the placeholder */
      /* because ::slotted(...)::placeholder does not work in Safari. */
      font: inherit;
      color: inherit;
    }

    ::slotted(:is(input, textarea):placeholder-shown) {
      color: var(--vaadin-input-field-placeholder-color, var(--vaadin-color-subtle));
    }

    :host(:focus-within) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-input-field-border-width, 1px) * -1);
    }

    :host([readonly]) {
      border-style: dashed;
    }

    :host([readonly]:focus-within) {
      outline-style: dashed;
      --vaadin-input-field-border-color: transparent;
    }

    :host([disabled]) {
      --vaadin-input-field-value-color: var(--vaadin-input-field-disabled-text-color, var(--vaadin-color-disabled));
      --vaadin-input-field-background: var(
        --vaadin-input-field-disabled-background,
        var(--vaadin-background-container-strong)
      );
      --vaadin-input-field-border-color: transparent;
    }

    @media (forced-colors: active) {
      :host {
        --vaadin-input-field-background: Field;
        --vaadin-input-field-value-color: FieldText;
        --vaadin-input-field-placeholder-color: GrayText;
      }

      :host([disabled]) {
        --vaadin-input-field-value-color: GrayText;
        --vaadin-icon-color: GrayText;
      }
    }
  }
`;
