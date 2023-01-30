/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const styles = css`
  :host {
    display: block;
  }

  #monthGrid {
    width: 100%;
    border-collapse: collapse;
  }

  #days-container tr,
  #weekdays-container tr {
    display: flex;
  }

  [part~='date'] {
    outline: none;
  }

  [part~='disabled'] {
    pointer-events: none;
  }

  [part='week-number'][hidden],
  [part='weekday'][hidden] {
    display: none;
  }

  [part='weekday'],
  [part~='date'] {
    width: calc(100% / 7);
    padding: 0;
    font-weight: normal;
  }

  [part='weekday']:empty,
  [part='week-number'] {
    width: 12.5%;
    flex-shrink: 0;
    padding: 0;
  }

  :host([week-numbers]) [part='weekday']:not(:empty),
  :host([week-numbers]) [part~='date'] {
    width: 12.5%;
  }
`;
