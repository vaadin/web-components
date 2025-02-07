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
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import './vaadin-crud-dialog.js';
import './vaadin-crud-grid.js';
import './vaadin-crud-form.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CrudMixin } from './vaadin-crud-mixin.js';
import { crudStyles } from './vaadin-crud-styles.js';

registerStyles('vaadin-crud', crudStyles, { moduleId: 'vaadin-crud-styles' });

/**
 * `<vaadin-crud>` is a Web Component for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.
 *
 * ### Quick Start
 *
 * Assign an array to the [`items`](#/elements/vaadin-crud#property-items) property.
 *
 * A grid and an editor will be automatically generated and configured based on the data structure provided.
 *
 * ```html
 * <vaadin-crud></vaadin-crud>
 * ```
 *
 * ```js
 * const crud = document.querySelector('vaadin-crud');
 *
 * crud.items = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 * ```
 *
 * ### Data Provider Function
 *
 * Otherwise, you can provide a [`dataProvider`](#/elements/vaadin-crud#property-dataProvider) function.
 *
 * ```js
 * const crud = document.querySelector('vaadin-crud');
 *
 * const users = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 *
 * crud.dataProvider = (params, callback) => {
 *   const chunk = users.slice(params.page * params.pageSize, params.page * params.pageSize + params.pageSize);
 *   callback(chunk, people.length);
 * };
 * ```
 *
 * NOTE: The auto-generated editor only supports string types. If you need to handle special cases
 * customizing the editor is discussed below.
 *
 * ### Customization
 *
 * Alternatively you can fully configure the component by using `slot` names.
 *
 * Slot name      | Description
 * ---------------|----------------
 * `grid`         | To replace the auto-generated grid with a custom one.
 * `form`         | To replace the auto-generated form.
 * `save-button`  | To replace the "Save" button.
 * `cancel-button`| To replace the "Cancel" button.
 * `delete-button`| To replace the "Delete" button.
 * `toolbar`      | To provide the toolbar content (by default, it's empty).
 * `new-button`   | To replace the "New item" button.
 *
 * #### Example:
 *
 * ```html
 * <vaadin-crud id="crud">
 *   <vaadin-grid slot="grid">
 *     <vaadin-crud-edit-column></vaadin-crud-edit-column>
 *     <vaadin-grid-column id="column1"></vaadin-grid-column>
 *     <vaadin-grid-column id="column2"></vaadin-grid-column>
 *   </vaadin-grid>
 *
 *   <vaadin-form-layout slot="form">
 *     <vaadin-text-field label="First" path="name"></vaadin-text-field>
 *     <vaadin-text-field label="Surname" path="surname"></vaadin-text-field>
 *   </vaadin-form-layout>
 *
 *   <div slot="toolbar">Total singers: 2</div>
 *   <button slot="new-button">New singer</button>
 *
 *   <button slot="save-button">Save changes</button>
 *   <button slot="cancel-button">Discard changes</button>
 *   <button slot="delete-button">Delete singer</button>
 * </vaadin-crud>
 * ```
 * ```js
 * const crud = document.querySelector('#crud');
 *
 * const column1 = document.querySelector('#column1');
 * column1.headerRenderer = (root, column) => {
 *   root.textContent = 'Name';
 * };
 * column1.renderer = (root, column, model) => {
 *   root.textContent = model.item.name;
 * };
 *
 * const column2 = document.querySelector('#column2');
 * column2.headerRenderer = (root, column) => {
 *   root.textContent = 'Surname';
 * };
 * column2.renderer = (root, column, model) => {
 *   root.textContent = model.item.surname;
 * };
 *
 * crud.items = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 * ```
 *
 * ### Helpers
 *
 * The following elements are used to auto-configure the grid and the editor
 * - [`<vaadin-crud-edit-column>`](#/elements/vaadin-crud-edit-column)
 * - `<vaadin-crud-grid>` - can be replaced with custom [`<vaadin-grid>`](#/elements/vaadin-grid)
 * - `<vaadin-crud-form>` - can be replaced with custom [`<vaadin-form-layout>`](#/elements/vaadin-form-layout)
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `toolbar` | Toolbar container at the bottom. By default it contains the the `new` button
 *
 * The following custom properties are available:
 *
 * Custom Property | Description | Default
 * ----------------|----------------
 * --vaadin-crud-editor-max-height | max height of editor when opened on the bottom | 40%
 * --vaadin-crud-editor-max-width | max width of editor when opened on the side | 40%
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} editor-opened-changed - Fired when the `editorOpened` property changes.
 * @fires {CustomEvent} edited-item-changed - Fired when `editedItem` property changes.
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} size-changed - Fired when the `size` property changes.
 * @fires {CustomEvent} new - Fired when user wants to create a new item.
 * @fires {CustomEvent} edit - Fired when user wants to edit an existing item.
 * @fires {CustomEvent} delete - Fired when user wants to delete item.
 * @fires {CustomEvent} save - Fired when user wants to save a new or an existing item.
 * @fires {CustomEvent} cancel - Fired when user discards edition.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes CrudMixin
 */
class Crud extends CrudMixin(ControllerMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <div id="container">
        <div id="main">
          <slot name="grid"></slot>

          <div id="toolbar" part="toolbar">
            <slot name="toolbar"></slot>
            <slot name="new-button"></slot>
          </div>
        </div>

        <div
          part="editor"
          id="editor"
          role="group"
          aria-labelledby="header"
          hidden$="[[__computeEditorHidden(editorOpened, _fullscreen, editorPosition)]]"
        >
          <div part="scroller" id="scroller">
            <div part="header" id="header">
              <slot name="header"></slot>
            </div>
            <slot name="form"></slot>
          </div>

          <div part="footer" role="toolbar">
            <slot name="save-button"></slot>
            <slot name="cancel-button"></slot>
            <slot name="delete-button"></slot>
          </div>
        </div>
      </div>

      <vaadin-crud-dialog
        id="dialog"
        opened="[[__computeDialogOpened(editorOpened, _fullscreen, editorPosition)]]"
        fullscreen="[[_fullscreen]]"
        aria-label="[[__dialogAriaLabel]]"
        no-close-on-outside-click="[[__isDirty]]"
        no-close-on-esc="[[__isDirty]]"
        theme$="[[_theme]]"
        on-opened-changed="__onDialogOpened"
      ></vaadin-crud-dialog>

      <vaadin-confirm-dialog
        theme$="[[_theme]]"
        id="confirmCancel"
        on-confirm="__confirmCancel"
        cancel-button-visible
        confirm-text="[[__effectiveI18n.confirm.cancel.button.confirm]]"
        cancel-text="[[__effectiveI18n.confirm.cancel.button.dismiss]]"
        header="[[__effectiveI18n.confirm.cancel.title]]"
        message="[[__effectiveI18n.confirm.cancel.content]]"
        confirm-theme="primary"
      ></vaadin-confirm-dialog>

      <vaadin-confirm-dialog
        theme$="[[_theme]]"
        id="confirmDelete"
        on-confirm="__confirmDelete"
        cancel-button-visible
        confirm-text="[[__effectiveI18n.confirm.delete.button.confirm]]"
        cancel-text="[[__effectiveI18n.confirm.delete.button.dismiss]]"
        header="[[__effectiveI18n.confirm.delete.title]]"
        message="[[__effectiveI18n.confirm.delete.content]]"
        confirm-theme="primary error"
      ></vaadin-confirm-dialog>
    `;
  }

  static get is() {
    return 'vaadin-crud';
  }

  static get cvdlName() {
    return 'vaadin-crud';
  }
}

defineCustomElement(Crud);

export { Crud };
