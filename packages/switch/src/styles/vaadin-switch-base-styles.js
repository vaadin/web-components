/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { checkable } from '@vaadin/field-base/src/styles/checkable-base-styles.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';

const switchControl = css`
  /* Track */
  [part='switch'] {
    --_thumb-offset: calc(
      var(--vaadin-switch-track-width, calc(var(--vaadin-switch-size, 1lh) * 1.75)) - var(
          --vaadin-switch-thumb-size,
          calc(var(--vaadin-switch-size, 1lh) - 4px)
        ) -
        (var(--vaadin-switch-size, 1lh) - var(--vaadin-switch-thumb-size, calc(var(--vaadin-switch-size, 1lh) - 4px)))
    );
    width: var(--vaadin-switch-track-width, calc(var(--vaadin-switch-size, 1lh) * 1.75));
    height: var(--vaadin-switch-size, 1lh);
    border-radius: var(--vaadin-switch-size, 1lh);
  }

  [part='switch']::after {
    background: none;
    mask: none;
  }

  /* Thumb */
  [part='thumb'] {
    position: absolute;
    top: 50%;
    inset-inline-start: calc(
      (var(--vaadin-switch-size, 1lh) - var(--vaadin-switch-thumb-size, calc(var(--vaadin-switch-size, 1lh) - 4px))) /
        2 - var(--_border-width, 1px)
    );
    width: var(--vaadin-switch-thumb-size, calc(var(--vaadin-switch-size, 1lh) - 4px));
    height: var(--vaadin-switch-thumb-size, calc(var(--vaadin-switch-size, 1lh) - 4px));
    border-radius: 50%;
    background: var(--vaadin-switch-thumb-color, var(--vaadin-text-color));
    translate: 0 -50%;
    transition: translate 100ms;
  }

  :host([checked]) [part='thumb'] {
    background: var(--vaadin-switch-thumb-checked-color, var(--vaadin-background-color));
    translate: var(--_thumb-offset) -50%;
  }

  :host([dir='rtl'][checked]) [part='thumb'] {
    translate: calc(-1 * var(--_thumb-offset)) -50%;
  }

  /* Read-only: mute the thumb and the checked-track fill to the border color and keep
     a solid border. The dashed treatment is reserved for the focus ring (checkable()),
     matching vaadin-slider. */
  :host([readonly]) {
    --vaadin-switch-border-color: var(--vaadin-border-color);
    --vaadin-switch-thumb-color: var(--vaadin-border-color);
  }

  :host([readonly][checked]) {
    --vaadin-switch-background: var(--vaadin-border-color);
  }

  :host([disabled]) [part='thumb'] {
    background: var(--vaadin-switch-thumb-color, var(--vaadin-text-color-disabled));
  }

  :host([disabled][checked]) [part='thumb'] {
    background: var(--vaadin-switch-thumb-checked-color, var(--vaadin-background-color));
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

export const switchStyles = [field, checkable('switch'), switchControl];
