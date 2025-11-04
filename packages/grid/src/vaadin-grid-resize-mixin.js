/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to observe size changes of the grid and its main parts.
 *
 * @polymerMixin
 */
export const ResizeMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /** @private */
        __hostVisible: {
          type: Boolean,
          value: false,
        },

        /** @private */
        __tableRect: Object,

        /** @private */
        __headerRect: Object,

        /** @private */
        __itemsRect: Object,

        /** @private */
        __footerRect: Object,
      };
    }

    /** @protected */
    ready() {
      super.ready();

      const resizeObserver = new ResizeObserver((entries) => {
        const hostEntry = entries.findLast(({ target }) => target === this);
        if (hostEntry) {
          this.__hostVisible = this.checkVisibility();
        }

        const tableEntry = entries.findLast(({ target }) => target === this.$.table);
        if (tableEntry) {
          this.__tableRect = tableEntry.contentRect;
        }

        const headerEntry = entries.findLast(({ target }) => target === this.$.header);
        if (headerEntry) {
          this.__headerRect = headerEntry.contentRect;
        }

        const itemsEntry = entries.findLast(({ target }) => target === this.$.items);
        if (itemsEntry) {
          this.__itemsRect = itemsEntry.contentRect;
        }

        const footerEntry = entries.findLast(({ target }) => target === this.$.footer);
        if (footerEntry) {
          this.__footerRect = footerEntry.contentRect;
        }
      });

      resizeObserver.observe(this);
      resizeObserver.observe(this.$.table);
      resizeObserver.observe(this.$.header);
      resizeObserver.observe(this.$.items);
      resizeObserver.observe(this.$.footer);
    }
  };
