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
import { Checkbox } from '@vaadin/checkbox/src/vaadin-lit-checkbox.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/**
 * LitElement based version of `<vaadin-grid-pro-edit-checkbox>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class GridProEditCheckbox extends Checkbox {
  static get is() {
    return 'vaadin-grid-pro-edit-checkbox';
  }
}

defineCustomElement(GridProEditCheckbox);
