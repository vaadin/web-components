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
    display: inline-grid;
    align-items: center;
    width: var(--vaadin-field-default-width, 12em);
    max-width: 100%;
    min-width: 100%;
    min-height: var(--_thumb-height);
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
  }

  [part='track-fill'] {
    box-sizing: border-box;
    grid-column: fill-start / fill-end;
    height: 100%;
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
  }

  [part~='thumb'] {
    box-sizing: border-box;
    grid-row: 1;
    grid-column: thumb1;
    width: var(--_thumb-width);
    height: var(--_thumb-height);
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    border-radius: 50%;
    touch-action: none;
  }

  :host([readonly]) [part~='thumb'],
  :host([readonly]) [part='track-fill'] {
    border: dashed 1px var(--vaadin-border-color);
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
  }
`;
