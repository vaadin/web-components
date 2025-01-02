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
import { capitalize, getProperty } from './vaadin-crud-helpers.js';
import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * A mixin providing common crud-grid functionality.
 *
 * @polymerMixin
 * @mixes IncludedMixin
 */
export const CrudGridMixin = (superClass) =>
  class extends IncludedMixin(superClass) {
    static get properties() {
      return {
        /**
         * Disable filtering in the generated columns.
         * @attr {boolean} no-filter
         */
        noFilter: Boolean,

        /**
         * Disable sorting in the generated columns.
         * @attr {boolean} no-sort
         */
        noSort: Boolean,

        /**
         * Do not add headers to columns.
         * @attr {boolean} no-head
         */
        noHead: Boolean,

        /**
         * Determines whether the edit column should be hidden.
         * @attr {boolean} hide-edit-column
         */
        hideEditColumn: {
          type: Boolean,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__onItemsChange(items)', '__onHideEditColumnChange(hideEditColumn)'];
    }

    /** @private */
    __onItemsChange(items) {
      if ((!this.dataProvider || this.dataProvider === this._arrayDataProvider) && !this.include && items && items[0]) {
        this._configure(items[0]);
      }
    }

    /** @private */
    __onHideEditColumnChange() {
      if (this.firstChild) {
        this.__toggleEditColumn();
      }
    }

    /** @private */
    __toggleEditColumn() {
      let editColumn = this.querySelector('vaadin-crud-edit-column');
      if (this.hideEditColumn) {
        if (editColumn) {
          this.removeChild(editColumn);
        }
      } else if (!editColumn) {
        editColumn = document.createElement('vaadin-crud-edit-column');
        editColumn.frozenToEnd = true;
        this.appendChild(editColumn);
      }
    }

    /** @private */
    __dataProviderWrapper(params, callback) {
      this.__dataProvider(params, (items, size) => {
        if (this.innerHTML === '' && !this.include && items[0]) {
          this._configure(items[0]);
        }
        callback(items, size);
      });
    }

    /**
     * @override
     * @private
     */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      if (this._arrayDataProvider === dataProvider) {
        super._dataProviderChanged(dataProvider, oldDataProvider);
      } else if (this.__dataProviderWrapper !== dataProvider) {
        this.innerHTML = '';
        this.__dataProvider = dataProvider;
        this.dataProvider = this.__dataProviderWrapper;
        super._dataProviderChanged(this.__dataProviderWrapper, oldDataProvider);
      }
    }

    /**
     * Auto-generate grid columns based on the JSON structure of the object provided.
     *
     * Method will be executed when items or dataProvider is assigned.
     * @private
     */
    _configure(item) {
      this.innerHTML = '';
      this.__createColumns(this, item, undefined, this.__getPropertyDepth(item));
      this.__toggleEditColumn();
    }

    /**
     * Return the deepest property depth of the object
     * @private
     */
    __getPropertyDepth(object) {
      if (!object || typeof object !== 'object') {
        return 0;
      }

      return Object.keys(object).reduce((deepest, prop) => {
        if (this.exclude && this.exclude.test(prop)) {
          return deepest;
        }
        return Math.max(deepest, 1 + this.__getPropertyDepth(object[prop]));
      }, 0);
    }

    /**
     * Parse the camelCase column names into sentence case headers.
     * @param {string} path
     * @return {string}
     * @protected
     */
    _generateHeader(path) {
      return path
        .substr(path.lastIndexOf('.') + 1)
        .replace(/([A-Z])/gu, '-$1')
        .toLowerCase()
        .replace(/-/gu, ' ')
        .replace(/^./u, (match) => match.toUpperCase());
    }

    /** @private */
    __createColumn(parent, path) {
      let col;
      if (!this.noFilter && !this.noSort && !parent.__sortColumnGroup) {
        // This crud-grid has both a sorter and a filter, but neither has yet been
        // created => col should become the sorter group column
        col = this.__createGroup(parent);
        col.__sortColumnGroup = true;
        // Create the filter column under this sorter group column
        this.__createColumn(col, path);
      } else {
        // In all other cases, col should be a regular column with a renderer
        col = document.createElement('vaadin-grid-column');
        parent.appendChild(col);
        col.renderer = (root, _column, model) => {
          root.textContent = path ? getProperty(path, model.item) : model.item;
        };
      }

      if (!this.noHead && path) {
        // Create a header renderer for the column (or column group)
        col.headerRenderer = (root) => {
          if (root.firstElementChild) {
            return;
          }

          const label = this._generateHeader(path);

          if (col.__sortColumnGroup || (this.noFilter && !this.noSort)) {
            // The column is either the sorter group column or the root level
            // sort column (in case a filter isn't used at all) => add the sort indicator
            const sorter = document.createElement('vaadin-grid-sorter');
            sorter.setAttribute('path', path);
            // TODO: Localize aria labels
            sorter.setAttribute('aria-label', `Sort by ${label}`);
            sorter.textContent = label;
            root.appendChild(sorter);
          } else if (!this.noFilter) {
            // Filtering is enabled in this crud-grid, create the filter element
            const filter = document.createElement('vaadin-grid-filter');
            filter.setAttribute('path', path);
            // TODO: Localize aria labels
            filter.setAttribute('aria-label', `Filter by ${label}`);
            filter.style.display = 'flex';

            const textField = window.document.createElement('vaadin-text-field');
            textField.setAttribute('theme', 'small');
            textField.setAttribute('focus-target', true);
            textField.style.width = '100%';
            if (this.noSort) {
              textField.placeholder = label;
            }
            textField.addEventListener('value-changed', (event) => {
              filter.value = event.detail.value;
            });

            filter.appendChild(textField);
            root.appendChild(filter);
          } else if (this.noSort && this.noFilter) {
            // Neither sorter nor filter are enabled, just add the label
            root.textContent = label;
          }
        };
      }
    }

    /**
     * Creates the column structure for the (sub)object.
     *
     * @param {HTMLElement} parent May be the crud-grid or a column group.
     * @param {Object} object The object to create the sub-columns for.
     * @param {string} path The property path from the root item to the object.
     * @param {number} depth The depth of the object in the object hierarchy.
     * @private
     */
    __createColumns(parent, object, path, depth) {
      if (object && typeof object === 'object') {
        // Iterate over the object properties
        Object.keys(object).forEach((prop) => {
          if (!this.include && this.exclude && this.exclude.test(prop)) {
            return;
          }
          // Sub-object of the current object
          const subObject = object[prop];
          // Full path to the sub-object
          const subObjectPath = path ? `${path}.${prop}` : prop;

          // The column element for the sub-object
          let subObjectColumn = parent;
          if (!this.noHead && depth > 1) {
            const isSubObject = subObject && typeof subObject === 'object';
            // If the sub-object is an actual object, create a column group with the property
            // name as the header text, otherwise create a group without a header
            subObjectColumn = this.__createGroup(parent, isSubObject ? prop : undefined);
          }

          // Run recursively for the sub-object level
          this.__createColumns(subObjectColumn, subObject, subObjectPath, depth - 1);
        });
      } else if (depth > 1) {
        // The object has been fully traversed, but empty wrapping column
        // groups are still needed to complete the full object depth
        this.__createColumns(this.__createGroup(parent), undefined, path, depth - 1);
      } else {
        // The column group depth is complete, create the actual leaf column
        this.__createColumn(parent, path);
      }
    }

    /** @private */
    __createGroup(parent, header) {
      const grp = document.createElement('vaadin-grid-column-group');
      if (header) {
        grp.header = capitalize(header);
      }
      parent.appendChild(grp);
      return grp;
    }
  };
