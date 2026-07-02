/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * A mixin providing the grid's column toggle: a button in the grid's top
 * (inline-end) corner that opens a menu with one checkbox per hideable leaf
 * column, for showing and hiding columns (a classic "column chooser").
 *
 * The button is only shown while the grid has at least one column with
 * `hideable` set to `true`; with no hideable columns there is nothing to
 * toggle, so the button is hidden automatically.
 *
 * @polymerMixin
 */
export const GridColumnToggleMixin = (superClass) =>
  class GridColumnToggleMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The column toggle menu items derived from the grid's hideable leaf
         * columns. The toggle button is hidden while this is empty.
         * @protected
         */
        _columnToggleItems: {
          type: Array,
          value: () => [],
          sync: true,
        },

        /**
         * Whether the column toggle menu is currently open. Reflected to the
         * toggle button's `aria-expanded` attribute.
         * @protected
         */
        _columnToggleOpened: {
          type: Boolean,
          value: false,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this.__updateColumnToggle();
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // The per-column listeners are removed on disconnect, so re-establish
      // them when the grid is moved back into the DOM.
      this.__updateColumnToggle();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__columnToggleUpdateDebouncer?.cancel();
      if (this.__columnToggleA11yObserver) {
        this.__columnToggleA11yObserver.disconnect();
        this.__columnToggleA11yObserver = undefined;
      }
      if (this.__columnToggleListenedColumns) {
        this.__columnToggleListenedColumns.forEach((column) => {
          column.removeEventListener('hideable-changed', this.__onColumnToggleHideableChanged);
        });
        this.__columnToggleListenedColumns.clear();
      }
    }

    /**
     * Rebuilds the column toggle when the grid's column tree changes (columns
     * added, removed or regrouped).
     * @protected
     * @override
     */
    _columnTreeChanged(columnTree) {
      super._columnTreeChanged(columnTree);
      this.__scheduleColumnToggleUpdate();
    }

    /** @private */
    get __columnToggleMenu() {
      return this.shadowRoot && this.shadowRoot.querySelector('#columnToggle');
    }

    /** @private */
    __scheduleColumnToggleUpdate() {
      this.__columnToggleUpdateDebouncer = Debouncer.debounce(this.__columnToggleUpdateDebouncer, microTask, () => {
        this.__updateColumnToggle();
      });
    }

    /**
     * Rebuilds the menu items from the grid's current columns and keeps the
     * per-column listeners in sync. The items are also rebuilt every time the
     * menu opens, so the labels and checked states are always fresh.
     * @private
     */
    __updateColumnToggle() {
      this.__syncColumnToggleListeners();
      this._columnToggleItems = this.__buildColumnToggleItems();
      this.__syncColumnToggleItemA11y();
    }

    /**
     * Re-renders an already-open menu so the checkbox states reflect the
     * current column visibility. Reassigning `items` alone does not re-render
     * the open overlay, and forcing a re-render while the menu is *opening*
     * breaks the context menu's internal state, so this is only used from the
     * item-selected handler, where the menu is fully open.
     * @private
     */
    __refreshOpenColumnToggleMenu() {
      const menu = this.__columnToggleMenu;
      if (menu && menu.opened) {
        menu.items = this._columnToggleItems;
        menu.requestContentUpdate();
      }
    }

    /**
     * Keeps a `hideable-changed` listener on every leaf column of the grid.
     * The event does not bubble, so the grid listens on each column directly;
     * this catches `hideable` changes made as a property (for example through
     * the Flow `setHideable` API), which must show or hide the toggle button
     * without any other interaction.
     * @private
     */
    __syncColumnToggleListeners() {
      this.__onColumnToggleHideableChanged ||= () => this.__scheduleColumnToggleUpdate();
      this.__columnToggleListenedColumns ||= new Set();
      const columns = new Set(this.__getLeafColumns());
      this.__columnToggleListenedColumns.forEach((column) => {
        if (!columns.has(column)) {
          column.removeEventListener('hideable-changed', this.__onColumnToggleHideableChanged);
          this.__columnToggleListenedColumns.delete(column);
        }
      });
      columns.forEach((column) => {
        if (!this.__columnToggleListenedColumns.has(column)) {
          column.addEventListener('hideable-changed', this.__onColumnToggleHideableChanged);
          this.__columnToggleListenedColumns.add(column);
        }
      });
    }

    /**
     * Returns the grid's leaf columns (the last level of the column tree),
     * including hidden ones so they can be shown again from the menu.
     * @return {!Array<!HTMLElement>}
     * @private
     */
    __getLeafColumns() {
      const tree = this._columnTree;
      if (tree && tree.length) {
        return [...tree[tree.length - 1]];
      }
      return [];
    }

    /**
     * Returns the leaf columns that appear in the menu: the columns explicitly
     * marked as `hideable`. The selection column and column groups are never
     * listed.
     * @return {!Array<!HTMLElement>}
     * @private
     */
    __getColumnToggleColumns() {
      return this.__getLeafColumns().filter(
        (column) =>
          column &&
          column.hideable &&
          column.localName !== 'vaadin-grid-selection-column' &&
          column.localName !== 'vaadin-grid-column-group',
      );
    }

    /** @private */
    __buildColumnToggleItems() {
      return this.__getColumnToggleColumns().map((column, index) => ({
        text: this.__getColumnToggleLabel(column, index),
        checked: !column.hidden,
        keepOpen: true,
        // Reference back to the column and a marker used for a11y and toggling.
        _column: column,
        __isColumnToggleItem: true,
      }));
    }

    /**
     * Computes a label for a column's menu item. Prefers the plain-text
     * `header`, then the text rendered into the header cell (for columns that
     * use a header renderer, including Flow columns), then the column's `path`,
     * and finally a generic label so the item is never blank.
     * @private
     */
    __getColumnToggleLabel(column, index) {
      const { header, path } = column;
      if (typeof header === 'string' && header.trim() !== '') {
        return header;
      }
      const renderedHeader = column._headerCell?._content?.textContent;
      if (typeof renderedHeader === 'string' && renderedHeader.trim() !== '') {
        return renderedHeader.trim();
      }
      if (typeof path === 'string' && path.trim() !== '') {
        return path;
      }
      return `Column ${index + 1}`;
    }

    /** @protected */
    _onColumnToggleItemSelected(event) {
      const item = event.detail.value;
      const column = item && item._column;
      if (!column) {
        return;
      }

      column.hidden = !column.hidden;

      // Recompute checked states and re-render the open menu so its checkboxes
      // reflect the new visibility immediately.
      this.__updateColumnToggle();
      this.__refreshOpenColumnToggleMenu();

      this.dispatchEvent(new CustomEvent('column-visibility-changed', { detail: { column, hidden: column.hidden } }));
    }

    /**
     * Rebuilds the items synchronously before the context menu opens on this
     * click, so the menu renders fresh labels and checked states even for
     * changes made while it was closed. The context menu captures its items
     * when the opening click is handled — reassigning them later does not
     * re-render the overlay, and forcing a re-render while the menu is
     * opening breaks its internal state.
     * @protected
     */
    _onColumnToggleButtonClick() {
      this.__updateColumnToggle();
    }

    /** @protected */
    _onColumnToggleOpenedChanged(event) {
      this._columnToggleOpened = event.detail.value;
      if (this._columnToggleOpened) {
        // Set up the a11y observer synchronously, so it catches the initial
        // item render.
        this.__ensureColumnToggleA11yObserver();
      }
    }

    /**
     * Announces the menu items as checkboxes. `<vaadin-context-menu>` renders
     * `checked` items with a checkmark but does not expose the state to
     * assistive technologies, so mark the column items as `menuitemcheckbox`
     * and keep `aria-checked` in sync with the visible checkmark. The observer
     * is set up synchronously (before the menu content renders) so the initial
     * state is announced on the first open, and it re-applies on every
     * re-render (toggles, column changes).
     * @private
     */
    __ensureColumnToggleA11yObserver() {
      const menu = this.__columnToggleMenu;
      if (!menu || this.__columnToggleA11yObserver) {
        return;
      }
      this.__columnToggleA11yObserver = new MutationObserver(() => this.__syncColumnToggleItemA11y());
      this.__columnToggleA11yObserver.observe(menu, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['menu-item-checked'],
      });
      this.__syncColumnToggleItemA11y();
    }

    /** @private */
    __syncColumnToggleItemA11y() {
      const menu = this.__columnToggleMenu;
      if (!menu) {
        return;
      }
      menu.querySelectorAll('vaadin-context-menu-item').forEach((element) => {
        if (element._item && element._item.__isColumnToggleItem) {
          element.setAttribute('role', 'menuitemcheckbox');
          element.setAttribute('aria-checked', element.hasAttribute('menu-item-checked') ? 'true' : 'false');
        }
      });
    }
  };
