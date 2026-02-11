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
    --_thumb-width: var(--vaadin-slider-thumb-width, 1lh);
    --_thumb-height: var(--vaadin-slider-thumb-height, 1lh);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    cursor: var(--vaadin-disabled-cursor);
    --vaadin-slider-fill-background: linear-gradient(
        var(--vaadin-border-color-secondary),
        var(--vaadin-border-color-secondary)
      )
      var(--vaadin-background-color);
    --vaadin-slider-thumb-background: var(--vaadin-slider-fill-background);
    --vaadin-slider-thumb-border-color: transparent;
  }

  :host([readonly]) {
    --vaadin-slider-fill-background: var(--vaadin-border-color);
    --vaadin-slider-thumb-background: var(--vaadin-background-color);
    --vaadin-slider-thumb-border-color: var(--vaadin-border-color);
    --_outline-style: dashed;
  }

  :host([min-max-visible]) {
    grid-template:
      'label' auto var(--_helper-above-field, 'helper' auto) 'baseline' 0 'input' 1fr 'marks' auto var(
        --_helper-below-field,
        'helper' auto
      )
      'error' auto / 100%;
  }

  #controls {
    grid-area: input;
    display: inline-grid;
    align-items: center;
    width: var(--vaadin-field-default-width, 12em);
    max-width: 100%;
    min-width: 100%;
    --_track-width: calc(100% - var(--_thumb-width));
  }

  :host([has-label]) #controls {
    border-block: var(--vaadin-input-field-border-width, 1px) solid transparent;
    padding-block: var(--vaadin-padding-block-container);
  }

  [part='track'] {
    box-sizing: border-box;
    grid-row: 1;
    grid-column: track-start / track-end;
    display: grid;
    grid-template-columns: subgrid;
    align-items: center;
    width: 100%;
    height: var(--vaadin-slider-track-height, 0.25lh);
    background: var(--vaadin-slider-track-background, var(--vaadin-background-container));
    border-radius: var(--vaadin-slider-track-border-radius, var(--vaadin-radius-m));
    border: var(--vaadin-slider-track-border-width, 0) solid
      var(--vaadin-slider-track-border-color, var(--vaadin-border-color-secondary));
  }

  [part='track-fill'] {
    box-sizing: border-box;
    grid-column: fill-start / fill-end;
    height: 100%;
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    box-shadow: inset 0 0 0 var(--vaadin-slider-fill-border-width, 1px)
      var(--vaadin-slider-fill-border-color, transparent);
  }

  [part~='thumb'] {
    box-sizing: border-box;
    grid-row: 1;
    grid-column: thumb1;
    width: var(--_thumb-width);
    height: var(--_thumb-height);
    background: var(--vaadin-slider-thumb-background, var(--vaadin-background-color));
    border: var(--vaadin-slider-thumb-border-width, 1px) solid
      var(--vaadin-slider-thumb-border-color, var(--vaadin-text-color));
    border-radius: var(--vaadin-slider-thumb-border-radius, var(--vaadin-radius-l));
    touch-action: none;
  }

  :host([readonly]) [part='track-fill'] {
    border-inline-end: none;
  }

  ::slotted(input) {
    grid-row: 1;
    grid-column: track-start / track-end;
    appearance: none;
    width: 100%;
    height: 100%;
    font: inherit;
    margin: 0;
    background: transparent;
    outline: 0;
    -webkit-tap-highlight-color: transparent;
    cursor: inherit;
    z-index: 999;
  }

  [part='marks'] {
    display: none;
    font-size: var(--vaadin-slider-marks-font-size, 0.75em);
    font-weight: var(--vaadin-slider-marks-font-weight, inherit);
    color: var(--vaadin-slider-marks-color, var(--vaadin-text-color-secondary));
  }

  :host([min-max-visible]) [part='marks'] {
    grid-area: marks;
    display: flex;
    justify-content: space-between;
  }
`;
