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
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { FocusRestorationController } from '@vaadin/a11y-base/src/focus-restoration-controller.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { ButtonSlotController, FormSlotController, GridSlotController } from './vaadin-crud-controllers.js';
import { getProperty, isValidEditorPosition, setProperty } from './vaadin-crud-helpers.js';

const DEFAULT_I18N = {
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
        dismiss: 'Cancel',
      },
    },
    cancel: {
      title: 'Discard changes',
      content: 'There are unsaved changes to this item.',
      button: {
        confirm: 'Discard',
        dismiss: 'Cancel',
      },
    },
  },
};

/**
 * A mixin providing common crud functionality.
 *
 * @polymerMixin
 * @mixes I18nMixin
 */
export const CrudMixin = (superClass) =>
  class extends I18nMixin(DEFAULT_I18N, superClass) {
    static get properties() {
      return {
        /**
         * A reference to the grid used for displaying the item list
         * @private
         */
        _grid: {
          type: Object,
          observer: '__gridChanged',
        },

        /**
         * A reference to the editor component which will be teleported to the dialog
         * @private
         */
        _form: {
          type: Object,
          observer: '__formChanged',
        },

        /**
         * A reference to the save button which will be teleported to the dialog
         * @private
         */
        _saveButton: {
          type: Object,
        },

        /**
         * A reference to the delete button which will be teleported to the dialog
         * @private
         */
        _deleteButton: {
          type: Object,
        },

        /**
         * A reference to the cancel button which will be teleported to the dialog
         * @private
         */
        _cancelButton: {
          type: Object,
        },

        /**
         * A reference to the default editor header element created by the CRUD
         * @private
         */
        _defaultHeader: {
          type: Object,
        },

        /**
         * A reference to the "New item" button
         * @private
         */
        _newButton: {
          type: Object,
        },

        /**
         * An array containing the items which will be stamped to the column template instances.
         * @type {Array<unknown> | undefined}
         */
        items: {
          type: Array,
          notify: true,
          observer: '__itemsChanged',
        },

        /**
         * The item being edited in the dialog.
         * @type {unknown}
         */
        editedItem: {
          type: Object,
          observer: '__editedItemChanged',
          notify: true,
          sync: true,
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
          observer: '__editorPositionChanged',
          sync: true,
        },

        /**
         * Enables user to click on row to edit it.
         * Note: When enabled, auto-generated grid won't show the edit column.
         * @attr {boolean} edit-on-click
         * @type {boolean}
         */
        editOnClick: {
          type: Boolean,
          value: false,
          sync: true,
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
          observer: '__dataProviderChanged',
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
          reflectToAttribute: true,
          notify: true,
          observer: '__editorOpenedChanged',
          sync: true,
        },

        /**
         * Number of items in the data set which is reported by the grid.
         * Typically it reflects the number of filtered items displayed in the grid.
         *
         * Note: As with `<vaadin-grid>`, this property updates automatically only
         * if `items` is used for data.
         */
        size: {
          type: Number,
          readOnly: true,
          notify: true,
        },

        /**
         * Controls visibility state of toolbar.
         * When set to false toolbar is hidden and shown when set to true.
         * @attr {boolean} no-toolbar
         */
        noToolbar: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /** @private */
        __dialogAriaLabel: String,

        /** @private */
        __isDirty: {
          type: Boolean,
          sync: true,
        },

        /** @private */
        __isNew: Boolean,

        /**
         * @type {boolean}
         * @protected
         */
        _fullscreen: {
          type: Boolean,
          observer: '__fullscreenChanged',
          sync: true,
        },

        /**
         * @type {string}
         * @protected
         */
        _fullscreenMediaQuery: {
          value: '(max-width: 600px), (max-height: 600px)',
        },
      };
    }

    static get observers() {
      return [
        '__headerPropsChanged(_defaultHeader, __isNew, __effectiveI18n)',
        '__formPropsChanged(_form, _theme, include, exclude)',
        '__gridPropsChanged(_grid, _theme, include, exclude, noFilter, noHead, noSort, items)',
        '__i18nChanged(__effectiveI18n, _grid)',
        '__editOnClickChanged(editOnClick, _grid)',
        '__saveButtonPropsChanged(_saveButton, __effectiveI18n, __isDirty)',
        '__cancelButtonPropsChanged(_cancelButton, __effectiveI18n)',
        '__deleteButtonPropsChanged(_deleteButton, __effectiveI18n, __isNew)',
        '__newButtonPropsChanged(_newButton, __effectiveI18n)',
      ];
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
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
     * @return {!CrudI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    constructor() {
      super();

      this.__cancel = this.__cancel.bind(this);
      this.__delete = this.__delete.bind(this);
      this.__save = this.__save.bind(this);
      this.__new = this.__new.bind(this);
      this.__onFormChange = this.__onFormChange.bind(this);
      this.__onGridEdit = this.__onGridEdit.bind(this);
      this.__onGridSizeChanged = this.__onGridSizeChanged.bind(this);
      this.__onGridActiveItemChanged = this.__onGridActiveItemChanged.bind(this);

      this.__focusRestorationController = new FocusRestorationController();
    }

    /** @protected */
    get _headerNode() {
      return this._headerController && this._headerController.node;
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

    /** @protected */
    ready() {
      super.ready();

      this.$.dialog.$.overlay.addEventListener('vaadin-overlay-outside-click', this.__cancel);
      this.$.dialog.$.overlay.addEventListener('vaadin-overlay-escape-press', this.__cancel);

      this._headerController = new SlotController(this, 'header', 'h3', {
        initializer: (node) => {
          this._defaultHeader = node;
        },
      });
      this.addController(this._headerController);

      this._gridController = new GridSlotController(this);
      this.addController(this._gridController);

      this.addController(new FormSlotController(this));

      // Init controllers in `ready()` (not constructor) so that Flow can set `_noDefaultButtons`
      this._newButtonController = new ButtonSlotController(this, 'new', 'primary', this._noDefaultButtons);
      this._saveButtonController = new ButtonSlotController(this, 'save', 'primary', this._noDefaultButtons);
      this._cancelButtonController = new ButtonSlotController(this, 'cancel', 'tertiary', this._noDefaultButtons);
      this._deleteButtonController = new ButtonSlotController(this, 'delete', 'tertiary error', this._noDefaultButtons);

      this.addController(this._newButtonController);

      // NOTE: order in which buttons are added should match the order of slots in template
      this.addController(this._saveButtonController);
      this.addController(this._cancelButtonController);
      this.addController(this._deleteButtonController);

      this.addController(
        new MediaQueryController(this._fullscreenMediaQuery, (matches) => {
          this._fullscreen = matches;
        }),
      );

      this.addController(this.__focusRestorationController);
    }

    /**
     * @param {boolean} isDirty
     * @private
     */
    __isSaveBtnDisabled(isDirty) {
      // Used instead of isDirty property binding in order to enable overriding of the behavior
      // by overriding the method (i.e. from Flow component)
      return !isDirty;
    }

    /**
     * @param {HTMLElement | undefined} headerNode
     * @param {boolean} isNew
     * @param {CrudI18n} effectiveI18n
     * @private
     */
    __headerPropsChanged(headerNode, isNew, effectiveI18n) {
      if (headerNode) {
        headerNode.textContent = isNew ? effectiveI18n.newItem : effectiveI18n.editItem;
      }
    }

    /**
     * @param {CrudI18n} effectiveI18n
     * @param {CrudGrid | Grid} grid
     * @private
     */
    __i18nChanged(effectiveI18n, grid) {
      if (!grid) {
        return;
      }

      afterNextRender(grid, () => {
        Array.from(grid.querySelectorAll('vaadin-crud-edit-column')).forEach((column) => {
          column.ariaLabel = effectiveI18n.editLabel;
        });
      });
    }

    /** @private */
    __editorPositionChanged(editorPosition) {
      if (isValidEditorPosition(editorPosition)) {
        return;
      }
      this.editorPosition = '';
    }

    /** @private */
    __editorOpenedChanged(opened, oldOpened) {
      if (!opened && oldOpened) {
        this.__closeEditor();
      } else {
        this.__formChanged(this._form);
      }

      if (opened) {
        this.__ensureChildren();

        // When using bottom / aside editor position,
        // auto-focus the editor element on open.
        if (this._form.parentElement === this) {
          this.$.editor.setAttribute('tabindex', '0');
          this.$.editor.focus();
        } else {
          this.$.editor.removeAttribute('tabindex');
        }
      }

      this.__toggleToolbar();

      // Make sure to reset scroll position
      this.$.scroller.scrollTop = 0;
    }

    /** @private */
    __fullscreenChanged(fullscreen, oldFullscreen) {
      if (fullscreen || oldFullscreen) {
        this.__toggleToolbar();

        this.__ensureChildren();

        this.toggleAttribute('fullscreen', fullscreen);
      }
    }

    /** @private */
    __toggleToolbar() {
      // Hide toolbar to give more room for the editor when it's positioned below the grid
      if (this.editorPosition === 'bottom' && !this._fullscreen) {
        this.$.toolbar.style.display = this.editorOpened ? 'none' : '';
      }
    }

    /** @private */
    __moveChildNodes(target) {
      const nodes = [this._headerNode, this._form];
      const buttons = [this._saveButton, this._cancelButton, this._deleteButton].filter(Boolean);
      if (!nodes.every((node) => node instanceof HTMLElement)) {
        return;
      }

      // Teleport header node, form, and the buttons to corresponding slots.
      // NOTE: order in which buttons are moved matches the order of slots.
      [...nodes, ...buttons].forEach((node) => {
        target.appendChild(node);
      });

      // Wait to set label until slotted element has been moved.
      setTimeout(() => {
        this.__dialogAriaLabel = this._headerNode.textContent.trim();
      });
    }

    /** @private */
    __shouldOpenDialog(fullscreen, editorPosition) {
      return editorPosition === '' || fullscreen;
    }

    /** @private */
    __ensureChildren() {
      if (this.__shouldOpenDialog(this._fullscreen, this.editorPosition)) {
        // Move form to dialog
        this.__moveChildNodes(this.$.dialog.$.overlay);
      } else {
        // Move form to crud
        this.__moveChildNodes(this);
      }
    }

    /** @private */
    __computeDialogOpened(opened, fullscreen, editorPosition) {
      // Only open dialog when editorPosition is "" or fullscreen is set
      return this.__shouldOpenDialog(fullscreen, editorPosition) ? opened : false;
    }

    /** @private */
    __computeEditorHidden(opened, fullscreen, editorPosition) {
      // Only show editor when editorPosition is "bottom" or "aside"
      if (['aside', 'bottom'].includes(editorPosition) && !fullscreen) {
        return !opened;
      }

      return true;
    }

    /** @private */
    __onDialogOpened(event) {
      this.editorOpened = event.detail.value;
    }

    /** @private */
    __onGridEdit(event) {
      event.stopPropagation();
      this.__confirmBeforeChangingEditedItem(event.detail.item);
    }

    /** @private */
    __onFormChange() {
      this.__isDirty = true;
    }

    /** @private */
    __onGridSizeChanged() {
      this._setSize(this._grid.size);
    }

    /**
     * @param {CrudGrid | Grid} grid
     * @param {CrudGrid | Grid | undefined} oldGrid
     * @private
     */
    __gridChanged(grid, oldGrid) {
      if (oldGrid) {
        oldGrid.removeEventListener('edit', this.__onGridEdit);
        oldGrid.removeEventListener('size-changed', this.__onGridSizeChanged);
      }
      if (this.dataProvider) {
        this.__dataProviderChanged(this.dataProvider);
      }
      if (this.editedItem) {
        this.__editedItemChanged(this.editedItem);
      }
      grid.addEventListener('edit', this.__onGridEdit);
      grid.addEventListener('size-changed', this.__onGridSizeChanged);
      this.__onGridSizeChanged();
    }

    /**
     * @param {HTMLElement | undefined | null} form
     * @param {HTMLElement | undefined | null} oldForm
     * @private
     */
    __formChanged(form, oldForm) {
      if (oldForm && oldForm.parentElement) {
        oldForm.parentElement.removeChild(oldForm);
        oldForm.removeEventListener('change', this.__onFormChange);
        oldForm.removeEventListener('input', this.__onFormChange);
      }
      if (!form) {
        return;
      }
      if (this.items) {
        this.__itemsChanged(this.items);
      }
      if (this.editedItem) {
        this.__editedItemChanged(this.editedItem);
      }
      form.addEventListener('change', this.__onFormChange);
      form.addEventListener('input', this.__onFormChange);
    }

    /**
     * @param {HTMLElement | undefined} form
     * @param {string} theme
     * @param {string | string[] | undefined} include
     * @param {string | RegExp} exclude
     * @private
     */
    __formPropsChanged(form, theme, include, exclude) {
      if (form) {
        form.include = include;
        form.exclude = exclude;

        if (theme) {
          form.setAttribute('theme', theme);
        } else {
          form.removeAttribute('theme');
        }
      }
    }

    /**
     * @param {HTMLElement | undefined} grid
     * @param {string} theme
     * @param {string | string[] | undefined} include
     * @param {string | RegExp} exclude
     * @param {boolean} noFilter
     * @param {boolean} noHead
     * @param {boolean} noSort
     * @param {Array<unknown> | undefined} items
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/max-params
    __gridPropsChanged(grid, theme, include, exclude, noFilter, noHead, noSort, items) {
      if (!grid) {
        return;
      }

      if (grid === this._gridController.defaultNode) {
        grid.noFilter = noFilter;
        grid.noHead = noHead;
        grid.noSort = noSort;
        grid.include = include;
        grid.exclude = exclude;

        if (theme) {
          grid.setAttribute('theme', theme);
        } else {
          grid.removeAttribute('theme');
        }
      }

      grid.items = items;
    }

    /**
     * @param {HTMLElement | undefined} saveButton
     * @param {CrudI18n} effectiveI18n
     * @param {boolean} isDirty
     * @private
     */
    __saveButtonPropsChanged(saveButton, effectiveI18n, isDirty) {
      if (saveButton) {
        saveButton.toggleAttribute('disabled', this.__isSaveBtnDisabled(isDirty));

        if (saveButton === this._saveButtonController.defaultNode) {
          saveButton.textContent = effectiveI18n.saveItem;
        }
      }
    }

    /**
     * @param {HTMLElement | undefined} deleteButton
     * @param {CrudI18n} effectiveI18n
     * @param {boolean} isNew
     * @private
     */
    __deleteButtonPropsChanged(deleteButton, effectiveI18n, isNew) {
      if (deleteButton) {
        deleteButton.toggleAttribute('hidden', isNew);

        if (deleteButton === this._deleteButtonController.defaultNode) {
          deleteButton.textContent = effectiveI18n.deleteItem;
        }
      }
    }

    /**
     * @param {HTMLElement | undefined} cancelButton
     * @param {CrudI18n} effectiveI18n
     * @private
     */
    __cancelButtonPropsChanged(cancelButton, effectiveI18n) {
      if (cancelButton && cancelButton === this._cancelButtonController.defaultNode) {
        cancelButton.textContent = effectiveI18n.cancel;
      }
    }

    /**
     * @param {HTMLElement | undefined} newButton
     * @param {CrudI18n} effectiveI18n
     * @private
     */
    __newButtonPropsChanged(newButton, effectiveI18n) {
      if (newButton && newButton === this._newButtonController.defaultNode) {
        newButton.textContent = effectiveI18n.newItem;
      }
    }

    /** @private */
    __dataProviderChanged(dataProvider) {
      if (this._grid) {
        this._grid.dataProvider = this.__createDataProviderProxy(dataProvider);
      }
    }

    /** @private */
    __editOnClickChanged(editOnClick, grid) {
      if (!grid) {
        return;
      }

      grid.hideEditColumn = editOnClick;

      if (editOnClick) {
        grid.addEventListener('active-item-changed', this.__onGridActiveItemChanged);
      } else {
        grid.removeEventListener('active-item-changed', this.__onGridActiveItemChanged);
      }
    }

    /** @private */
    __onGridActiveItemChanged(event) {
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
        this.addEventListener(
          'cancel',
          (event) => {
            event.preventDefault(); // Prevent closing the editor
            if (item || keepOpened) {
              this.__edit(item);
              this.__clearItemAndKeepEditorOpened(item, keepOpened);
            } else {
              this.__closeEditor();
            }
          },
          { once: true },
        );
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
    __itemsChanged(items) {
      if (this.items && this.items[0]) {
        this.__model = items[0];
      }
    }

    /** @private */
    __editedItemChanged(item) {
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
                'Either specify `include` or ensure at least one item is available beforehand.',
            );
          }
        }
        this._form.item = item;
        this._fields.forEach((e) => {
          const path = e.path || e.getAttribute('path');
          if (path) {
            e.value = getProperty(path, item);
          }
        });

        this.__isNew = !!(this.__isNew || (this.items && this.items.indexOf(item) < 0));
        this.editorOpened = true;
      }
    }

    /** @private */
    __validate() {
      return this._fields.every((e) => (e.validate || e.checkValidity).call(e));
    }

    /** @private */
    __setHighlightedItem(item) {
      if (this._grid === this._gridController.defaultNode) {
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
    __new() {
      this.__confirmBeforeChangingEditedItem(null, true);
    }

    /** @private */
    __edit(item) {
      if (this.editedItem === item) {
        return;
      }
      this.__setHighlightedItem(item);
      this.__openEditor(item);
    }

    /** @private */
    __fireEvent(type, item) {
      const event = new CustomEvent(type, { detail: { item }, cancelable: true });
      this.dispatchEvent(event);
      return event.defaultPrevented === false;
    }

    /** @private */
    __openEditor(item) {
      this.__focusRestorationController.saveFocus();

      this.__isDirty = false;
      this.__isNew = !item;
      const result = this.__fireEvent(this.__isNew ? 'new' : 'edit', item);
      if (result) {
        this.editedItem = item || {};
      } else {
        this.editorOpened = true;
      }
    }

    /** @private */
    __restoreFocusOnDelete() {
      if (this._grid._flatSize === 1) {
        this._newButton.focus();
      } else {
        this._grid._focusFirstVisibleRow();
      }
    }

    /** @private */
    __restoreFocusOnSaveOrCancel() {
      const focusNode = this.__focusRestorationController.focusNode;
      const row = this._grid._getRowContainingNode(focusNode);
      if (!row) {
        this.__focusRestorationController.restoreFocus();
        return;
      }

      if (this._grid._isItemAssignedToRow(this.editedItem, row) && this._grid._isInViewport(row)) {
        this.__focusRestorationController.restoreFocus();
      } else {
        this._grid._focusFirstVisibleRow();
      }
    }

    /** @private */
    __save() {
      if (!this.__validate()) {
        return;
      }

      const item = { ...this.editedItem };
      this._fields.forEach((e) => {
        const path = e.path || e.getAttribute('path');
        if (path) {
          setProperty(path, e.value, item);
        }
      });
      const result = this.__fireEvent('save', item);
      if (result) {
        if (this.__isNew && !this.dataProvider) {
          if (!this.items) {
            this.items = [item];
          } else {
            this.items.push(item);
          }
        } else {
          if (!this.editedItem) {
            this.editedItem = {};
          }
          Object.assign(this.editedItem, item);
        }

        this.__restoreFocusOnSaveOrCancel();
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
      const result = this.__fireEvent('cancel', this.editedItem);
      if (result) {
        this.__restoreFocusOnSaveOrCancel();
        this.__closeEditor();
      }
    }

    /** @private */
    __delete() {
      this.$.confirmDelete.opened = true;
    }

    /** @private */
    __confirmDelete() {
      const result = this.__fireEvent('delete', this.editedItem);
      if (result) {
        if (this.items && this.items.indexOf(this.editedItem) >= 0) {
          this.items.splice(this.items.indexOf(this.editedItem), 1);
        }

        this.__restoreFocusOnDelete();
        this._grid.clearCache();
        this.__closeEditor();
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
  };
