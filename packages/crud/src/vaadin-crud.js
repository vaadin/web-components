/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@polymer/iron-media-query/iron-media-query.js';
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import './vaadin-dialog-layout.js';
import './vaadin-crud-grid.js';
import './vaadin-crud-form.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const HOST_PROPS = {
  save: [{ attr: 'disabled', prop: '__isDirty', parseProp: '__isSaveBtnDisabled' }, { prop: 'i18n.saveItem' }],
  cancel: [{ prop: 'i18n.cancel' }],
  delete: [{ attr: 'hidden', prop: '__isNew', parseProp: (prop) => prop }, { prop: 'i18n.deleteItem' }]
};

/**
 * `<vaadin-crud>` is a Web Component for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.
 *
 * ### Quick Start
 *
 * Assign an array to the [`items`](#/elements/vaadin-crud#property-items) property.
 *
 * A grid and an editor will be automatically generated and configured based on the data structure provided.
 *
 * #### Example:
 * ```html
 * <vaadin-crud items='[{"name": "John", "surname": "Lennon", "role": "singer"},
 *                      {"name": "Ringo", "surname": "Starr", "role": "drums"}]'></vaadin-crud>
 * ```
 *
 * ### Data Provider Function
 *
 * Otherwise, you can provide a [`dataProvider`](#/elements/vaadin-crud#property-dataProvider) function.
 * #### Example:
 * ```html
 * <vaadin-crud></vaadin-crud>
 * ```
 * ```js
 * const crud = document.querySelector('vaadin-crud');
 * const users = [{'name': 'John', 'surname': 'Lennon', 'role': 'singer'}, ...];
 * crud.dataProvider = function(params, callback) {
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
 * Slot name | Description
 * ----------------|----------------
 * `grid` | To replace the auto-generated grid with a custom one.
 * `form` | To replace the auto-generated form.
 * `toolbar` | To replace the toolbar content. Add an element with the attribute `new-button` for the new item action.
 *
 * #### Example:
 *
 * ```html
 * <vaadin-crud
 *   id="crud"
 *   items='[{"name": "John", "surname": "Lennon", "role": "singer"},
 *           {"name": "Ringo", "surname": "Starr", "role": "drums"}]'
 * >
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
 *   <div slot="toolbar">
 *     Total singers: [[size]]
 *     <button new-button>New singer</button>
 *   </div>
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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
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
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Crud extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          --vaadin-crud-editor-max-height: 40%;
          --vaadin-crud-editor-max-width: 40%;
        }

        :host,
        #main {
          display: flex;
          flex-direction: column;
          height: 400px;
          flex: 1 1 100%;
          align-self: stretch;
          position: relative;
          overflow: hidden;
        }

        #main {
          height: 100%;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='toolbar'] {
          display: flex;
          flex-shrink: 0;
          align-items: baseline;
          justify-content: flex-end;
        }

        :host([no-toolbar]) [part='toolbar'] {
          display: none;
        }

        #container {
          display: flex;
          height: 100%;
        }

        :host([editor-position='bottom']) #container {
          flex-direction: column;
        }
      </style>

      <div id="container">
        <div id="main">
          <slot name="grid">
            <vaadin-crud-grid
              theme$="[[theme]]"
              id="grid"
              include="[[include]]"
              exclude="[[exclude]]"
              no-sort="[[noSort]]"
              no-filter="[[noFilter]]"
              no-head="[[noHead]]"
              hide-edit-column="[[editOnClick]]"
            ></vaadin-crud-grid>
          </slot>

          <div id="toolbar" part="toolbar" on-click="__new">
            <slot name="toolbar">
              <vaadin-button new-button="" id="new" theme="primary">[[i18n.newItem]]</vaadin-button>
            </slot>
          </div>
        </div>
        <vaadin-dialog-layout
          theme$="[[theme]]"
          form="[[_form]]"
          save-button="[[_saveButton]]"
          cancel-button="[[_cancelButton]]"
          delete-button="[[_deleteButton]]"
          id="dialog"
          no-close-on-outside-click="[[__isDirty]]"
          no-close-on-esc="[[__isDirty]]"
          opened="{{editorOpened}}"
          editor-position$="{{editorPosition}}"
          mobile="[[__mobile]]"
          theme="crud"
        >
          <h3 slot="header">[[__computeEditorHeader(__isNew, i18n.newItem, i18n.editItem)]]</h3>
          <div id="editor">
            <slot name="form">
              <vaadin-crud-form
                theme$="[[theme]]"
                id="form"
                include="[[include]]"
                exclude="[[exclude]]"
              ></vaadin-crud-form>
            </slot>
          </div>

          <slot name="save-button">
            <vaadin-button id="save" on-click="__save" theme="primary" disabled$="[[__isSaveBtnDisabled(__isDirty)]]">
              [[i18n.saveItem]]
            </vaadin-button>
          </slot>
          <slot name="cancel-button">
            <vaadin-button id="cancel" on-click="__cancelBound" theme="tertiary">[[i18n.cancel]]</vaadin-button>
          </slot>
          <div slot="footer" style="flex: auto;"></div>
          <slot name="delete-button">
            <vaadin-button id="delete" on-click="__delete" theme="tertiary error" hidden$="[[__isNew]]"
              >[[i18n.deleteItem]]</vaadin-button
            >
          </slot>
        </vaadin-dialog-layout>
      </div>

      <vaadin-confirm-dialog
        theme$="[[theme]]"
        id="confirmCancel"
        on-confirm="__confirmCancel"
        cancel
        confirm-text="[[i18n.confirm.cancel.button.confirm]]"
        cancel-text="[[i18n.confirm.cancel.button.dismiss]]"
        header="[[i18n.confirm.cancel.title]]"
        message="[[i18n.confirm.cancel.content]]"
        confirm-theme="primary"
      ></vaadin-confirm-dialog>
      <vaadin-confirm-dialog
        theme$="[[theme]]"
        id="confirmDelete"
        on-confirm="__confirmDelete"
        cancel
        confirm-text="[[i18n.confirm.delete.button.confirm]]"
        cancel-text="[[i18n.confirm.delete.button.dismiss]]"
        header="[[i18n.confirm.delete.title]]"
        message="[[i18n.confirm.delete.content]]"
        confirm-theme="primary error"
      ></vaadin-confirm-dialog>

      <iron-media-query query="[[__mobileMediaQuery]]" query-matches="{{__mobile}}"></iron-media-query>
    `;
  }

  static get is() {
    return 'vaadin-crud';
  }

  static get properties() {
    return {
      /**
       * A reference to the grid used for displaying the item list
       * @private
       */
      _grid: {
        type: HTMLElement,
        observer: '__onGridChange'
      },

      /**
       * A reference to the editor component which will be teleported to the dialog
       * @private
       */
      _form: {
        type: HTMLElement,
        observer: '__onFormChange'
      },

      /**
       * A reference to the save button which will be teleported to the dialog
       * @private
       */
      _saveButton: {
        type: HTMLElement,
        observer: '__onSaveButtonChange'
      },

      /**
       * A reference to the save button which will be teleported to the dialog
       * @private
       */
      _deleteButton: {
        type: HTMLElement,
        observer: '__onDeleteButtonChange'
      },

      /**
       * A reference to the save button which will be teleported to the dialog
       * @private
       */
      _cancelButton: {
        type: HTMLElement,
        observer: '__onCancelButtonChange'
      },

      /**
       * An array containing the items which will be stamped to the column template instances.
       * @type {Array<unknown> | undefined}
       */
      items: {
        type: Array,
        notify: true,
        observer: '__onItemsChange'
      },

      /**
       * The item being edited in the dialog.
       * @type {unknown}
       */
      editedItem: {
        type: Object,
        observer: '__onItemChange',
        notify: true
      },

      /**
       * Sets how editor will be presented on desktop screen.
       *
       * Accepted values are:
       *   - `` (default) - form will open as overlay
       *   - `bottom` - form will open below the grid
       *   - `aside` - form will open on the grid side (_right_, if lft and _left_ if rtl)
       * @attr {bottom|aside} editor-position
       * @type {!CrudEditorPosition}
       */
      editorPosition: {
        type: String,
        value: '',
        reflectToAttribute: true,
        observer: '__onEditorPositionChange'
      },

      /**
       * Enables user to click on row to edit it.
       * Note: When enabled, auto-generated grid won't show the edit column.
       * @attr {boolean} edit-on-click
       * @type {boolean}
       */
      editOnClick: {
        type: Boolean,
        value: false
      },

      /**
       * Function that provides items lazily. Receives arguments `params`, `callback`
       *
       * `params.page` Requested page index
       * `params.pageSize` Current page size
       * `params.filters` Currently applied filters
       * `params.sortOrders` Currently applied sorting orders
       *
       * `callback(items, size)` Callback function with arguments:
       *   - `items` Current page of items
       *   - `size` Total number of items
       * @type {CrudDataProvider | undefined}
       */
      dataProvider: {
        type: Function,
        observer: '__onDataProviderChange'
      },

      /**
       * Disable filtering when grid is autoconfigured.
       * @attr {boolean} no-filter
       */
      noFilter: Boolean,

      /**
       * Disable sorting when grid is autoconfigured.
       * @attr {boolean} no-sort
       */
      noSort: Boolean,

      /**
       * Remove grid headers when it is autoconfigured.
       * @attr {boolean} no-head
       */
      noHead: Boolean,

      /**
       * A comma-separated list of fields to include in the generated grid and the generated editor.
       *
       * It can be used to explicitly define the field order.
       *
       * When it is defined [`exclude`](#/elements/vaadin-crud#property-exclude) is ignored.
       *
       * Default is undefined meaning that all properties in the object should be mapped to fields.
       */
      include: String,

      /**
       * A comma-separated list of fields to be excluded from the generated grid and the generated editor.
       *
       * When [`include`](#/elements/vaadin-crud#property-include) is defined, this parameter is ignored.
       *
       * Default is to exclude all private fields (those properties starting with underscore)
       */
      exclude: String,

      /**
       * Reflects the opened status of the editor.
       */
      editorOpened: {
        type: Boolean,
        notify: true,
        observer: '__onOpenedChanged'
      },

      /**
       * Number of items in the data set which is reported by the grid.
       * Typically it reflects the number of filtered items displayed in the grid.
       */
      size: {
        type: Number,
        readOnly: true,
        notify: true
      },

      /**
       * Controls visiblity state of toolbar.
       * When set to false toolbar is hidden and shown when set to true.
       * @attr {boolean} no-toolbar
       */
      noToolbar: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The object used to localize this component.
       * For changing the default localization, change the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure and default values:
       *
       * ```
       * {
       *   newItem: 'New item',
       *   editItem: 'Edit item',
       *   saveItem: 'Save',
       *   cancel: 'Cancel',
       *   deleteItem: 'Delete...',
       *   editLabel: 'Edit',
       *   confirm: {
       *     delete: {
       *       title: 'Confirm delete',
       *       content: 'Are you sure you want to delete the selected item? This action cannot be undone.',
       *       button: {
       *         confirm: 'Delete',
       *         dismiss: 'Cancel'
       *       }
       *     },
       *     cancel: {
       *       title: 'Unsaved changes',
       *       content: 'There are unsaved modifications to the item.',
       *       button: {
       *         confirm: 'Discard',
       *         dismiss: 'Continue editing'
       *       }
       *     }
       *   }
       * }
       * ```
       *
       * @type {!CrudI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        value: function () {
          return {
            newItem: 'New item',
            editItem: 'Edit item',
            saveItem: 'Save',
            cancel: 'Cancel',
            deleteItem: 'Delete...',
            editLabel: 'Edit',
            confirm: {
              delete: {
                title: 'Delete item',
                content: 'Are you sure you want to delete this item? This action cannot be undone.',
                button: {
                  confirm: 'Delete',
                  dismiss: 'Cancel'
                }
              },
              cancel: {
                title: 'Discard changes',
                content: 'There are unsaved changes to this item.',
                button: {
                  confirm: 'Discard',
                  dismiss: 'Cancel'
                }
              }
            }
          };
        }
      },

      /** @private */
      __isDirty: Boolean,

      /** @private */
      __isNew: Boolean,

      /** @private */
      __mobileMediaQuery: {
        value: '(max-width: 600px), (max-height: 600px)'
      },

      /** @private */
      __mobile: {
        type: Boolean,
        observer: '__mobileChanged'
      }
    };
  }

  static get observers() {
    return [
      '__onI18Change(i18n, _grid)',
      '__onEditOnClickChange(editOnClick, _grid)',
      '__hostPropsChanged(' +
        HOST_PROPS.save.map(({ prop }) => prop).join(',') +
        ',' +
        HOST_PROPS.cancel.map(({ prop }) => prop).join(',') +
        ',' +
        HOST_PROPS.delete.map(({ prop }) => prop).join(',') +
        ')'
    ];
  }

  /** @protected */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    if (typeof licenseChecker === 'function') {
      licenseChecker(Crud);
    }
  }

  constructor() {
    super();
    this._observer = new FlattenedNodesObserver(this, (info) => {
      this.__onDomChange(info.addedNodes);
    });
  }

  /** @protected */
  ready() {
    super.ready();
    this.__editListener = (e) => this.__onCrudGridEdit(e);
    this.__changeListener = (e) => this.__onFormChanges(e);
    this.__saveBound = this.__save.bind(this);
    this.__cancelBound = this.__cancel.bind(this);
    this.__deleteBound = this.__delete.bind(this);
    this.__gridSizeListener = this.__onGridSizeChanges.bind(this);
    this.__boundEditOnClickListener = this.__editOnClickListener.bind(this);
    this._grid = this.$.grid;
    this._form = this.$.form;
    this._saveButton = this.$.save;
    this._deleteButton = this.$.delete;
    this._cancelButton = this.$.cancel;
    this.$.dialog.$.dialog.$.overlay.addEventListener('vaadin-overlay-outside-click', this.__cancelBound);
    this.$.dialog.$.dialog.$.overlay.addEventListener('vaadin-overlay-escape-press', this.__cancelBound);
  }

  /** @private */
  __isSaveBtnDisabled(isDirty) {
    // Used instead of isDirty proprety binding in order to enable overriding of the behaviour
    // by overriding the method (i.e. from Flow component)
    return !isDirty;
  }

  /** @private */
  __computeEditorHeader(isNew, newItem, editItem) {
    return isNew ? newItem : editItem;
  }

  /** @private */
  __onI18Change(i18n, grid) {
    if (!grid) {
      return;
    }

    afterNextRender(grid, () => {
      Array.from(grid.querySelectorAll('vaadin-crud-edit-column')).forEach((column) => {
        column.ariaLabel = i18n.editLabel;
      });
    });
  }

  /** @private */
  __onEditorPositionChange(editorPosition) {
    if (Crud._isValidEditorPosition(editorPosition)) {
      return;
    }
    this.editorPosition = '';
  }

  /** @private */
  static _isValidEditorPosition(editorPosition) {
    return ['bottom', 'aside'].indexOf(editorPosition) != -1;
  }

  /** @private */
  __onOpenedChanged(opened, old) {
    if (!opened && old) {
      this.__closeEditor();
    } else {
      this.__onFormChange(this._form);
    }

    this.__toggleToolbar();
  }

  /** @private */
  __mobileChanged() {
    this.__toggleToolbar();
  }

  /** @private */
  __toggleToolbar() {
    // Hide toolbar to give more room for the editor when it's positioned below the grid
    if (this.editorPosition === 'bottom' && !this.__mobile) {
      this.$.toolbar.style.display = this.editorOpened ? 'none' : '';
    }
  }

  /** @private */
  __onDomChange(nodes) {
    nodes.forEach((node) => {
      if (node.getAttribute) {
        const slotAttributeValue = node.getAttribute('slot');
        if (!slotAttributeValue) {
          return;
        }

        if (slotAttributeValue == 'grid') {
          // Force to remove listener on previous grid first
          this.__onEditOnClickChange(false, this._grid);
          this._grid = node;
          this.__onEditOnClickChange(this.editOnClick, this._grid);
        } else if (slotAttributeValue == 'form') {
          this._form = node;
        } else if (slotAttributeValue.indexOf('button') >= 0) {
          const [button] = slotAttributeValue.split('-');
          this[`_${button}Button`] = node;
        }
      }
    });
  }

  /** @private */
  __onCrudGridEdit(e) {
    e.stopPropagation();
    this.__confirmBeforeChangingEditedItem(e.detail.item);
  }

  /** @private */
  __onFormChanges() {
    this.__isDirty = true;
  }

  /** @private */
  __onGridSizeChanges() {
    this._setSize(this._grid.size);
  }

  /** @private */
  __onGridChange(grid, old) {
    if (old) {
      old.removeEventListener('edit', this.__editListener);
      old.removeEventListener('size-changed', this.__gridSizeListener);
    }
    if (this.items) {
      this.__onItemsChange(this.items);
    }
    if (this.editedItem) {
      this.__onItemChange(this.editedItem);
    }
    grid.addEventListener('edit', this.__editListener);
    grid.addEventListener('size-changed', this.__gridSizeListener);
    this.__onGridSizeChanges();
  }

  /** @private */
  __onFormChange(form, old) {
    if (old && old.parentElement) {
      old.parentElement && old.parentElement.removeChild(old);
      old.removeEventListener('change', this.__changeListener);
      old.removeEventListener('input', this.__changeListener);
    }
    if (!form) {
      return;
    }
    if (this.items) {
      this.__onItemsChange(this.items);
    }
    if (this.editedItem) {
      this.__onItemChange(this.editedItem);
    }
    form.addEventListener('change', this.__changeListener);
    form.addEventListener('input', this.__changeListener);
  }

  /** @private */
  __onSaveButtonChange(save, old) {
    this.__setupSlottedButton(save, old, this.__saveBound);
  }

  /** @private */
  __onDeleteButtonChange(deleteButton, old) {
    this.__setupSlottedButton(deleteButton, old, this.__deleteBound);
  }

  /** @private */
  __onCancelButtonChange(cancel, old) {
    this.__setupSlottedButton(cancel, old, this.__cancelBound);
  }

  /** @private */
  __setupSlottedButton(slottedButton, currentButton, clickListener) {
    if (currentButton && currentButton.parentElement) {
      currentButton.parentElement.removeChild(currentButton);
    }

    if (slottedButton.parentElement === this) {
      slottedButton.addEventListener('click', clickListener);
    }
  }

  /** @private */
  __hostPropsChanged() {
    this.__propagateHostAttributes();
  }

  /** @private */
  __propagateHostAttributes() {
    this.__propagateHostAttributesToButton(this._saveButton, HOST_PROPS.save);
    this.__propagateHostAttributesToButton(this._cancelButton, HOST_PROPS.cancel);
    this.__propagateHostAttributesToButton(this._deleteButton, HOST_PROPS.delete);
  }

  /** @private */
  __propagateHostAttributesToButton(button, props) {
    if (button) {
      props.forEach(({ attr, prop, parseProp }) => {
        if (prop.indexOf('i18n') >= 0) {
          button.textContent = this.i18n[prop.split('.')[1]];
        } else {
          if (typeof parseProp === 'string') {
            this._setOrToggleAttribute(attr, this[parseProp](this[prop]), button);
            return;
          }

          this._setOrToggleAttribute(attr, parseProp(this[prop]), button);
        }
      });
    }
  }

  /** @private */
  _setOrToggleAttribute(name, value, node) {
    if (!name || !node) {
      return;
    }

    if (value) {
      node.setAttribute(name, typeof value === 'boolean' ? '' : value);
    } else {
      node.removeAttribute(name);
    }
  }

  /** @private */
  __onDataProviderChange(dataProvider) {
    if (this._grid) {
      this._grid.dataProvider = this.__createDataProviderProxy(dataProvider);
    }
  }

  /** @private */
  __onEditOnClickChange(rowToEditChange, _grid) {
    if (!_grid) {
      return;
    }

    if (rowToEditChange) {
      _grid.addEventListener('active-item-changed', this.__boundEditOnClickListener);
    } else {
      _grid.removeEventListener('active-item-changed', this.__boundEditOnClickListener);
    }
  }

  /** @private */
  __editOnClickListener(event) {
    const item = event.detail.value;
    if (this.editorOpened && this.__isDirty) {
      this.__confirmBeforeChangingEditedItem(item);
      return;
    }
    if (item) {
      this.__edit(item);
    } else if (!this.__keepOpened) {
      this.__closeEditor();
    }
  }

  /** @private */
  __confirmBeforeChangingEditedItem(item, keepOpened) {
    if (
      this.editorOpened && // Editor opened
      this.__isDirty && // Form change has been made
      this.editedItem !== item // Item is different
    ) {
      this.$.confirmCancel.opened = true;
      const listenOnce = (event) => {
        event.preventDefault(); // prevent editor to get closed
        if (item || keepOpened) {
          this.__edit(item);
          this.__clearItemAndKeepEditorOpened(item, keepOpened);
        } else {
          this.__closeEditor();
        }
        this.removeEventListener('cancel', listenOnce);
      };
      this.addEventListener('cancel', listenOnce);
    } else {
      this.__edit(item);
      this.__clearItemAndKeepEditorOpened(item, keepOpened);
    }
  }

  /** @private */
  __clearItemAndKeepEditorOpened(item, keepOpened) {
    if (!item) {
      setTimeout(() => {
        this.__keepOpened = keepOpened;
        this.editedItem = this._grid.activeItem = undefined;
      });
    }
  }

  /** @private */
  __createDataProviderProxy(dataProvider) {
    return (params, callback) => {
      const callbackProxy = (chunk, size) => {
        if (chunk && chunk[0]) {
          this.__model = chunk[0];
        }

        callback(chunk, size);
      };

      dataProvider(params, callbackProxy);
    };
  }

  /** @private */
  __onItemsChange(items) {
    if (this.items && this.items[0]) {
      this.__model = items[0];
    }

    if (this._grid) {
      this._grid.items = items;
    }
  }

  /** @private */
  __onItemChange(item) {
    if (!this._form) {
      return;
    }
    if (item) {
      if (!this._fields.length && this._form._configure) {
        if (this.__model) {
          this._form._configure(this.__model);
        } else {
          console.warn(
            '<vaadin-crud> Unable to autoconfigure form because the data structure is unknown. ' +
              'Either specify `include` or ensure at least one item is available beforehand.'
          );
        }
      }
      this._form.item = item;
      this._fields.forEach((e) => {
        const path = e.path || e.getAttribute('path');
        path && (e.value = this.get(path, item));
      });

      this.__isNew = this.__isNew || (this.items && this.items.indexOf(item) < 0);
      this.editorOpened = true;
    }
  }

  /**
   * A reference to all fields inside the [`_form`](#/elements/vaadin-crud#property-_form) element
   * @return {!Array<!HTMLElement>}
   * @protected
   */
  get _fields() {
    if (!this.__fields || !this.__fields.length) {
      this.__fields = Array.from(this._form.querySelectorAll('*')).filter((e) => e.validate || e.checkValidity);
    }
    return this.__fields;
  }

  /** @private */
  __validate() {
    return this._fields.every((e) => (e.validate || e.checkValidity).call(e));
  }

  /** @private */
  __setHighlightedItem(item) {
    if (this._grid === this.$.grid) {
      this._grid.selectedItems = item ? [item] : [];
    }
  }

  /** @private */
  __closeEditor() {
    this.editorOpened = false;
    this.__isDirty = false;
    this.__setHighlightedItem(null);

    // Delay changing the item in order not to modify editor while closing
    setTimeout(() => this.__clearItemAndKeepEditorOpened(null, false));
  }

  /** @private */
  __new(event) {
    // This allows listening to parent element and fire only when clicking on default or custom new-button.
    if (event.composedPath().filter((e) => e.nodeType == 1 && e.hasAttribute('new-button'))[0]) {
      this.__confirmBeforeChangingEditedItem(null, true);
    }
  }

  /** @private */
  __edit(item) {
    if (this.editedItem === item) {
      return;
    }
    this.__setHighlightedItem(item);
    this.__openEditor('edit', item);
  }

  /** @private */
  __openEditor(type, item) {
    this.__isDirty = false;
    this.__isNew = !item;
    const evt = this.dispatchEvent(
      new CustomEvent(this.__isNew ? 'new' : 'edit', { detail: { item: item }, cancelable: true })
    );
    if (evt) {
      this.editedItem = item || {};
    } else {
      this.editorOpened = true;
    }
  }

  /** @private */
  __save() {
    if (!this.__validate()) {
      return;
    }

    const item = Object.assign({}, this.editedItem);
    this._fields.forEach((e) => {
      const path = e.path || e.getAttribute('path');
      path && this.__set(path, e.value, item);
    });
    const evt = this.dispatchEvent(new CustomEvent('save', { detail: { item: item }, cancelable: true }));
    if (evt) {
      if (this.__isNew && !this.dataProvider) {
        if (!this.items) {
          this.items = [item];
        } else {
          this.items.push(item);
        }
      } else {
        Object.assign(this.editedItem, item);
      }
      this._grid.clearCache();
      this.__closeEditor();
    }
  }

  /** @private */
  __cancel() {
    if (this.__isDirty) {
      this.$.confirmCancel.opened = true;
    } else {
      this.__confirmCancel();
    }
  }

  /** @private */
  __confirmCancel() {
    const evt = this.dispatchEvent(new CustomEvent('cancel', { detail: { item: this.editedItem }, cancelable: true }));
    if (evt) {
      this.__closeEditor();
    }
  }

  /** @private */
  __delete() {
    this.$.confirmDelete.opened = true;
  }

  /** @private */
  __confirmDelete() {
    const evt = this.dispatchEvent(new CustomEvent('delete', { detail: { item: this.editedItem }, cancelable: true }));
    if (evt) {
      if (this.items && this.items.indexOf(this.editedItem) >= 0) {
        this.items.splice(this.items.indexOf(this.editedItem), 1);
      }
      this._grid.clearCache();
      this.__closeEditor();
    }
  }

  /**
   * Utility method for setting nested values in JSON objects but initializing empty keys unless `Polymer.Base.set`
   * @private
   */
  __set(path, val, obj) {
    if (obj && path) {
      path
        .split('.')
        .slice(0, -1)
        .reduce((o, p) => (o[p] = o[p] || {}), obj);
      this.set(path, val, obj);
    }
  }

  /**
   * Fired when user wants to edit an existing item. If the default is prevented, then
   * a new item is not assigned to the form, giving that responsibility to the app, though
   * dialog is always opened.
   *
   * @event edit
   * @param {Object} detail.item the item to edit
   */

  /**
   * Fired when user wants to create a new item.
   *
   * @event new
   */

  /**
   * Fired when user wants to delete item. If the default is prevented, then
   * no action is performed, items array is not modified nor dialog closed
   *
   * @event delete
   * @param {Object} detail.item the item to delete
   */

  /**
   * Fired when user discards edition. If the default is prevented, then
   * no action is performed, user is responsible to close dialog and reset
   * item and grid.
   *
   * @event cancel
   * @param {Object} detail.item the item to delete
   */

  /**
   * Fired when user wants to save a new or an existing item. If the default is prevented, then
   * no action is performed, items array is not modified nor dialog closed
   *
   * @event save
   * @param {Object} detail.item the item to save
   * @param {Object} detail.new whether the item is a new one
   */
}

customElements.define(Crud.is, Crud);

export { Crud };
