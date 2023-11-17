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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-lit-text-field.js';

/**
 * LitElement based version of `<vaadin-grid-pro-edit-text-field>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
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

defineCustomElement(GridProEditText);
