/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const toggleSwitch = css`
  :host {
    align-items: center;
  }

  /* Override baseline alignment pseudo from field styles to match switch height */
  :host::before {
    line-height: var(--vaadin-toggle-switch-size, 1lh);
    font-size: 0;
  }

  [part='switch'] {
    width: var(--vaadin-toggle-switch-track-width, calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75));
    border-radius: calc(var(--vaadin-toggle-switch-size, 1lh) / 2);
  }

  /* Hide the checkmark pseudo-element from checkable base styles */
  [part='switch']::after {
    content: none;
  }

  [part='thumb'] {
    position: absolute;
    top: 1px;
    width: var(--vaadin-toggle-switch-thumb-size, calc(var(--vaadin-toggle-switch-size, 1lh) - 4px));
    height: var(--vaadin-toggle-switch-thumb-size, calc(var(--vaadin-toggle-switch-size, 1lh) - 4px));
    border-radius: 50%;
    background: var(--vaadin-toggle-switch-thumb-color, var(--vaadin-text-color));
    inset-inline-start: 1px;
    transition: transform 0.2s ease;
  }

  :host([checked]) [part='thumb'] {
    background: var(--vaadin-toggle-switch-thumb-checked-color, var(--vaadin-background-color));
    transform: translateX(
      calc(
        var(--vaadin-toggle-switch-track-width, calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75)) - var(
            --vaadin-toggle-switch-thumb-size,
            calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)
          ) -
          4px
      )
    );
  }

  :host([dir='rtl'][checked]) [part='thumb'] {
    transform: translateX(
      calc(
        -1 *
          (
            var(--vaadin-toggle-switch-track-width, calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75)) - var(
                --vaadin-toggle-switch-thumb-size,
                calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)
              ) -
              4px
          )
      )
    );
  }

  :host([disabled]) [part='thumb'] {
    background: var(--vaadin-text-color-disabled);
  }

  :host([readonly]) {
    --vaadin-toggle-switch-background: transparent;
    --vaadin-toggle-switch-border-color: var(--vaadin-border-color);
    --_border-style: dashed;
  }

  :host([readonly][checked]) {
    --vaadin-toggle-switch-background: var(--vaadin-text-color-muted, #999);
    --vaadin-toggle-switch-border-color: transparent;
  }

  @media (forced-colors: active) {
    :host([checked]) {
      --vaadin-toggle-switch-border-color: CanvasText !important;
    }

    :host([checked]) [part='switch'] {
      background: SelectedItem !important;
    }

    [part='thumb'] {
      background: ButtonText !important;
    }

    :host([checked]) [part='thumb'] {
      background: SelectedItemText !important;
    }

    :host([readonly]) [part='thumb'] {
      background: CanvasText !important;
    }

    :host([disabled]) {
      --vaadin-toggle-switch-border-color: GrayText !important;
    }

    :host([disabled]) [part='thumb'] {
      background: GrayText !important;
    }
  }
`;

export const toggleSwitchStyles = [field, checkable('switch', 'toggle-switch'), toggleSwitch];
