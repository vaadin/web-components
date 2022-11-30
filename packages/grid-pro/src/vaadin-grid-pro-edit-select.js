/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';
import { Select } from '@vaadin/select/src/vaadin-select.js';

/**
 * An element used internally by `<vaadin-grid-pro>`. Not intended to be used separately.
 *
 * @extends Select
 * @private
 */
class GridProEditSelect extends Select {
  static get is() {
    return 'vaadin-grid-pro-edit-select';
  }

  static get properties() {
    return {
      options: {
        type: Array,
        value: () => [],
      },

      _grid: {
        type: Object,
      },

      _initialized: {
        type: Boolean,
      },
    };
  }

  static get observers() {
    return ['_optionsChanged(options)'];
  }

  ready() {
    super.ready();

    this.setAttribute('theme', 'grid-pro-editor');
  }

  _onKeyDown(e) {
    super._onKeyDown(e);

    if (this.options.length === 0 && /^(ArrowDown|Down|ArrowUp|Up|Enter|SpaceBar| )$/.test(e.key)) {
      console.warn('Missing "editorOptions" for <vaadin-grid-pro-edit-column> select editor!');
    }
    // Event handled in select, stop here
    if (e.defaultPrevented) {
      e.stopPropagation();
    }
  }

  /**
   * Override list-box event listener inherited from `Select`:
   * - Enter: set flag for moving to next row on value change,
   * - Tab: switch to next cell when "singleCellEdit" is false.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDownInside(event) {
    if (event.keyCode === 13) {
      this._enterKeydown = event;
    }

    if (event.keyCode === 9) {
      if (!this._grid.singleCellEdit) {
        this._grid._switchEditCell(event);
      }
    }

    // Call `super` to close overlay on Tab.
    super._onKeyDownInside(event);
  }

  _valueChanged(value, oldValue) {
    super._valueChanged(value, oldValue);

    // Select is first created without a value
    if (value === '' && oldValue === undefined) {
      return;
    }
    if (this._initialized) {
      const enter = this._enterKeydown;
      if (enter && this._grid.enterNextRow) {
        this._grid._switchEditCell(enter);
      } else if (this._grid.singleCellEdit) {
        this._grid._stopEdit(false, true);
      } else {
        this.focus();
      }
    }
  }

  _optionsChanged(options) {
    if (options && options.length) {
      this.renderer = (root) => {
        if (root.firstChild) {
          return;
        }
        const listBox = document.createElement('vaadin-list-box');
        listBox.selected = options.indexOf(this.value);
        options.forEach((option) => {
          const item = document.createElement('vaadin-item');
          item.textContent = option;
          listBox.appendChild(item);
        });

        root.appendChild(listBox);
      };

      this._overlayElement.addEventListener('vaadin-overlay-outside-click', () => {
        this._grid._stopEdit();
      });

      // FIXME(web-padawan): _updateValueSlot() in `vaadin-select` resets opened to false
      // see https://github.com/vaadin/vaadin-list-mixin/issues/49
      setTimeout(() => {
        this.opened = true;
        // Any value change after first open will stop edit
        this._initialized = true;
      });
    }
  }
}

customElements.define(GridProEditSelect.is, GridProEditSelect);
