/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/loader-styles.js';

export const tabSheetStyles = [
  loaderStyles,
  css`
    :host {
      display: flex;
      flex-direction: column;
      border: var(--vaadin-tabsheet-border-width, 1px) solid
        var(--vaadin-tabsheet-border-color, var(--vaadin-border-color));
      border-radius: var(--vaadin-tabsheet-border-radius, var(--vaadin-radius-l));
    }

    :host([hidden]) {
      display: none !important;
    }

    [part='tabs-container'] {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--vaadin-tabsheet-gap, var(--vaadin-gap-container-inline));
      padding: var(--vaadin-tabsheet-padding, var(--vaadin-padding));
    }

    ::slotted([slot='tabs']) {
      flex: 1;
      align-self: stretch;
      min-width: 8em;
    }

    [part='content'] {
      position: relative;
      flex: 1;
      box-sizing: border-box;
      padding: var(--vaadin-tabsheet-padding, var(--vaadin-padding));
      border-top: var(--vaadin-tabsheet-border-width, 1px) solid transparent;
      margin-top: max(1px, calc(var(--vaadin-tabsheet-border-width, 1px) * -1));
    }

    [part='content'][overflow~='top'] {
      border-top-color: var(--vaadin-tabsheet-border-color, var(--vaadin-border-color));
    }

    :host([loading]) [part='content'] {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([theme~='no-border']) {
      border: 0;
      border-radius: 0;
    }

    :host([theme~='no-padding']) [part='content'] {
      padding: 0;
    }
  `,
];
