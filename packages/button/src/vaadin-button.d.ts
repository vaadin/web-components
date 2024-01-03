/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from './vaadin-button-component.js';

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-button': Button;
  }
}

export { Button };
