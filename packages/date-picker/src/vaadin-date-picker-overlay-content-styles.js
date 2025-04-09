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
    grid-template-columns: minmax(0, 1fr) auto;
    height: 100%;
  }

  :has([week-numbers]) {
    background: red;
  }

  [part='overlay-header'] {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    flex-wrap: nowrap;
    grid-area: header;
  }

  :host(:not([fullscreen])) [part='overlay-header'] {
    display: none;
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

  #scrollers {
    display: contents;
  }

  :host([desktop]) ::slotted([slot='months']) {
    right: var(--vaadin-date-picker-year-scroller-width, 3rem);
    transform: none !important;
  }

  :host([desktop]) ::slotted([slot='years']) {
    transform: none !important;
  }

  :host(.animate) ::slotted([slot='months']),
  :host(.animate) ::slotted([slot='years']) {
    transition: all 200ms;
  }

  [part='toolbar'] {
    display: flex;
    grid-area: toolbar;
    justify-content: space-between;
    padding: var(--vaadin-date-picker-toolbar-padding, var(--_vaadin-padding));
    z-index: 2;
  }
`;
