/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const overlayContentStyles = css`
  :host {
    display: grid;
    grid-template-areas:
      'header header'
      'months years'
      'toolbar years';
    grid-template-columns: minmax(0, 1fr) 0;
    height: 100%;
    overflow: hidden;
  }

  :host([desktop]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([fullscreen][years-visible]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  [part='overlay-header'] {
    align-items: center;
    border-bottom: 1px solid var(--_vaadin-border-color);
    display: none;
    grid-area: header;
    justify-content: center;
  }

  :host([fullscreen]) [part='overlay-header'] {
    display: flex;
  }

  [part='years-toggle-button'] {
    display: inline-flex;
    border: var(--vaadin-button-border, var(--vaadin-button-border-width, 1px) solid transparent);
    border-radius: var(--vaadin-button-border-radius, var(--_vaadin-radius-m));
    color: var(--vaadin-button-text-color, var(--_vaadin-button-text-color));
    font-size: var(--vaadin-button-font-size, inherit);
    font-weight: var(--vaadin-button-font-weight, 500);
    height: var(--vaadin-button-height, auto);
    line-height: var(--vaadin-button-line-height, inherit);
    padding: var(--vaadin-button-padding, var(--_vaadin-padding-container));
    z-index: 1;
    cursor: var(--vaadin-clickable-cursor);
  }

  :host([years-visible]) [part='years-toggle-button'] {
    background: var(--_vaadin-color-strong);
    color: var(--_vaadin-background);
  }

  :host([fullscreen]) :is([part='toggle-button'], [part='clear-button'], [part='label']) {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  #scrollers {
    display: contents;
  }

  :host([desktop]) ::slotted([slot='months']) {
    border-bottom: 1px solid var(--_vaadin-border-color);
    right: var(--vaadin-date-picker-year-scroller-width, 3rem);
  }

  ::slotted([slot='years']) {
    visibility: hidden;
  }

  :host([desktop]) ::slotted([slot='years']),
  :host([years-visible]) ::slotted([slot='years']) {
    visibility: visible;
  }

  [part='toolbar'] {
    display: flex;
    grid-area: toolbar;
    justify-content: space-between;
    padding: var(--vaadin-date-picker-toolbar-padding, var(--_vaadin-padding));
  }

  :host([fullscreen]) [part='toolbar'] {
    grid-area: header;
  }

  [part='toolbar'] ::slotted(vaadin-button) {
    z-index: 1;
  }
`;
