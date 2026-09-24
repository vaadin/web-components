/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const messageInputButtonStyles = css`
  :host {
    flex: none;
    align-self: end;
    --vaadin-button-border-width: 0;
    --vaadin-button-background: transparent;
    --vaadin-button-text-color: var(--vaadin-text-color-secondary);
    --vaadin-button-padding: 0;
    --vaadin-button-border-radius: var(--vaadin-radius-s);
  }

  :host(:is([focus-ring], :focus-visible)) {
    outline-offset: 0.125em;
  }

  :host(:hover) {
    --vaadin-button-text-color: var(--vaadin-text-color);
  }
`;
