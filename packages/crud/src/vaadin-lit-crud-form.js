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
 *
 */
class CrudForm extends CrudFormMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-crud-form';
  }
}
defineCustomElement(CrudForm);
export { CrudForm };
