/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/grid/src/vaadin-grid-column.js';
import '@vaadin/grid/src/vaadin-grid-column-group.js';
import '@vaadin/grid/src/vaadin-grid-sorter.js';
import '@vaadin/grid/src/vaadin-grid-filter.js';
import './vaadin-crud-edit-column.js';
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';
import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends Grid
 * @mixes IncludedMixin
 * @private
 */
class CrudGrid extends IncludedMixin(Grid) {
  static get is() {
    return 'vaadin-crud-grid';
  }

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

      /** @private */
      __hideEditColumn: Boolean
    };
  }

  static get observers() {
    return ['__onItemsChange(items)', '__onHideEditColumnChange(hideEditColumn)'];
  }

  /** @private */
  __onItemsChange(items) {
    if ((!this.dataProvider || this.dataProvider == this._arrayDataProvider) && !this.include && items && items[0]) {
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
    const el = this.querySelector('vaadin-crud-edit-column');
    if (this.hideEditColumn) {
      el && this.removeChild(el);
    } else if (!el) {
      this.appendChild(document.createElement('vaadin-crud-edit-column'));
    }
  }

  /** @private */
  __dataProviderWrapper(params, callback) {
    this.__dataProvider(params, (items, size) => {
      if (this.innerHTML == '' && !this.include && items[0]) {
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
    if (this._arrayDataProvider == dataProvider) {
      super._dataProviderChanged(dataProvider, oldDataProvider);
    } else if (this.__dataProviderWrapper != dataProvider) {
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
    this.__createColumns(this, item);
    this.__toggleEditColumn();
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
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/-/g, ' ')
      .replace(/^./, (match) => match.toUpperCase());
  }

  /** @private */
  __createColumn(parent, path) {
    const col = document.createElement('vaadin-grid-column');

    col.renderer = (root, column, model) => {
      root.textContent = path ? this.get(path, model.item) : model.item;
    };

    if (!this.noHead && path) {
      col.headerRenderer = (root) => {
        const label = this._generateHeader(path);

        if (!this.noSort) {
          const sorter = window.document.createElement('vaadin-grid-sorter');
          sorter.setAttribute('path', path);
          sorter.textContent = label;
          root.appendChild(sorter);
        }

        if (!this.noFilter) {
          const filter = window.document.createElement('vaadin-grid-filter');
          filter.setAttribute('path', path);
          filter.style.display = 'flex';

          const textField = window.document.createElement('vaadin-text-field');
          textField.setAttribute('theme', 'small');
          textField.setAttribute('slot', 'filter');
          textField.setAttribute('focus-target', true);
          textField.style.width = '100%';
          this.noSort && (textField.placeholder = label);
          textField.addEventListener('value-changed', function (event) {
            filter.value = event.detail.value;
          });

          filter.appendChild(textField);
          root.appendChild(filter);
        }

        if (this.noSort && this.noFilter) {
          root.textContent = label;
        }
      };
    }

    parent.appendChild(col);
    return col;
  }

  /** @private */
  __createColumns(parent, object, path) {
    if (typeof object === 'object') {
      Object.keys(object).forEach((prop) => {
        if (!this.include && this.exclude && this.exclude.test(prop)) {
          return;
        }
        const newPath = (path ? `${path}.` : '') + prop;
        if (object[prop] && typeof object[prop] === 'object') {
          const group = this.noHead ? parent : this.__createGroup(parent, newPath, object[prop]);
          this.__createColumns(group, object[prop], newPath);
        } else {
          this.__createColumn(parent, newPath);
        }
      });
    } else {
      this.__createColumn(parent, '');
    }
  }

  /** @private */
  __createGroup(parent, path) {
    const grp = document.createElement('vaadin-grid-column-group');
    grp.headerRenderer = (root) => (root.textContent = this.__capitalize(path.replace(/^.*\./, '')));
    parent.appendChild(grp);
    return grp;
  }

  /** @private */
  __capitalize(path) {
    return path
      .toLowerCase()
      .replace(/([^\w]+)/g, ' ')
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
  }

  /** @private */
  __set(path, val, obj) {
    if (obj && path) {
      path
        .split('.')
        .slice(0, -1)
        .reduce((o, p) => (o[p] = o[p] || {}), obj);
      this.set(path, val, obj);
    }
  }
}

customElements.define(CrudGrid.is, CrudGrid);

export { CrudGrid };
