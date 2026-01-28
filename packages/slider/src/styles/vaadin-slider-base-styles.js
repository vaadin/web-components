/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const sliderStyles = css`
  :host {
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    --_track-radius: var(--vaadin-slider-track-border-radius, var(--vaadin-radius-m));
    --_thumb-width: var(--vaadin-slider-thumb-width, 1lh);
    --_thumb-height: var(--vaadin-slider-thumb-height, 1lh);
    --_track-size: var(--vaadin-slider-track-size, 0.25lh);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    cursor: var(--vaadin-disabled-cursor);
    --vaadin-slider-fill-background: linear-gradient(
        var(--vaadin-text-color-disabled),
        var(--vaadin-text-color-disabled)
      )
      var(--vaadin-background-color);
  }

  :host([readonly]) {
    --vaadin-slider-fill-background: var(--vaadin-background-color);
    --_outline-style: dashed;
  }

  #controls {
    grid-area: input;
    position: relative;
    display: flex;
    align-items: center;
    width: var(--vaadin-field-default-width, 12em);
    max-width: 100%;
    min-width: 100%;
    min-height: var(--_thumb-height);
  }

  :host([has-label]) #controls {
    border-block: var(--vaadin-input-field-border-width, 1px) solid transparent;
    padding-block: var(--vaadin-padding-block-container);
  }

  [part='track'] {
    box-sizing: border-box;
    width: 100%;
    height: var(--_track-size);
    background: var(--vaadin-slider-track-background, var(--vaadin-background-container));
    border-radius: var(--_track-radius);
    pointer-events: none;
  }

  [part='track-fill'] {
    box-sizing: border-box;
    position: absolute;
    height: var(--_track-size);
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    border-start-start-radius: inherit;
    border-end-start-radius: inherit;
    pointer-events: none;
  }

  [part~='thumb'] {
    position: absolute;
    top: 50%;
    box-sizing: border-box;
    width: var(--_thumb-width);
    height: var(--_thumb-height);
    transform: translateX(-50%) translateY(-50%);
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    border-radius: 50%;
    touch-action: none;
  }

  :host([readonly]) [part~='thumb'],
  :host([readonly]) [part='track-fill'] {
    border: dashed 1px var(--vaadin-border-color);
  }

  /* visually hidden */
  ::slotted(input) {
    position: absolute;
    inset: 0;
    font: inherit;
    height: var(--_thumb-height);
    opacity: 0 !important;
    margin: 0 !important;
    pointer-events: none;
  }
`;
