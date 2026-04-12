/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='link'] {
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--vaadin-breadcrumb-item-max-width, 12em);
  }

  [part='separator'] {
    display: inline-flex;
    align-items: center;
  }

  :host([first]) [part='separator'] {
    display: none;
  }

  :host([disabled]) [part='link'] {
    pointer-events: none;
  }

  :host([current]) [part='link'] {
    pointer-events: none;
  }

  :host([dir='rtl']) [part='separator'] {
    scale: -1;
  }
`;
