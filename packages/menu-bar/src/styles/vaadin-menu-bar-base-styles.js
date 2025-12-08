/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const menuBarStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    display: flex;
    flex-wrap: nowrap;
    contain: layout;
    position: relative;
    width: 100%;
    --_gap: var(--vaadin-menu-bar-gap, 0px);
    --_bw: var(--vaadin-button-border-width, 1px);
    gap: var(--_gap);
    --_rad-button: var(--vaadin-button-border-radius, var(--vaadin-radius-m));
  }

  :host(:not([has-single-button])) ::slotted(vaadin-menu-bar-button:not(:first-of-type)) {
    margin-inline-start: min(var(--_bw) * -1 + var(--_gap) * 1000, 0px);
  }

  ::slotted(vaadin-menu-bar-button) {
    border-radius: 0;
  }

  ::slotted([first-visible]),
  :host([has-single-button]) ::slotted([slot='overflow']),
  ::slotted(vaadin-menu-bar-button[theme~='tertiary']) {
    border-start-start-radius: var(--_rad-button);
    border-end-start-radius: var(--_rad-button);
  }

  ::slotted(:is([last-visible], [slot='overflow'])),
  ::slotted(vaadin-menu-bar-button[theme~='tertiary']) {
    border-start-end-radius: var(--_rad-button);
    border-end-end-radius: var(--_rad-button);
  }

  :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button[first-visible]),
  :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
    margin-inline-start: auto;
  }
`;
