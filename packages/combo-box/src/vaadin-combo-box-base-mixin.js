/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FocusMixin
 * @mixes InputMixin
 * @mixes KeyboardMixin
 * @param {function(new:HTMLElement)} superClass
 */
export const ComboBoxBaseMixin = (superClass) =>
  class ComboBoxMixinBaseClass extends KeyboardMixin(InputMixin(DisabledMixin(FocusMixin(superClass)))) {
    static get properties() {
      return {
        /**
         * True if the dropdown is open, false otherwise.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          notify: true,
          value: false,
          reflectToAttribute: true,
          sync: true,
          observer: '_openedChanged',
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
          sync: true,
        },

        /**
         * When present, it specifies that the field is read-only.
         * @type {boolean}
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * @type {number}
         * @protected
         */
        _focusedIndex: {
          type: Number,
          observer: '_focusedIndexChanged',
          value: -1,
          sync: true,
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: {
          type: Object,
          observer: '_toggleElementChanged',
        },

        /**
         * Set of items to be rendered in the dropdown.
         * @protected
         */
        _dropdownItems: {
          type: Array,
          sync: true,
        },

        /**
         * Whether the overlay should be opened.
         * @protected
         */
        _overlayOpened: {
          type: Boolean,
          sync: true,
          observer: '_overlayOpenedChanged',
        },
      };
    }

    constructor() {
      super();

      /**
       * Reference to the `vaadin-combo-box-scroller` element instance.
       * Do not define in `properties` to avoid triggering updates.
       * @type {HTMLElement}
       * @protected
       */
      this._scroller;

      /**
       * Used to detect if focusout should be ignored due to touch.
       * Do not define in `properties` to avoid triggering updates.
       * @type {boolean}
       * @protected
       */
      this._closeOnBlurIsPrevented;

      this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this);
      this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this);
      this._boundOnClick = this._onClick.bind(this);
      this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this);
      this._boundOnTouchend = this._onTouchend.bind(this);
    }

    /**
     * Tag name prefix used by scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-combo-box';
    }

    /**
     * Override method inherited from `InputMixin`
     * to customize the input element.
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        input.autocomplete = 'off';
        input.autocapitalize = 'off';

        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', !!this.opened);

        // Disable the macOS Safari spell check auto corrections.
        input.setAttribute('spellcheck', 'false');

        // Disable iOS autocorrect suggestions.
        input.setAttribute('autocorrect', 'off');
      }
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Init scroller in `firstUpdated()` to ensure the `_scroller` reference
      // is available by the time property observer runs. Also, do not store it
      // in a reactive property to avoid triggering another unnecessary update.
      this._initScroller();
    }

    /** @protected */
    ready() {
      super.ready();

      this._initOverlay();

      this.addEventListener('click', this._boundOnClick);
      this.addEventListener('touchend', this._boundOnTouchend);

      if (this.clearElement) {
        this.clearElement.addEventListener('mousedown', this._boundOnClearButtonMouseDown);
      }

      this.addController(new VirtualKeyboardController(this));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Close the overlay on detach
      this.close();
    }

    /**
     * Opens the dropdown list.
     */
    open() {
      // Prevent _open() being called when input is disabled or read-only
      if (!this.disabled && !this.readonly) {
        this.opened = true;
      }
    }

    /**
     * Closes the dropdown list.
     */
    close() {
      this.opened = false;
    }

    /** @private */
    _initOverlay() {
      const overlay = this.$.overlay;

      overlay.addEventListener('touchend', this._boundOnOverlayTouchAction);
      overlay.addEventListener('touchmove', this._boundOnOverlayTouchAction);

      // Prevent blurring the input when clicking inside the overlay
      overlay.addEventListener('mousedown', (e) => e.preventDefault());

      // Manual two-way binding for the overlay "opened" property
      overlay.addEventListener('opened-changed', (e) => {
        this._overlayOpened = e.detail.value;
      });

      this._overlayElement = overlay;
    }

    /**
     * Create and initialize the scroller element.
     *
     * @private
     */
    _initScroller() {
      const scroller = document.createElement(`${this._tagNamePrefix}-scroller`);

      scroller.owner = this;
      scroller.getItemLabel = this._getItemLabel.bind(this);
      scroller.addEventListener('selection-changed', this._boundOverlaySelectedItemChanged);

      this._renderScroller(scroller);

      this._scroller = scroller;
    }

    /**
     * Render the scroller element to the overlay.
     *
     * @private
     */
    _renderScroller(scroller) {
      scroller.setAttribute('slot', 'overlay');
      // Prevent focusing scroller on input Tab
      scroller.setAttribute('tabindex', '-1');
      this.appendChild(scroller);
    }

    /**
     * @type {boolean}
     * @protected
     */
    get _hasDropdownItems() {
      return !!(this._dropdownItems && this._dropdownItems.length);
    }

    /** @private */
    _overlayOpenedChanged(opened, wasOpened) {
      if (opened) {
        this._onOpened();
      } else if (wasOpened && this._hasDropdownItems) {
        this.close();
        this._onOverlayClosed();
      }
    }

    /** @private */
    _focusedIndexChanged(index, oldIndex) {
      if (oldIndex === undefined) {
        return;
      }
      this._updateActiveDescendant(index);
    }

    /** @protected */
    _isInputFocused() {
      return this.inputElement && isElementFocused(this.inputElement);
    }

    /** @private */
    _updateActiveDescendant(index) {
      const input = this.inputElement;
      if (!input) {
        return;
      }

      const item = this._getItemElements().find((el) => el.index === index);
      if (item) {
        input.setAttribute('aria-activedescendant', item.id);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    /** @private */
    _openedChanged(opened, wasOpened) {
      // Prevent _close() being called when opened is set to its default value (false).
      if (wasOpened === undefined) {
        return;
      }

      if (opened) {
        // For touch devices, we don't want to popup virtual keyboard
        // unless input element is explicitly focused by the user.
        if (!this._isInputFocused() && !isTouch) {
          if (this.inputElement) {
            this.inputElement.focus();
          }
        }
      } else {
        this._onClosed();
      }

      const input = this.inputElement;
      if (input) {
        input.setAttribute('aria-expanded', !!opened);

        if (opened) {
          input.setAttribute('aria-controls', this._scroller.id);
        } else {
          input.removeAttribute('aria-controls');
        }
      }
    }

    /** @private */
    _onOverlayTouchAction() {
      // On touch devices, blur the input on touch start inside the overlay, in order to hide
      // the virtual keyboard. But don't close the overlay on this blur.
      this._closeOnBlurIsPrevented = true;
      this.inputElement.blur();
      this._closeOnBlurIsPrevented = false;
    }

    /** @protected */
    _isClearButton(event) {
      return event.composedPath()[0] === this.clearElement;
    }

    /** @private */
    __onClearButtonMouseDown(event) {
      event.preventDefault(); // Prevent native focusout event
      this.inputElement.focus();
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this._onClearAction();
    }

    /**
     * @param {Event} event
     * @private
     */
    _onToggleButtonClick(event) {
      // Prevent parent components such as `vaadin-grid`
      // from handling the click event after it bubbles.
      event.preventDefault();

      if (this.opened) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onHostClick(event) {
      if (!this.autoOpenDisabled) {
        event.preventDefault();
        this.open();
      }
    }

    /** @private */
    _onClick(event) {
      if (this._isClearButton(event)) {
        this._onClearButtonClick(event);
      } else if (event.composedPath().includes(this._toggleElement)) {
        this._onToggleButtonClick(event);
      } else {
        this._onHostClick(event);
      }
    }

    /** @private */
    _onTouchend(event) {
      if (!this.clearElement || event.composedPath()[0] !== this.clearElement) {
        return;
      }

      event.preventDefault();
      this._onClearAction();
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(e) {
      super._onKeyDown(e);

      if (e.key === 'ArrowDown') {
        this._onArrowDown();

        // Prevent caret from moving
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        this._onArrowUp();

        // Prevent caret from moving
        e.preventDefault();
      }
    }

    /**
     * Override to provide logic for item label path.
     * @protected
     */
    _getItemLabel(item) {
      return item ? item.toString() : '';
    }

    /** @private */
    _onArrowDown() {
      if (this.opened) {
        const items = this._dropdownItems;
        if (items) {
          this._focusedIndex = Math.min(items.length - 1, this._focusedIndex + 1);
          this._prefillFocusedItemLabel();
        }
      } else {
        this.open();
      }
    }

    /** @private */
    _onArrowUp() {
      if (this.opened) {
        if (this._focusedIndex > -1) {
          this._focusedIndex = Math.max(0, this._focusedIndex - 1);
        } else {
          const items = this._dropdownItems;
          if (items) {
            this._focusedIndex = items.length - 1;
          }
        }

        this._prefillFocusedItemLabel();
      } else {
        this.open();
      }
    }

    /** @private */
    _prefillFocusedItemLabel() {
      if (this._focusedIndex > -1) {
        const focusedItem = this._dropdownItems[this._focusedIndex];
        this._inputElementValue = this._getItemLabel(focusedItem);
        this._markAllSelectionRange();
      }
    }

    /** @private */
    _setSelectionRange(start, end) {
      // Setting selection range focuses and/or moves the caret in some browsers,
      // and there's no need to modify the selection range if the input isn't focused anyway.
      // This affects Safari. When the overlay is open, and then hitting tab, browser should focus
      // the next focusable element instead of the combo-box itself.
      if (this._isInputFocused() && this.inputElement.setSelectionRange) {
        this.inputElement.setSelectionRange(start, end);
      }
    }

    /** @private */
    _markAllSelectionRange() {
      if (this._inputElementValue !== undefined) {
        this._setSelectionRange(0, this._inputElementValue.length);
      }
    }

    /** @private */
    _clearSelectionRange() {
      if (this._inputElementValue !== undefined) {
        const pos = this._inputElementValue ? this._inputElementValue.length : 0;
        this._setSelectionRange(pos, pos);
      }
    }

    /**
     * @protected
     */
    _closeOrCommit() {
      if (!this.opened) {
        this._commitValue();
      } else {
        this.close();
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onEnter(e) {
      // Do not commit value when custom values are disallowed and input value is not a valid option
      // also stop propagation of the event, otherwise the user could submit a form while the input
      // still contains an invalid value
      if (!this._hasValidInputValue()) {
        // Do not submit the surrounding form.
        e.preventDefault();
        // Do not trigger global listeners
        e.stopPropagation();
        return;
      }

      // Stop propagation of the enter event only if the dropdown is opened, this
      // "consumes" the enter event for the action of closing the dropdown
      if (this.opened) {
        // Do not submit the surrounding form.
        e.preventDefault();
        // Do not trigger global listeners
        e.stopPropagation();
      }

      this._closeOrCommit();
    }

    /**
     * Override this method to detect whether valid value is provided.
     * @protected
     */
    _hasValidInputValue() {
      return true;
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * Do not call `super` in order to override clear
     * button logic defined in `InputControlMixin`.
     *
     * @param {!KeyboardEvent} e
     * @protected
     * @override
     */
    _onEscape(e) {
      if (
        this.autoOpenDisabled &&
        (this.opened || (this.value !== this._inputElementValue && this._inputElementValue.length > 0))
      ) {
        // Auto-open is disabled
        // The overlay is open or
        // The input value has changed but the change hasn't been committed, so cancel it.
        e.stopPropagation();
        this._focusedIndex = -1;
        this._onEscapeCancel();
      } else if (this.opened) {
        // Auto-open is enabled
        // The overlay is open
        e.stopPropagation();

        if (this._focusedIndex > -1) {
          // An item is focused, revert the input to the filtered value
          this._focusedIndex = -1;
          this._revertInputValue();
        } else {
          // No item is focused, cancel the change and close the overlay
          this._onEscapeCancel();
        }
      } else if (this.clearButtonVisible && !!this.value && !this.readonly) {
        e.stopPropagation();
        // The clear button is visible and the overlay is closed, so clear the value.
        this._onClearAction();
      }
    }

    /**
     * Override to handle canceling and closing overlay on Escape.
     * @protected
     */
    _onEscapeCancel() {
      // To be implemented
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Don't blur the input on toggle mousedown
        toggleElement.addEventListener('mousedown', (e) => e.preventDefault());
        // Unfocus previously focused element if focus is not inside combo box (on touch devices)
        toggleElement.addEventListener('click', () => {
          if (isTouch && !this._isInputFocused()) {
            document.activeElement.blur();
          }
        });
      }
    }

    /**
     * Override to implement logic for clearing value.
     * @protected
     */
    _onClearAction() {
      // To be implemented
    }

    /**
     * Override to implement logic for overlay opening.
     * @protected
     */
    _onOpened() {
      // To be implemented
    }

    /**
     * Override to implement logic for changing opened to false.
     * @protected
     */
    _onClosed() {
      // To be implemented
    }

    /**
     * Override to implement logic for overlay closing.
     * @protected
     */
    _onOverlayClosed() {
      // To be implemented
    }

    /**
     * Override to implement logic for committing value.
     * @protected
     */
    _commitValue() {
      // To be implemented
    }

    /**
     * Override to implement logic for value reverting.
     * @protected
     */
    _revertInputValue() {
      this._inputElementValue = this.value;
      this._clearSelectionRange();
    }

    /**
     * Override an event listener from `InputMixin`.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      if (!this.opened && !this._isClearButton(event) && !this.autoOpenDisabled) {
        this.opened = true;
      }
    }

    /** @private */
    _getItemElements() {
      return Array.from(this._scroller.querySelectorAll(`${this._tagNamePrefix}-item`));
    }

    /** @protected */
    _scrollIntoView(index) {
      if (!this._scroller) {
        return;
      }
      this._scroller.scrollIntoView(index);
    }

    /** @private */
    _overlaySelectedItemChanged(e) {
      // Stop this private event from leaking outside.
      e.stopPropagation();

      if (e.detail.item instanceof ComboBoxPlaceholder) {
        // Placeholder items should not be selectable.
        return;
      }

      if (this.opened) {
        this._focusedIndex = this._dropdownItems.indexOf(e.detail.item);
        this.close();
      }
    }

    /**
     * Override method inherited from `FocusMixin`
     * to close the overlay on blur and commit the value.
     *
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused && !this.readonly && !this._closeOnBlurIsPrevented) {
        this._handleFocusOut();
      }
    }

    /**
     * Override this method to provide custom logic for focusout.
     * @protected
     */
    _handleFocusOut() {
      if (isKeyboardActive()) {
        // Close on Tab key causing blur. With mouse, close on outside click instead.
        this._closeOrCommit();
        return;
      }

      if (!this.opened) {
        this._commitValue();
      } else if (!this._overlayOpened) {
        // Combo-box is opened, but overlay is not visible -> custom value was entered.
        // Make sure we close here as there won't be an "outside click" in this case.
        this.close();
      }
    }

    /**
     * Override method inherited from `FocusMixin` to not remove focused
     * state when focus moves to the overlay.
     *
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      // VoiceOver on iOS fires `focusout` event when moving focus to the item in the dropdown.
      // Do not focus the input in this case, because it would break announcement for the item.
      if (event.relatedTarget && event.relatedTarget.localName === `${this._tagNamePrefix}-item`) {
        return false;
      }

      // Do not blur when focus moves to the overlay
      // Also, fixes the problem with `focusout` happening when clicking on the scroll bar on Edge
      if (event.relatedTarget === this._overlayElement) {
        event.composedPath()[0].focus();
        return false;
      }

      return true;
    }
  };
