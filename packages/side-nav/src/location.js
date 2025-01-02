/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Facade for `document.location`, can be stubbed for testing.
 *
 * For internal use only.
 */
export const location = {
  get pathname() {
    return document.location.pathname;
  },
  get search() {
    return document.location.search;
  },
};
