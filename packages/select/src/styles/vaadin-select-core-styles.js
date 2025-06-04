/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const selectStyles = css`
  :host {
    position: relative;
  }

  ::slotted([slot='value']) {
    flex-grow: 1;
  }
`;
