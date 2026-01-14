/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const sliderStyles = css`
  :host {
<<<<<<< HEAD
    display: block;
=======
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: var(--_thumb-size);
    user-select: none;
    -webkit-user-select: none;
    border-radius: var(--vaadin-slider-track-border-radius, var(--vaadin-radius-m));
    --_thumb-size: var(--vaadin-slider-thumb-size, 1lh);
    --_track-size: var(--vaadin-slider-track-size, 0.25lh);
>>>>>>> 6f4d3953a7 (--wip-- [skip ci])
  }

  :host([hidden]) {
    display: none !important;
  }
<<<<<<< HEAD
=======

  [part='track'] {
    box-sizing: border-box;
    position: absolute;
    height: var(--_track-size);
    width: 100%;
    background: var(--vaadin-slider-track-background, var(--vaadin-background-container));
    border-radius: inherit;
    pointer-events: none;
  }

  [part='track-fill'] {
    box-sizing: border-box;
    position: absolute;
    height: var(--_track-size);
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    pointer-events: none;
    border-start-start-radius: inherit;
    border-end-start-radius: inherit;
  }

  [part~='thumb'] {
    position: absolute;
    box-sizing: border-box;
    width: var(--_thumb-size);
    height: var(--_thumb-size);
    transform: translateX(-50%);
    background: var(--vaadin-slider-fill-background, var(--vaadin-text-color));
    border-radius: 50%;
    pointer-events: auto;
    touch-action: none;
  }

  /* visually hidden */
  ::slotted(input) {
    flex: 1;
    font: inherit;
    height: var(--_thumb-size);
    opacity: 0 !important;
    margin: 0 !important;
    pointer-events: none;
  }
>>>>>>> 6f4d3953a7 (--wip-- [skip ci])
`;
