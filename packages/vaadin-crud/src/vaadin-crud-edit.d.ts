import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-crud-edit>` is a helper element for `<vaadin-grid-column>` that provides
 * an easily themable button that fires an `edit` event with the row item as detail
 * when clicked.
 *
 * Typical usage is in a `<vaadin-grid-column>` of a custom `<vaadin-grid>` inside
 * a `<vaadin-crud>` to enable editing.
 */
declare class CrudEditElement extends ThemableMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-edit': CrudEditElement;
  }
}
