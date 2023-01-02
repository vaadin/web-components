/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

/**
 * An element used internally by `<vaadin-grid-pro>`. Not intended to be used separately.
 *
 * @extends TextField
 * @private
 */
class GridProEditText extends TextField {
  static get is() {
    return 'vaadin-grid-pro-edit-text-field';
  }

  ready() {
    super.ready();
    this.setAttribute('theme', 'grid-pro-editor');
  }
}

customElements.define(GridProEditText.is, GridProEditText);
