/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const buttonStyles = css`
  :host {
    position: relative;
    display: inline-block;
    outline: none;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: var(--_vaadin-button-disabled-pointer-events, none);
  }

  /* Aligns the button with form fields when placed on the same line.
  Note, to make it work, the form fields should have the same "::before" pseudo-element. */
  .vaadin-button-container::before {
    display: inline-block;
    width: 0;
    max-height: 100%;
    content: '\\\\2003';
  }

  .vaadin-button-container {
    display: inline-flex;
    width: 100%;
    height: 100%;
    min-height: inherit;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-shadow: inherit;
  }

  [part='prefix'],
  [part='suffix'] {
    flex: none;
  }

  [part='label'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (forced-colors: active) {
    :host {
      outline: 1px solid;
      outline-offset: -1px;
    }

    :host([focused]) {
      outline-width: 2px;
    }

    :host([disabled]) {
      outline-color: GrayText;
    }
  }
`;

export const buttonTemplate = (html) => html`
  <div class="vaadin-button-container">
    <span part="prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <span part="label">
      <slot></slot>
    </span>
    <span part="suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </div>
  <slot name="tooltip"></slot>
`;
