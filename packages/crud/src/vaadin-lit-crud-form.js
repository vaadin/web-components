/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/text-field/src/vaadin-text-field.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FormLayout } from '@vaadin/form-layout/src/vaadin-form-layout.js';
import { CrudFormMixin } from './vaadin-crud-form-mixin.js';

/**
 * LitElement based version of `<vaadin-crud-form>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class CrudForm extends CrudFormMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-crud-form';
  }
}
defineCustomElement(CrudForm);
export { CrudForm };
