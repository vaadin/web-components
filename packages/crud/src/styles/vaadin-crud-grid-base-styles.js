/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { gridStyles } from '@vaadin/grid/src/styles/vaadin-grid-core-styles';

const crudGrid = css`
  #scroller {
    border-radius: inherit;
  }
`;

export const crudGridStyles = [gridStyles, crudGrid];
