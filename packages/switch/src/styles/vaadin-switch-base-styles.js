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
    --_switch-width: var(--vaadin-switch-width, round(2em, 2px));
    --_switch-height: var(--vaadin-switch-height, round(1.25em, 2px));
    --_marker-width: var(--vaadin-switch-marker-width, var(--_marker-height));
    --_marker-height: var(--vaadin-switch-marker-height, round(1.25em - 4px, 2px));
    --_height-diff: calc(var(--_switch-height) - var(--_marker-height));
    width: var(--_switch-width);
    height: var(--_switch-height);
    --_marker-radius: var(--vaadin-switch-marker-border-radius, var(--vaadin-radius-l));
    border-radius: var(--vaadin-switch-border-radius, calc(var(--_marker-radius) + var(--_height-diff) / 2));
    border-width: var(--vaadin-switch-border-width, 2px);
    border-color: var(--vaadin-switch-border-color, var(--vaadin-text-color));
    margin-inline: max(0px, var(--_height-diff) / -2);
  }

  /* Checkmark/radio marker, not used in switch */
  /* This defines the baseline alignment, so we need to recreate it with the real marker element */
  [part='switch']::after {
    display: none;
  }

  /* Marker */
  [part='marker'] {
    box-sizing: border-box;
    border: var(--vaadin-switch-marker-border-width, 1px) solid var(--vaadin-switch-marker-border-color, transparent);
    width: var(--_marker-width);
    height: var(--_marker-height);
    min-width: 0;
    border-radius: var(--_marker-radius);
    background: var(--vaadin-switch-marker-color, var(--vaadin-text-color));
    color: var(--vaadin-switch-icon-color, var(--vaadin-switch-background, var(--vaadin-background-color)));
    --_empty-space: round((var(--_switch-width) - var(--_height-diff) - var(--_marker-width)) / 2, 1px);
    --_dir: 1;
    translate: calc(var(--_empty-space) * var(--_dir) * -1) 0;
    scale: var(--vaadin-switch-marker-scale, 0.75);

    /* For baseline alignment (and icon variant) */
    display: flex;
    align-items: center;

    &::before {
      content: '\\2003' / '';
      display: flex;
      align-items: center;
      pointer-events: none;
      user-select: none;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    /* Focus outline is on the marker when it's larger than the switch/track */
    outline-offset: calc(var(--vaadin-switch-marker-border-width, 1px) * -1);
    outline: min(var(--vaadin-focus-ring-width, 2px), var(--_marker-height) - var(--_switch-height)) solid transparent;
  }

  /* Focus outline */
  :host([focus-ring]) [part='switch'] {
    outline-offset: 1px;
    outline-width: min(var(--vaadin-focus-ring-width, 2px), var(--_switch-height) - var(--_marker-height));
  }

  :host([focus-ring][checked]) [part='switch'] {
    outline-offset: 1px;
  }

  :host([focus-ring]) [part='marker'] {
    outline-color: var(--vaadin-focus-ring-color);
  }

  /* Checked state */
  :host([checked]) {
    --vaadin-switch-marker-color: var(--vaadin-background-color);
    --vaadin-switch-marker-scale: 1;
  }

  [part='switch'],
  [part='marker'] {
    transition:
      background-color 100ms,
      border-color 100ms;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='marker'] {
      transition: all 100ms;
    }
  }

  :host([checked]) [part='marker'] {
    translate: calc(var(--_empty-space) * var(--_dir)) 0;
  }

  :host([dir='rtl']) [part='marker'] {
    --_dir: -1;
  }

  /* Read-only state */
  :host([readonly]) {
    --vaadin-switch-marker-color: var(--vaadin-text-color-disabled);
    --vaadin-switch-icon-color: var(--vaadin-background-color);
  }

  :host([readonly][checked]) {
    --vaadin-switch-background: var(--vaadin-border-color);
    --vaadin-switch-marker-color: var(--vaadin-background-color);
    --vaadin-switch-icon-color: var(--vaadin-border-color);
    --_border-style: none;
  }

  /* Disabled state */
  :host([disabled]) {
    --vaadin-switch-background: var(--vaadin-background-color);
    --vaadin-switch-border-color: var(--vaadin-background-container-strong);
    --vaadin-switch-marker-color: var(--vaadin-background-container-strong);
  }

  :host([disabled][checked]) {
    --vaadin-switch-background: var(--vaadin-background-container-strong);
    --vaadin-switch-border-color: transparent;
    --vaadin-switch-marker-color: var(--vaadin-background-color);
  }

  /* Reverse variant */
  :host([theme~='reverse']) {
    &::before {
      display: none;
    }

    [part='label'],
    [part='helper-text'],
    [part='error-message'] {
      grid-column: 1;
    }

    [part='switch'],
    ::slotted(input) {
      grid-column: 2;
    }

    ::slotted(input) {
      margin-inline: calc(min(0px, (24px - 100%) / -2) - var(--vaadin-switch-gap, var(--vaadin-gap-s))) 0 !important;
    }
  }

  /* Icon variant */
  :host([theme~='icon']) [part='marker']::before {
    background: currentColor;
    mask-image: var(--_vaadin-icon-cross-small);
    mask-position: 50%;
    mask-size: var(--vaadin-switch-icon-size, 85% 85%);
    mask-repeat: no-repeat;
  }

  :host([theme~='icon'][checked]) [part='marker']::before {
    mask-image: var(--_vaadin-icon-checkmark-small);
  }

  /* Forced colors */
  @media (forced-colors: active) {
    [part='switch'] {
      background: Canvas !important;
      border: 1px solid CanvasText !important;
    }

    :host([checked]) [part='switch'] {
      background: SelectedItem !important;
    }

    [part='marker'] {
      background: CanvasText !important;
    }

    :host(:not([theme~='icon'])) [part='marker']::before {
      opacity: 0 !important;
    }

    :host([checked]) [part='marker'] {
      background: SelectedItemText !important;
    }

    :host([readonly]) [part='marker'] {
      opacity: 0.5 !important;
    }

    :host([disabled]) [part='marker'] {
      background: GrayText !important;
    }
  }
`;

export const switchStyles = [field, checkable('switch'), switchControl];
