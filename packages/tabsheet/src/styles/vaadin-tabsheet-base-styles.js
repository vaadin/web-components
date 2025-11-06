/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { loaderStyles } from '@vaadin/component-base/src/styles/loader-styles.js';

export const tabSheetStyles = [
  loaderStyles,
  css`
    :host {
      display: flex;
      flex-direction: column;
      border: var(--vaadin-tabsheet-border-width, 1px) solid
        var(--vaadin-tabsheet-border-color, var(--vaadin-border-color-secondary));
      border-radius: var(--vaadin-tabsheet-border-radius, var(--vaadin-radius-l));
      overflow: hidden;
    }

    :host([hidden]) {
      display: none !important;
    }

    [part='tabs-container'] {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--vaadin-tabsheet-gap, var(--vaadin-gap-s));
      padding: var(--vaadin-tabsheet-padding, var(--vaadin-padding-m));
      box-sizing: border-box;
    }

    ::slotted([slot='tabs']) {
      flex: 1;
      align-self: stretch;
      min-width: 128px;
    }

    ::slotted([hidden]) {
      display: none !important;
    }

    [part='content'] {
      position: relative;
      flex: 1;
      box-sizing: border-box;
      --vaadin-scroller-padding-block: var(--vaadin-tabsheet-padding, var(--vaadin-padding-m));
      --vaadin-scroller-padding-inline: var(--vaadin-tabsheet-padding, var(--vaadin-padding-m));
      --vaadin-scroller-overflow-indicator-top-opacity: 1;
    }

    [part='content'][focus-ring] {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
      outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
    }

    :host([loading]) [part='content'] {
      align-content: center;
    }

    [part='loader'] {
      margin: auto;
    }

    :host([theme~='no-border']) {
      border: 0;
      border-radius: 0;
    }

    :host([theme~='no-padding']) [part='content'] {
      padding: 0 !important;
      --vaadin-scroller-padding-block: 0px !important;
      --vaadin-scroller-padding-inline: 0px !important;
    }
  `,
];
