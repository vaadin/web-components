/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const panelStyles = css`
  :host {
    --_gap: var(--vaadin-panel-gap, var(--vaadin-gap-s));
    --_padding: var(--vaadin-panel-padding, var(--vaadin-padding-s));
    --_focus-ring-space: calc(var(--vaadin-focus-ring-width, 2px) + 2px);
    --_overflow-indicator-height: 1px;
    --_overflow-indicator-color: var(--vaadin-border-color-secondary);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='header'],
  [part='footer'] {
    display: flex;
    flex-wrap: wrap;
    flex: none;
    gap: var(--_gap);
    padding: var(--_padding);
    position: relative;
    z-index: 1;
    /* Let clicks reach the content that sits under the edges. */
    pointer-events: none;
  }

  ::slotted(:is([slot='header-prefix'], [slot='title'], [slot='header-suffix'], [slot='footer'])) {
    pointer-events: auto;
  }

  [part='header'] {
    align-items: center;
  }

  /* Slots are display: contents, so wrappers carry the flex rules. */
  #title {
    flex: 1;
    min-width: 0;
  }

  #suffix {
    display: flex;
    align-items: center;
    gap: var(--_gap);
    margin-inline-start: auto;
  }

  [part='content'] {
    flex: 1;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
  }

  [part='content']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  /* Keep focus outlines of edge children inside the scrollable content's clipping area. */
  :host(:is([has-title], [has-header-prefix], [has-header-suffix])) [part='content'] {
    padding-top: var(--_focus-ring-space);
    margin-top: calc(var(--_focus-ring-space) * -1);
  }

  :host([has-footer]) [part='content'] {
    padding-bottom: var(--_focus-ring-space);
    margin-bottom: calc(var(--_focus-ring-space) * -1);
  }

  :host(:not([has-title]):not([has-header-prefix]):not([has-header-suffix])) [part='header'],
  :host(:not([has-footer])) [part='footer'] {
    display: none !important;
  }

  [part='header']::after,
  [part='footer']::after {
    content: '';
    opacity: 0;
    position: absolute;
    pointer-events: none;
    height: var(--_overflow-indicator-height);
    top: 100%;
    inset-inline: 0;
    background: var(--_overflow-indicator-color);
  }

  [part='footer']::after {
    top: auto;
    bottom: 100%;
  }

  :host([overflow~='top']) [part='header']::after,
  :host([overflow~='bottom']) [part='footer']::after {
    opacity: 1;
  }
`;
