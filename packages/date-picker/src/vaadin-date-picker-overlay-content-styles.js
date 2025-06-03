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
    outline: none;
  }

  :host([desktop]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([fullscreen][years-visible]) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([fullscreen]) :is([part='toggle-button'], [part='clear-button'], [part='label']) {
    display: none;
  }

  [part='overlay-header'] {
    display: none;
    grid-area: header;
    align-items: center;
    justify-content: center;
  }

  :host([fullscreen]) [part='overlay-header'] {
    display: flex;
  }

  [part='label'] {
    flex-grow: 1;
  }

  [hidden] {
    display: none !important;
  }

  [part='years-toggle-button'] {
    display: flex;
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
    z-index: 2;
    flex-shrink: 0;
  }

  :host([fullscreen]) [part='toolbar'] {
    grid-area: header;
  }
`;
