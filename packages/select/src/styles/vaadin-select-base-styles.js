/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const selectStyles = css`
  :host {
    position: relative;
  }

  ::slotted([slot='value']) {
    flex: 1;
  }

  ::slotted(div[slot='overlay']) {
    display: contents;
  }

  :host(:not([focus-ring])) [part='input-field'] {
    outline: none;
  }

  :host([readonly]:not([focus-ring])) [part='input-field'] {
    --vaadin-input-field-border-color: inherit;
  }

  [part='input-field'],
  :host(:not([readonly])) ::slotted([slot='value']) {
    cursor: var(--vaadin-clickable-cursor);
  }

  [part~='toggle-button']::before {
    mask-image: var(--_vaadin-icon-chevron-down);
  }

  :host([readonly]) [part~='toggle-button'] {
    display: none;
  }

  :host(:is([theme~='align-start'], .v-align-start)) {
    --vaadin-item-text-align: start;
  }

  :host(:is([theme~='align-center'], .v-align-center)) {
    --vaadin-item-text-align: center;
  }

  :host(:is([theme~='align-end'], .v-align-end)) {
    --vaadin-item-text-align: end;
  }

  :host(:is([theme~='align-left'], .v-align-left)) {
    --vaadin-item-text-align: left;
  }

  :host(:is([theme~='align-right'], .v-align-right)) {
    --vaadin-item-text-align: right;
  }

  :host(:is([theme~='align-start'], .v-align-start)) ::slotted([slot='value']) {
    justify-content: start;
  }

  :host(:is([theme~='align-center'], .v-align-center)) ::slotted([slot='value']) {
    justify-content: center;
  }

  :host(:is([theme~='align-end'], .v-align-end)) ::slotted([slot='value']) {
    justify-content: end;
  }

  :host(:is([theme~='align-left'], .v-align-left)) ::slotted([slot='value']) {
    justify-content: left;
  }

  :host(:is([theme~='align-right'], .v-align-right)) ::slotted([slot='value']) {
    justify-content: right;
  }
`;
