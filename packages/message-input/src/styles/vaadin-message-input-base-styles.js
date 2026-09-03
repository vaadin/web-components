/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageInputStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    max-height: 50vh;
    flex-shrink: 0;
    border: var(--vaadin-input-field-border-width, 1px) solid
      var(--vaadin-input-field-border-color, var(--vaadin-border-color));
    --_radius: var(--vaadin-input-field-border-radius, var(--vaadin-radius-m));
    border-radius:
      /* See https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius */
      var(--vaadin-input-field-top-start-radius, var(--_radius))
      var(--vaadin-input-field-top-end-radius, var(--_radius))
      var(--vaadin-input-field-bottom-end-radius, var(--_radius))
      var(--vaadin-input-field-bottom-start-radius, var(--_radius));
    background: var(--vaadin-input-field-background, var(--vaadin-background-color));
    padding: var(
      --vaadin-input-field-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    gap: var(--vaadin-input-field-gap, var(--vaadin-gap-s));
    --vaadin-field-default-width: 8em;
  }

  :host([dir='rtl']) {
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

  :host(:has(textarea:focus)) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-input-field-border-width, 1px) * -1);
  }

  @scope {
    :scope:has(textarea:focus) {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      outline-offset: calc(var(--vaadin-input-field-border-width, 1px) * -1);
    }
  }

  :host([disabled]) {
    --vaadin-input-field-value-color: var(--vaadin-input-field-disabled-text-color, var(--vaadin-text-color-disabled));
    --vaadin-input-field-background: var(
      --vaadin-input-field-disabled-background,
      var(--vaadin-background-container-strong)
    );
    --vaadin-input-field-border-color: transparent;
  }

  ::slotted([slot='textarea']) {
    flex: 1;
    --vaadin-input-field-padding: 0px !important;
    --vaadin-input-field-border-width: 0px !important;
    --vaadin-focus-ring-width: 0;
    --vaadin-input-field-background: transparent !important;
    --vaadin-input-field-disabled-background: transparent !important;
    --vaadin-input-field-border-radius: 0px !important;
    align-self: center;
  }

  ::slotted([slot='button']) {
    margin-inline-start: auto;
  }

  slot:is([name='header'], [name='footer'])::slotted(*) {
    width: 100%;
  }
`;
