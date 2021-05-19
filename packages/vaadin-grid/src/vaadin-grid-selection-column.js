/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { GridColumnElement } from './vaadin-grid-column.js';
import '@vaadin/vaadin-checkbox/src/vaadin-checkbox.js';

/**
 * `<vaadin-grid-selection-column>` is a helper element for the `<vaadin-grid>`
 * that provides default templates and functionality for item selection.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-selection-column frozen auto-select></vaadin-grid-selection-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * By default the selection column displays `<vaadin-checkbox>` elements in the
 * column cells. The checkboxes in the body rows toggle selection of the corresponding row items.
 *
 * When the grid data is provided as an array of [`items`](#/elements/vaadin-grid#property-items),
 * the column header gets an additional checkbox that can be used for toggling
 * selection for all the items at once.
 *
 * __The default content can also be overridden__
 *
 * @fires {CustomEvent} select-all-changed - Fired when the `selectAll` property changes.
 */
class GridSelectionColumnElement extends GridColumnElement {
  static get template() {
    return html`
      <template class="header" id="defaultHeaderTemplate">
        <vaadin-checkbox
          class="vaadin-grid-select-all-checkbox"
          aria-label="Select All"
          hidden$="[[__selectAllHidden]]"
          on-checked-changed="__onSelectAllCheckedChanged"
          checked="[[__isChecked(selectAll, __indeterminate)]]"
          indeterminate="[[__indeterminate]]"
        ></vaadin-checkbox>
      </template>
      <template id="defaultBodyTemplate">
        <vaadin-checkbox aria-label="Select Row" checked="{{selected}}"></vaadin-checkbox>
      </template>
    `;
  }

  static get is() {
    return 'vaadin-grid-selection-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: '58px'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 0
      },

      /**
       * When true, all the items are selected.
       * @attr {boolean} select-all
       * @type {boolean}
       */
      selectAll: {
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * When true, the active gets automatically selected.
       * @attr {boolean} auto-select
       * @type {boolean}
       */
      autoSelect: {
        type: Boolean,
        value: false
      },

      /** @private */
      __indeterminate: Boolean,

      /**
       * The previous state of activeItem. When activeItem turns to `null`,
       * previousActiveItem will have an Object with just unselected activeItem
       * @private
       */
      __previousActiveItem: Object,

      /** @private */
      __selectAllHidden: Boolean
    };
  }

  static get observers() {
    return [
      '__onSelectAllChanged(selectAll)',
      '__onDefaultHeaderRendererBindingChanged(__indeterminate, __selectAllHidden, selectAll)'
    ];
  }

  constructor() {
    super();

    this.__defaultHeaderRenderer = (root, _column) => {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select All');
        checkbox.classList.add('vaadin-grid-select-all-checkbox');
        checkbox.addEventListener('checked-changed', this.__onSelectAllCheckedChanged.bind(this));
        root.appendChild(checkbox);
      }

      const checked = this.__isChecked(this.selectAll, this.__indeterminate);
      checkbox.__rendererChecked = checked;
      checkbox.checked = checked;

      checkbox.indeterminate = this.__indeterminate;

      if (this.__selectAllHidden) {
        checkbox.setAttribute('hidden', 'hidden');
      } else {
        checkbox.removeAttribute('hidden');
      }
    };

    this.__defaultRenderer = (root, _column, { item, selected }) => {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select Row');
        checkbox.addEventListener('checked-changed', this.__onSelectRowCheckedChanged.bind(this));
        root.appendChild(checkbox);
      }

      checkbox.__rendererChecked = selected;
      checkbox.checked = selected;

      checkbox.__item = item;
    };

    this._boundOnActiveItemChanged = this.__onActiveItemChanged.bind(this);
    this._boundOnDataProviderChanged = this.__onDataProviderChanged.bind(this);
    this._boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
  }

  /** @protected */
  disconnectedCallback() {
    this._grid.removeEventListener('active-item-changed', this._boundOnActiveItemChanged);
    this._grid.removeEventListener('data-provider-changed', this._boundOnDataProviderChanged);
    this._grid.removeEventListener('filter-changed', this._boundOnSelectedItemsChanged);
    this._grid.removeEventListener('selected-items-changed', this._boundOnSelectedItemsChanged);

    super.disconnectedCallback();
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    if (this._grid) {
      this._grid.addEventListener('active-item-changed', this._boundOnActiveItemChanged);
      this._grid.addEventListener('data-provider-changed', this._boundOnDataProviderChanged);
      this._grid.addEventListener('filter-changed', this._boundOnSelectedItemsChanged);
      this._grid.addEventListener('selected-items-changed', this._boundOnSelectedItemsChanged);
    }
  }

  // /** @private */
  // _prepareHeaderTemplate() {
  //   const headerTemplate = this._prepareTemplatizer(this._findTemplate(true) || this.$.defaultHeaderTemplate);
  //   // needed to override the dataHost correctly in case internal template is used.
  //   headerTemplate.templatizer.dataHost = headerTemplate === this.$.defaultHeaderTemplate ? this : this.dataHost;

  //   return headerTemplate;
  // }

  // /** @private */
  // _prepareBodyTemplate() {
  //   const template = this._prepareTemplatizer(this._findTemplate() || this.$.defaultBodyTemplate);
  //   // needed to override the dataHost correctly in case internal template is used.
  //   template.templatizer.dataHost = template === this.$.defaultBodyTemplate ? this : this.dataHost;

  //   return template;
  // }

  /** @private */
  __onDefaultHeaderRendererBindingChanged() {
    if (!this._headerCell) {
      return;
    }

    if (this.__headerRenderer !== this.__defaultHeaderRenderer) {
      return;
    }

    this.__runRenderer(this.__headerRenderer, this._headerCell);
  }

  /** @private */
  __onSelectAllChanged(selectAll) {
    if (selectAll === undefined || !this._grid) {
      return;
    }

    if (this._selectAllChangeLock) {
      return;
    }

    this._grid.selectedItems = selectAll && Array.isArray(this._grid.items) ? this._grid._filter(this._grid.items) : [];
  }

  /**
   * Return true if array `a` contains all the items in `b`
   * We need this when sorting or to preserve selection after filtering.
   * @private
   */
  __arrayContains(a, b) {
    for (var i = 0; a && b && b[i] && a.indexOf(b[i]) >= 0; i++); // eslint-disable-line
    return i == b.length;
  }

  /**
   * Updates the `selectAll` property after the Select All Rows checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectAllCheckedChanged(e) {
    // Skip if the listener is called after `checked` is set by the renderer.
    if (e.target.checked === e.target.__rendererChecked) {
      return;
    }

    this.selectAll = this.__indeterminate || e.target.checked;
  }

  /**
   * Selects or deselects the row after the Select Row checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectRowCheckedChanged(e) {
    // Skip if the listener is called after `checked` is set by the renderer
    if (e.target.checked === e.target.__rendererChecked) {
      return;
    }

    if (e.target.checked) {
      this._grid.selectItem(e.target.__item);
    } else {
      this._grid.deselectItem(e.target.__item);
    }
  }

  /**
   * iOS needs indeterminated + checked at the same time
   * @private
   */
  __isChecked(selectAll, indeterminate) {
    return indeterminate || selectAll;
  }

  /** @private */
  __onActiveItemChanged(e) {
    const activeItem = e.detail.value;
    if (this.autoSelect) {
      const item = activeItem || this.__previousActiveItem;
      if (item) {
        this._grid._toggleItem(item);
      }
    }
    this.__previousActiveItem = activeItem;
  }

  /** @private */
  __onSelectedItemsChanged() {
    this._selectAllChangeLock = true;
    if (Array.isArray(this._grid.items)) {
      if (!this._grid.selectedItems.length) {
        this.selectAll = false;
        this.__indeterminate = false;
      } else if (this.__arrayContains(this._grid.selectedItems, this._grid._filter(this._grid.items))) {
        this.selectAll = true;
        this.__indeterminate = false;
      } else {
        this.selectAll = false;
        this.__indeterminate = true;
      }
    }
    this._selectAllChangeLock = false;
  }

  /** @private */
  __onDataProviderChanged() {
    this.__selectAllHidden = !Array.isArray(this._grid.items);
  }
}

customElements.define(GridSelectionColumnElement.is, GridSelectionColumnElement);

export { GridSelectionColumnElement };
