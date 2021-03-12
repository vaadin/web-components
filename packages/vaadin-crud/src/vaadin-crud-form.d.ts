import { FormLayoutElement } from '@vaadin/vaadin-form-layout/src/vaadin-form-layout.js';

import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * `<vaadin-crud-form>` is a <vaadin-form-layout> which automatically can configures all its items based
 * on the JSON structure of the first item set.
 *
 * You cannot manually configure fields but you can still style the layout as it's described in
 * `<vaadin-form-layout>` [Documentation](https://vaadin.com/components/vaadin-form-layout/html-api/elements/Vaadin.FormLayoutElement)
 */
declare class CrudFormElement<Item> extends IncludedMixin(FormLayoutElement) {
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
    'vaadin-crud-form': CrudFormElement<any>;
  }
}

export { CrudFormElement };

