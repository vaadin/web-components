/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import '@vaadin/vaadin-lumo-styles/icons.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    font-size: var(--vaadin-breadcrumb-font-size, var(--vaadin-font-size-s));
    line-height: var(--vaadin-breadcrumb-line-height, var(--vaadin-line-height-xs));
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;
