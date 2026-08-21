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
    overflow: auto !important;
    padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
    scroll-snap-type: y proximity;
    box-sizing: border-box;
    scrollbar-gutter: stable both-edges;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([theme~='sticky-typing-indicator']) slot[name='typing-indicator']::slotted(*) {
    position: sticky;
    bottom: 0;
    margin-top: auto;
  }

  [part='list'] {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-inline: auto;
    width: 100%;
    height: 100%;
    max-width: var(--vaadin-message-list-max-width, none);
  }

  .scroll-lock {
    scroll-snap-align: var(--_vaadin-message-list-scroll-snap-align, none);
    height: 0;
  }

  :host([theme~='bubble']) ::slotted(vaadin-message) {
    --vaadin-message-name-font-size: 0.9em;
  }

  :host([theme~='bubble']) ::slotted(vaadin-message[theme~='full-width']) {
    padding-block: var(--vaadin-padding-xl);
  }

  :host([theme~='bubble']) ::slotted(vaadin-message:not([theme~='full-width'], :where([typing][theme~='text']))) {
    --vaadin-message-content-background: var(--vaadin-background-container);
    --vaadin-message-content-padding: var(--vaadin-padding-s) var(--vaadin-padding-m);
    --vaadin-message-content-border-radius: 0 var(--vaadin-radius-l) var(--vaadin-radius-l) var(--vaadin-radius-l);

    width: fit-content;
    max-width: calc(100% - 2em);
  }

  :host([theme~='bubble']) ::slotted(vaadin-message[theme~='self']) {
    --vaadin-message-content-border-radius: var(--vaadin-radius-l) 0 var(--vaadin-radius-l) var(--vaadin-radius-l);
    --vaadin-message-avatar-visibility: hidden;
    --vaadin-message-content-background: linear-gradient(color-mix(in srgb, var(--vaadin-user-color) 10%, transparent))
      var(--vaadin-background-color);
    --vaadin-message-attachments-alignment: end;
    --vaadin-message-name-display: none;
    align-items: end;
    align-self: end;
  }

  :host([theme~='bubble'][theme~='one-to-one']) ::slotted(vaadin-message) {
    --vaadin-message-name-display: none;
    --vaadin-message-avatar-display: none;
  }
`;
