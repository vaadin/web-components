/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const toggleSwitch = css`
  /* Track */
  [part='switch'] {
    --_thumb-offset: calc(
      var(--vaadin-toggle-switch-track-width, calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75)) - var(
          --vaadin-toggle-switch-thumb-size,
          calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)
        ) -
        (
          var(--vaadin-toggle-switch-size, 1lh) - var(
              --vaadin-toggle-switch-thumb-size,
              calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)
            )
        )
    );
    width: var(--vaadin-toggle-switch-track-width, calc(var(--vaadin-toggle-switch-size, 1lh) * 1.75));
    height: var(--vaadin-toggle-switch-size, 1lh);
    border-radius: var(--vaadin-toggle-switch-size, 1lh);
  }

  /* Hide the checkmark marker */
  [part='switch']::after {
    background: none;
    mask: none;
  }

  /* Thumb */
  [part='thumb'] {
    position: absolute;
    top: 50%;
    inset-inline-start: calc(
      (
          var(--vaadin-toggle-switch-size, 1lh) - var(
              --vaadin-toggle-switch-thumb-size,
              calc(var(--vaadin-toggle-switch-size, 1lh) - 4px)
            )
        ) /
        2 - var(--_border-width, 1px)
    );
    width: var(--vaadin-toggle-switch-thumb-size, calc(var(--vaadin-toggle-switch-size, 1lh) - 4px));
    height: var(--vaadin-toggle-switch-thumb-size, calc(var(--vaadin-toggle-switch-size, 1lh) - 4px));
    border-radius: 50%;
    background: var(--vaadin-toggle-switch-thumb-color, var(--vaadin-text-color));
    translate: 0 -50%;
    transition: translate 100ms;
  }

  /* Checked: slide thumb to the opposite end, swap thumb color. */
  :host([checked]) [part='thumb'] {
    background: var(--vaadin-toggle-switch-thumb-checked-color, var(--vaadin-background-color));
    translate: var(--_thumb-offset) -50%;
  }

  /* RTL mirror */
  :host([dir='rtl'][checked]) [part='thumb'] {
    translate: calc(-1 * var(--_thumb-offset)) -50%;
  }

  /* Read-only: dashed border, transparent off-state background, muted on-state background. */
  :host([readonly]) {
    --vaadin-toggle-switch-background: transparent;
    --vaadin-toggle-switch-border-color: var(--vaadin-border-color);
    --_border-style: dashed;
  }

  /* Restore border-color that checkable() blanks to transparent on the checked state, so the readonly dashed border stays visible. */
  :host([readonly][checked]) {
    --vaadin-toggle-switch-background: var(--vaadin-background-container-strong);
    --vaadin-toggle-switch-border-color: var(--vaadin-border-color);
  }

  :host([readonly][checked]) [part='thumb'] {
    background: var(--vaadin-toggle-switch-thumb-color, var(--vaadin-text-color));
  }

  /* Disabled: muted thumb (track background is already handled by checkable()). */
  :host([disabled]) [part='thumb'] {
    background: var(--vaadin-toggle-switch-thumb-color, var(--vaadin-text-color-disabled));
  }

  :host([disabled][checked]) [part='thumb'] {
    background: var(--vaadin-toggle-switch-thumb-checked-color, var(--vaadin-background-color));
  }

  @media (forced-colors: active) {
    [part='switch'] {
      background: Canvas !important;
      border-color: CanvasText !important;
    }

    :host([checked]) [part='switch'] {
      background: SelectedItem !important;
    }

    [part='thumb'] {
      background: CanvasText !important;
    }

    :host([checked]) [part='thumb'] {
      background: SelectedItemText !important;
    }

    :host([disabled]) [part='switch'] {
      border-color: GrayText !important;
    }

    :host([disabled]) [part='thumb'] {
      background: GrayText !important;
    }
  }
`;

export const toggleSwitchStyles = [field, checkable('switch', 'toggle-switch'), toggleSwitch];
