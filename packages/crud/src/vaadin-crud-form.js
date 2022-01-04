/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/text-field/src/vaadin-text-field.js';
import { FormLayout } from '@vaadin/form-layout/src/vaadin-form-layout.js';
import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends FormLayout
 * @mixes IncludedMixin
 * @private
 */
class CrudForm extends IncludedMixin(FormLayout) {
  static get is() {
    return 'vaadin-crud-form';
  }

  static get properties() {
    return {
      /**
       * The item being edited.
       * @type {unknown}
       */
      item: Object
    };
  }

  static get observers() {
    return ['__onItemChange(item)'];
  }

  /**
   * Auto-generate form fields based on the JSON structure of the object provided.
   *
   * If not called, the method will be executed the first time an item is assigned.
   * @param {unknown} object
   * @protected
   */
  _configure(object) {
    this.innerHTML = '';
    this._fields = [];
    this.__createFields(this, object);
    this._updateLayout();
  }

  /** @private */
  __onItemChange(item) {
    if (!this._fields) {
      this._configure(item);
    }
  }

  /** @private */
  __createField(parent, path) {
    const field = document.createElement('vaadin-text-field');
    field.label = this.__capitalize(path);
    field.path = path;
    field.required = true;
    parent.appendChild(field);
    this._fields.push(field);
    return field;
  }

  /** @private */
  __createFields(parent, object, path) {
    Object.keys(object).forEach((prop) => {
      if (!this.include && this.exclude && this.exclude.test(prop)) {
        return;
      }
      const newPath = (path ? `${path}.` : '') + prop;
      if (object[prop] && typeof object[prop] === 'object') {
        this.__createFields(parent, object[prop], newPath);
      } else {
        this.__createField(parent, newPath);
      }
    });
    if (!this._fields.length) {
      this._fields = undefined;
    }
  }

  /** @private */
  __capitalize(path) {
    return path
      .toLowerCase()
      .replace(/([^\w]+)/g, ' ')
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
  }

  /** @private */
  __set(path, val, obj) {
    if (obj && path) {
      path
        .split('.')
        .slice(0, -1)
        .reduce((o, p) => (o[p] = o[p] || {}), obj);
      this.set(path, val, obj);
    }
  }
}

customElements.define(CrudForm.is, CrudForm);

export { CrudForm };
