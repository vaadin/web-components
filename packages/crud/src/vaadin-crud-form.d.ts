/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { FormLayout } from '@vaadin/form-layout/src/vaadin-form-layout.js';
import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 */
declare class CrudForm<Item> extends IncludedMixin(FormLayout) {
  /**
   * The item being edited.
   */
  item: Item | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-form': CrudForm<any>;
  }
}

export { CrudForm };
