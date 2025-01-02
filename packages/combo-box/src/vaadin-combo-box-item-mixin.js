/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const ComboBoxItemMixin = (superClass) =>
  class ComboBoxItemMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The index of the item.
         */
        index: {
          type: Number,
        },

        /**
         * The item to render.
         */
        item: {
          type: Object,
        },

        /**
         * The text to render in the item.
         */
        label: {
          type: String,
        },

        /**
         * True when item is selected.
         */
        selected: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * True when item is focused.
         */
        focused: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Custom function for rendering the item content.
         */
        renderer: {
          type: Function,
        },
      };
    }

    static get observers() {
      return ['__rendererOrItemChanged(renderer, index, item, selected, focused)', '__updateLabel(label, renderer)'];
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'hidden'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'hidden' && newValue !== null) {
        // The element is being hidden (by virtualizer). Mark one of the __rendererOrItemChanged
        // dependencies as undefined to make sure it's called when the element is shown again
        // and assigned properties with possibly identical values as before hiding.
        this.index = undefined;
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this._owner = this.parentNode.owner;

      const hostDir = this._owner.getAttribute('dir');
      if (hostDir) {
        this.setAttribute('dir', hostDir);
      }
    }

    /**
     * Requests an update for the content of the item.
     * While performing the update, it invokes the renderer passed in the `renderer` property.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this.renderer || this.hidden) {
        return;
      }

      const model = {
        index: this.index,
        item: this.item,
        focused: this.focused,
        selected: this.selected,
      };

      this.renderer(this, this._owner, model);
    }

    /** @private */
    __rendererOrItemChanged(renderer, index, item) {
      if (item === undefined || index === undefined) {
        return;
      }

      if (this._oldRenderer !== renderer) {
        this.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete this._$litPart$;
      }

      if (renderer) {
        this._oldRenderer = renderer;
        this.requestContentUpdate();
      }
    }

    /** @private */
    __updateLabel(label, renderer) {
      if (renderer) {
        return;
      }

      this.textContent = label;
    }
  };
