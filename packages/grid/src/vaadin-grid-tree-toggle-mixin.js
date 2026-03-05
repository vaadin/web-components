/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isFocusable } from './vaadin-grid-active-item-mixin.js';

/**
 * @polymerMixin
 */
export const GridTreeToggleMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /**
         * Current level of the tree represented with a horizontal offset
         * of the toggle button.
         */
        level: {
          type: Number,
          value: 0,
          observer: '_levelChanged',
          sync: true,
        },

        /**
         * Hides the toggle icon and disables toggling a tree sublevel.
         */
        leaf: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Sublevel toggle state.
         */
        expanded: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true,
          sync: true,
        },
      };
    }

    constructor() {
      super();
      this.addEventListener('click', (e) => this._onClick(e));
    }

    /** @private */
    _onClick(e) {
      if (this.leaf) {
        return;
      }
      if (isFocusable(e.target) || e.target instanceof HTMLLabelElement) {
        return;
      }

      e.preventDefault();
      this.expanded = !this.expanded;
    }

    /** @private */
    _levelChanged(level) {
      const value = Number(level).toString();
      this.style.setProperty('--_level', value);
    }
  };
