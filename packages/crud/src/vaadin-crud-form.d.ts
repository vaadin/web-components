import { FormLayoutElement } from '@vaadin/form-layout/src/vaadin-form-layout.js';

import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 */
declare class CrudForm<Item> extends IncludedMixin(FormLayoutElement) {
  /**
   * The item being edited.
   */
  item: Item | null | undefined;

  /**
   * Auto-generate form fields based on the JSON structure of the object provided.
   *
   * If not called, the method will be executed the first time an item is assigned.
   */
  _configure(object: Item): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-form': CrudForm<any>;
  }
}

export { CrudForm };
