/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

declare class TabSheet extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tabsheet': TabSheet;
  }
}

export { TabSheet };
