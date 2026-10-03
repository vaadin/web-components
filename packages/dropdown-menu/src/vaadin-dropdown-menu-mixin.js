/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ButtonController } from './button-controller.js';

/**
 * @polymerMixin
 */
export const DropdownMenuMixin = (superClass) =>
  class DropdownMenuMixinClass extends superClass {
    #focusLastOnOpen = false;

    static get properties() {
      return {
        /**
         * A text that is displayed in the button, if no
         * element is assigned to the `button` slot.
         */
        label: {
          type: String,
        },

        /**
         * Position of the menu with respect to the button.
         * Supported values: `bottom-start`, `bottom-end`, `top-start`, `top-end`.
         * Defaults to `bottom-start` when set to an empty value.
         * @type {string}
         */
        position: {
          type: String,
          value: 'bottom-start',
          sync: true,
        },

        /**
         * When true, the button is disabled and the menu cannot be opened.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Defines a string value that labels the button.
         * Use it when the button has no visible text, e.g. an icon-only button.
         * @attr {string} accessible-name
         */
        accessibleName: {
          type: String,
        },

        /** @private */
        _buttonTheme: {
          type: String,
          attribute: false,
          sync: true,
        },
      };
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'theme'];
    }

    constructor() {
      super();

      this.openOn = 'vaadin-dropdown-menu-open';

      this._buttonController = new ButtonController(this);
      this._buttonController.addEventListener('slot-content-changed', (event) => {
        // Also fired on label updates, only re-wire on a new button.
        const { node } = event.detail;
        if (node !== this._buttonElement) {
          this.#setButton(node);
        }
      });
    }

    /**
     * Focuses the button.
     * @param {FocusOptions=} options
     */
    focus(options) {
      if (this.isConnected && this._buttonElement) {
        this._buttonElement.focus(options);
      }
    }

    /**
     * Removes focus from the button.
     */
    blur() {
      this._buttonElement?.blur();
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (name === 'theme') {
        this._buttonTheme = newValue;
      }
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      // An empty position would enable the context-menu coordinates path.
      if (props.has('position') && !this.position) {
        this.position = 'bottom-start';
      }
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addController(this._buttonController);

      this.$.overlay.addEventListener('vaadin-overlay-open', () => {
        // Items mode creates the list-box lazily on first open.
        this.#updateAriaRefs();

        // Runs after `__forwardFocus()`, which focuses the first item.
        if (this.#focusLastOnOpen) {
          this.#focusLastItem();
        } else if (!isKeyboardActive()) {
          // Programmatic focus sets `focus-ring`, only show it for keyboard.
          this._menuListBox?.focused?.removeAttribute('focus-ring');
        }
      });

      // Items mode closes on Tab in `ItemsMixin`, slotted mode needs it here.
      this.$.overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && this.__slottedListBox) {
          this.close();
        }
      });
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('label')) {
        this._buttonController.setLabel(this.label);
      }

      const button = this._buttonElement;
      if (button) {
        if (props.has('opened')) {
          button.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
          button.toggleAttribute('expanded', this.opened);
          if (this.opened || props.get('opened')) {
            button.toggleAttribute('active', this.opened);
          }
        }

        if (props.has('disabled')) {
          button.disabled = this.disabled;
        }

        if (props.has('_buttonTheme')) {
          setOrRemoveAttribute(button, 'theme', this._buttonTheme);
        }

        if (props.has('accessibleName')) {
          setOrRemoveAttribute(button, 'aria-label', this.accessibleName);
        }
      }

      if (props.has('disabled') && this.disabled && this.opened) {
        this.close();
      }

      if (props.has('__slottedListBox')) {
        props.get('__slottedListBox')?.removeEventListener('selected-changed', this.#onSlottedSelectedChanged);
        this.__slottedListBox?.addEventListener('selected-changed', this.#onSlottedSelectedChanged);
        this.#clearListBoxRef(props.get('__slottedListBox'));
        this.#updateAriaRefs();
      }
    }

    /**
     * Override method from `ItemsMixin` to use a dedicated element for nested menus.
     * @protected
     * @override
     */
    get _subMenuTagName() {
      return 'vaadin-dropdown-menu-submenu';
    }

    /**
     * Override method from `ContextMenuMixin` to not toggle user-select on the button.
     * @protected
     * @override
     */
    _openedChanged() {
      // Do nothing
    }

    /**
     * Override method from `ContextMenuMixin` to not react to global "contextmenu" events.
     * @private
     * @override
     */
    __onGlobalContextMenu() {
      // Do nothing
    }

    /** @param {HTMLElement} button */
    #setButton(button) {
      const oldButton = this._buttonElement;
      if (oldButton) {
        oldButton.removeEventListener('click', this.#onButtonClick);
        oldButton.removeEventListener('keydown', this.#onButtonKeyDown);
        oldButton.removeEventListener('focusin', this.#onButtonFocusIn);
        oldButton.removeEventListener('focusout', this.#onButtonFocusOut);
        oldButton.removeAttribute('aria-controls');
        this.#clearListBoxRef(this.#listBox);
      }

      this._buttonElement = button;
      this.listenOn = button;

      button.addEventListener('click', this.#onButtonClick);
      button.addEventListener('keydown', this.#onButtonKeyDown);
      button.addEventListener('focusin', this.#onButtonFocusIn);
      button.addEventListener('focusout', this.#onButtonFocusOut);

      button.disabled = this.disabled;
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
      button.toggleAttribute('expanded', this.opened);
      if (this.opened) {
        button.toggleAttribute('active', true);
      }
      // Keep own attributes of a custom button unless set on the host.
      if (this._buttonTheme != null) {
        button.setAttribute('theme', this._buttonTheme);
      }
      if (this.accessibleName != null) {
        button.setAttribute('aria-label', this.accessibleName);
      }

      this.#updateAriaRefs();
    }

    #updateAriaRefs() {
      const button = this._buttonElement;
      if (!button || !this._overlayElement) {
        return;
      }

      const listBox = this.#listBox;
      if (listBox) {
        if (!listBox.id) {
          listBox.id = `vaadin-dropdown-menu-list-box-${generateUniqueId()}`;
        }
        button.setAttribute('aria-controls', listBox.id);
        if (!listBox.hasAttribute('aria-label')) {
          listBox.setAttribute('aria-labelledby', button.id);
        }
      } else {
        button.removeAttribute('aria-controls');
      }
    }

    // Avoid `_menuListBox` without items, it creates the renderer root.
    get #listBox() {
      return this.__slottedListBox ?? (this.items ? this._menuListBox : null);
    }

    /** @param {HTMLElement | null | undefined} listBox */
    #clearListBoxRef(listBox) {
      if (listBox && this._buttonElement && listBox.getAttribute('aria-labelledby') === this._buttonElement.id) {
        listBox.removeAttribute('aria-labelledby');
      }
    }

    #onButtonFocusIn = () => {
      const button = this._buttonElement;
      // Read after a microtask, as `FocusMixin.focus()` sets `focus-ring` after `focusin`.
      queueMicrotask(() => this.toggleAttribute('focus-ring', button.hasAttribute('focus-ring')));
    };

    #onButtonFocusOut = () => {
      this.removeAttribute('focus-ring');
    };

    #onButtonClick = () => {
      if (this.opened) {
        this.close();
      } else {
        this.#open();
      }
    };

    /** @param {KeyboardEvent} event */
    #onButtonKeyDown = (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return;
      }

      // Prevent page scroll
      event.preventDefault();

      const focusLast = event.key === 'ArrowUp';
      if (!this.opened) {
        this.#open(focusLast);
      } else if (focusLast) {
        this.#focusLastItem();
      } else {
        this._menuListBox?.focus();
      }
    };

    #open(focusLast = false) {
      this.#focusLastOnOpen = focusLast;
      this._buttonElement.dispatchEvent(new CustomEvent('vaadin-dropdown-menu-open'));
    }

    #focusLastItem() {
      const listBox = this._menuListBox;
      const items = listBox ? listBox.items : [];
      items[items.length - 1]?.focus();
    }

    /** @param {CustomEvent} event */
    #onSlottedSelectedChanged = (event) => {
      const listBox = event.target;
      const { value } = event.detail;
      if (typeof value === 'number') {
        const item = listBox.items[value];
        // Reset selection, the list-box is used as a menu.
        listBox.selected = null;
        this.dispatchEvent(new CustomEvent('item-selected', { detail: { value: item } }));
      }
    };
  };
