/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageListStyles = css`
  :host {
    display: block;
    overflow: auto;
    box-sizing: border-box;
    padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-snap-type: y proximity;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    max-width: var(--vaadin-message-list-max-width, none);
    margin-inline: auto;
  }

  [part='list']::after {
    content: '';
    display: block;
    scroll-snap-align: var(--_vaadin-message-list-scroll-snap-align, none);
  }

  :host([theme~='bubble']) ::slotted(vaadin-message) {
    --vaadin-message-name-font-size: 0.9em;
  }

  :host([theme~='bubble']) ::slotted(vaadin-message[theme~='full-width']) {
    padding-block: var(--vaadin-padding-xl);
  }

  :host([theme~='bubble']) ::slotted(vaadin-message:not([theme~='full-width'])) {
    --vaadin-message-content-background: var(--vaadin-background-container);
    --vaadin-message-content-padding: var(--vaadin-padding-s) var(--vaadin-padding-m);
    --vaadin-message-content-border-radius: var(--vaadin-radius-l);

    width: fit-content;
    max-width: calc(100% - 2em);
  }

  :host([theme~='bubble']) ::slotted(vaadin-message[theme~='self']) {
    --_vaadin-message-avatar-visibility: hidden;
    --vaadin-message-content-background: linear-gradient(
        color-mix(in srgb, var(--vaadin-message-user-color, var(--vaadin-user-color-0)) 10%, transparent)
      )
      var(--vaadin-background-color);
    --vaadin-message-attachments-alignment: end;
    align-items: end;
    align-self: end;
  }

  :host([theme~='bubble'][theme~='one-to-one']) ::slotted(vaadin-message) {
    --_vaadin-message-avatar-display: none;
  }
`;
