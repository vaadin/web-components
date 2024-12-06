/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { setAriaIDReference } from '@vaadin/a11y-base/src/aria-id-reference.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { LabelController } from '@vaadin/field-base/src/label-controller.js';
import { ButtonController } from './button-controller.js';

/**
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes DelegateStateMixin
 * @mixes FieldMixin
 * @mixes KeyboardMixin
 * @mixes OverlayClassMixin
 */
export const SelectBaseMixin = (superClass) =>
  class SelectBaseMixin extends OverlayClassMixin(
    DelegateFocusMixin(DelegateStateMixin(KeyboardMixin(FieldMixin(superClass)))),
  ) {
    static get properties() {
      return {
        /**
         * An array containing items that will be rendered as the options of the select.
         *
         * #### Example
         * ```js
         * select.items = [
         *   { label: 'Most recent first', value: 'recent' },
         *   { component: 'hr' },
         *   { label: 'Rating: low to high', value: 'rating-asc', className: 'asc' },
         *   { label: 'Rating: high to low', value: 'rating-desc', className: 'desc' },
         *   { component: 'hr' },
         *   { label: 'Price: low to high', value: 'price-asc', disabled: true },
         *   { label: 'Price: high to low', value: 'price-desc', disabled: true }
         * ];
         * ```
         *
         * Note: each item is rendered by default as the internal `<vaadin-select-item>` that is an extension of `<vaadin-item>`.
         * To render the item with a custom component, provide a tag name by the `component` property.
         *
         * @type {!Array<!SelectItem>}
         */
        items: {
          type: Array,
          observer: '__itemsChanged',
        },

        /**
         * Set when the select is open
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true,
          observer: '_openedChanged',
        },

        /**
         * Custom function for rendering the content of the `<vaadin-select>`.
         * Receives two arguments:
         *
         * - `root` The `<vaadin-select-overlay>` internal container
         *   DOM element. Append your content to it.
         * - `select` The reference to the `<vaadin-select>` element.
         * @type {!SelectRenderer | undefined}
         */
        renderer: {
          type: Object,
        },

        /**
         * The `value` property of the selected item, or an empty string
         * if no item is selected.
         * On change or initialization, the component finds the item which matches the
         * value and displays it.
         * If no value is provided to the component, it selects the first item without
         * value or empty value.
         * Hint: If you do not want to select any item by default, you can either set all
         * the values of inner vaadin-items, or set the vaadin-select value to
         * an inexistent value in the items list.
         * @type {string}
         */
        value: {
          type: String,
          value: '',
          notify: true,
          observer: '_valueChanged',
        },

        /**
         * The name of this element.
         */
        name: {
          type: String,
        },

        /**
         * A hint to the user of what can be entered in the control.
         * The placeholder will be displayed in the case that there
         * is no item selected, or the selected item has an empty
         * string label, or the selected item has no label and it's
         * DOM content is empty.
         */
        placeholder: {
          type: String,
        },

        /**
         * When present, it specifies that the element is read-only.
         * @type {boolean}
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Defines whether the overlay should overlap the target element
         * in the y-axis, or be positioned right above/below it.
         *
         * @attr {boolean} no-vertical-overlap
         */
        noVerticalOverlap: {
          type: Boolean,
          value: false,
        },

        /** @private */
        _phone: Boolean,

        /** @private */
        _phoneMediaQuery: {
          value: '(max-width: 450px), (max-height: 450px)',
        },

        /** @private */
        _inputContainer: Object,

        /** @private */
        _items: Object,
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'invalid'];
    }

    static get observers() {
      return ['_updateAriaExpanded(opened, focusElement)', '_updateSelectedItem(value, _items, placeholder)'];
    }

    constructor() {
      super();

      this._itemId = `value-${this.localName}-${generateUniqueId()}`;
      this._srLabelController = new LabelController(this);
      this._srLabelController.slotName = 'sr-label';
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Making sure the select is closed and removed from DOM after detaching the select.
      this.opened = false;
    }

    /** @protected */
    ready() {
      super.ready();

      this._inputContainer = this.shadowRoot.querySelector('[part~="input-field"]');

      this._valueButtonController = new ButtonController(this);
      this.addController(this._valueButtonController);

      this.addController(this._srLabelController);

      this.addController(
        new MediaQueryController(this._phoneMediaQuery, (matches) => {
          this._phone = matches;
        }),
      );

      this._tooltipController = new TooltipController(this);
      this._tooltipController.setPosition('top');
      this._tooltipController.setAriaTarget(this.focusElement);
      this.addController(this._tooltipController);
    }

    /**
     * Requests an update for the content of the select.
     * While performing the update, it invokes the renderer passed in the `renderer` property.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this._overlayElement) {
        return;
      }

      this._overlayElement.requestContentUpdate();

      if (this._menuElement && this._menuElement.items) {
        this._updateSelectedItem(this.value, this._menuElement.items);
      }
    }

    /**
     * Override an observer from `FieldMixin`
     * to validate when required is removed.
     *
     * @protected
     * @override
     */
    _requiredChanged(required) {
      super._requiredChanged(required);

      if (required === false) {
        this._requestValidation();
      }
    }

    /**
     * @param {SelectItem[] | undefined | null} newItems
     * @param {SelectItem[] | undefined | null} oldItems
     * @private
     */
    __itemsChanged(newItems, oldItems) {
      if (newItems || oldItems) {
        this.requestContentUpdate();
      }
    }

    /**
     * @param {HTMLElement} menuElement
     * @protected
     */
    _assignMenuElement(menuElement) {
      if (menuElement && menuElement !== this.__lastMenuElement) {
        this._menuElement = menuElement;

        // Ensure items are initialized
        this.__initMenuItems(menuElement);

        menuElement.addEventListener('items-changed', () => {
          this.__initMenuItems(menuElement);
        });

        menuElement.addEventListener('selected-changed', () => this.__updateValueButton());
        // Use capture phase to make it possible for `<vaadin-grid-pro-edit-select>`
        // to override and handle the keydown event before the value change happens.
        menuElement.addEventListener('keydown', (e) => this._onKeyDownInside(e), true);
        menuElement.addEventListener(
          'click',
          (e) => {
            const item = e.composedPath().find((el) => el._hasVaadinItemMixin);
            this.__dispatchChangePending = Boolean(item && item.value !== undefined && item.value !== this.value);
            this.opened = false;
          },
          true,
        );

        // Store the menu element reference
        this.__lastMenuElement = menuElement;
      }
    }

    /** @private */
    __initMenuItems(menuElement) {
      if (menuElement.items) {
        this._items = menuElement.items;
      }
    }

    /** @private */
    _valueChanged(value, oldValue) {
      this.toggleAttribute('has-value', Boolean(value));

      // Skip validation during initialization and when
      // a change event is scheduled, as validation will be
      // triggered by `__dispatchChange()` in that case.
      if (oldValue !== undefined && !this.__dispatchChangePending) {
        this._requestValidation();
      }
    }

    /**
     * Opens the overlay if the field is not read-only.
     *
     * @private
     */
    _onClick(event) {
      if (this.disabled) {
        return;
      }

      // Prevent parent components such as `vaadin-grid`
      // from handling the click event after it bubbles.
      event.preventDefault();

      this.opened = !this.readonly;
    }

    /** @private */
    _onToggleMouseDown(event) {
      // Prevent mousedown event to avoid blur and preserve focused state
      // while opening, and to restore focus-ring attribute on closing.
      event.preventDefault();
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(e) {
      if (e.target === this.focusElement && !this.readonly && !this.disabled && !this.opened) {
        if (/^(Enter|SpaceBar|\s|ArrowDown|Down|ArrowUp|Up)$/u.test(e.key)) {
          e.preventDefault();
          this.opened = true;
        } else if (/[\p{L}\p{Nd}]/u.test(e.key) && e.key.length === 1) {
          const selected = this._menuElement.selected;
          const currentIdx = selected !== undefined ? selected : -1;
          const newIdx = this._menuElement._searchKey(currentIdx, e.key);
          if (newIdx >= 0) {
            this.__dispatchChangePending = true;

            // Announce the value selected with the first letter shortcut
            this._updateAriaLive(true);
            this._menuElement.selected = newIdx;
          }
        }
      }
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onKeyDownInside(e) {
      if (/^(Tab)$/u.test(e.key)) {
        this.opened = false;
      }
    }

    /** @private */
    _openedChanged(opened, wasOpened) {
      if (opened) {
        // Avoid multiple announcements when a value gets selected from the dropdown
        this._updateAriaLive(false);

        if (!this._overlayElement || !this._menuElement || !this.focusElement || this.disabled || this.readonly) {
          this.opened = false;
          return;
        }

        this._overlayElement.style.setProperty(
          '--vaadin-select-text-field-width',
          `${this._inputContainer.offsetWidth}px`,
        );

        // Preserve focus-ring to restore it later
        const hasFocusRing = this.hasAttribute('focus-ring');
        this._openedWithFocusRing = hasFocusRing;

        // Opened select should not keep focus-ring
        if (hasFocusRing) {
          this.removeAttribute('focus-ring');
        }
      } else if (wasOpened) {
        if (this._openedWithFocusRing) {
          this.setAttribute('focus-ring', '');
        }

        // Skip validation when a change event is scheduled, as validation
        // will be triggered by `__dispatchChange()` in that case.
        // Also, skip validation when closed on Escape or Tab keys.
        if (!this.__dispatchChangePending && !this._keyboardActive) {
          this._requestValidation();
        }
      }
    }

    /** @private */
    _updateAriaExpanded(opened, focusElement) {
      if (focusElement) {
        focusElement.setAttribute('aria-expanded', opened ? 'true' : 'false');
      }
    }

    /** @private */
    _updateAriaLive(ariaLive) {
      if (this.focusElement) {
        if (ariaLive) {
          this.focusElement.setAttribute('aria-live', 'polite');
        } else {
          this.focusElement.removeAttribute('aria-live');
        }
      }
    }

    /** @private */
    __attachSelectedItem(selected) {
      let labelItem;

      const label = selected.getAttribute('label');
      if (label) {
        labelItem = this.__createItemElement({ label });
      } else {
        labelItem = selected.cloneNode(true);
      }

      // Store reference to the original item
      labelItem._sourceItem = selected;

      this.__appendValueItemElement(labelItem, this.focusElement);

      // Ensure the item gets proper styles
      labelItem.selected = true;
    }

    /**
     * @param {!SelectItem} item
     * @private
     */
    __createItemElement(item) {
      const itemElement = document.createElement(item.component || 'vaadin-select-item');
      if (item.label) {
        itemElement.textContent = item.label;
      }
      if (item.value) {
        itemElement.value = item.value;
      }
      if (item.disabled) {
        itemElement.disabled = item.disabled;
      }
      if (item.className) {
        itemElement.className = item.className;
      }
      return itemElement;
    }

    /**
     * @param {!HTMLElement} itemElement
     * @param {!HTMLElement} parent
     * @private
     */
    __appendValueItemElement(itemElement, parent) {
      parent.appendChild(itemElement);
      // Trigger observer that sets aria-selected attribute
      // so that we can then synchronously remove it below.
      if (itemElement.performUpdate) {
        itemElement.performUpdate();
      }
      itemElement.removeAttribute('tabindex');
      itemElement.removeAttribute('aria-selected');
      itemElement.removeAttribute('role');
      itemElement.removeAttribute('focused');
      itemElement.removeAttribute('focus-ring');
      itemElement.removeAttribute('active');
      itemElement.setAttribute('id', this._itemId);
    }

    /**
     * @param {string} accessibleName
     * @protected
     */
    _accessibleNameChanged(accessibleName) {
      this._srLabelController.setLabel(accessibleName);
      this._setCustomAriaLabelledBy(accessibleName ? this._srLabelController.defaultId : null);
    }

    /**
     * @param {string} accessibleNameRef
     * @protected
     */
    _accessibleNameRefChanged(accessibleNameRef) {
      this._setCustomAriaLabelledBy(accessibleNameRef);
    }

    /**
     * @param {string} ariaLabelledby
     * @private
     */
    _setCustomAriaLabelledBy(ariaLabelledby) {
      const labelId = this._getLabelIdWithItemId(ariaLabelledby);
      this._fieldAriaController.setLabelId(labelId, true);
    }

    /**
     * @param {string | null} labelId
     * @returns string | null
     * @private
     */
    _getLabelIdWithItemId(labelId) {
      const selected = this._items ? this._items[this._menuElement.selected] : false;
      const itemId = selected || this.placeholder ? this._itemId : '';

      return labelId ? `${labelId} ${itemId}`.trim() : null;
    }

    /** @private */
    __updateValueButton() {
      const valueButton = this.focusElement;

      if (!valueButton) {
        return;
      }

      valueButton.innerHTML = '';

      const selected = this._items[this._menuElement.selected];

      valueButton.removeAttribute('placeholder');

      if (this._hasContent(selected)) {
        this.__attachSelectedItem(selected);
      } else if (this.placeholder) {
        const item = this.__createItemElement({ label: this.placeholder });
        this.__appendValueItemElement(item, valueButton);
        valueButton.setAttribute('placeholder', '');
      }

      if (!this._valueChanging && selected) {
        this._selectedChanging = true;
        this.value = selected.value || '';
        if (this.__dispatchChangePending) {
          this.__dispatchChange();
        }
        delete this._selectedChanging;
      }

      const labelledIdReferenceConfig =
        selected || this.placeholder ? { newId: this._itemId } : { oldId: this._itemId };

      setAriaIDReference(valueButton, 'aria-labelledby', labelledIdReferenceConfig);
      if (this.accessibleName || this.accessibleNameRef) {
        this._setCustomAriaLabelledBy(this.accessibleNameRef || this._srLabelController.defaultId);
      }
    }

    /** @private */
    _hasContent(item) {
      if (!item) {
        return false;
      }
      const hasText = Boolean(item.hasAttribute('label') ? item.getAttribute('label') : item.textContent.trim());
      const hasChildren = item.childElementCount > 0;
      return hasText || hasChildren;
    }

    /** @private */
    _updateSelectedItem(value, items) {
      if (items) {
        const valueAsString = value == null ? value : value.toString();
        this._menuElement.selected = items.reduce((prev, item, idx) => {
          return prev === undefined && item.value === valueAsString ? idx : prev;
        }, undefined);
        if (!this._selectedChanging) {
          this._valueChanging = true;
          this.__updateValueButton();
          delete this._valueChanging;
        }
      }
    }

    /**
     * Override method inherited from `FocusMixin` to not remove focused
     * state when select is opened and focus moves to list-box.
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus() {
      return !this.opened;
    }

    /**
     * Override method inherited from `FocusMixin` to validate on blur.
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (!focused && document.hasFocus()) {
        this._requestValidation();
      }
    }

    /**
     * Returns true if the current value satisfies all constraints (if any)
     *
     * @return {boolean}
     */
    checkValidity() {
      return !this.required || this.readonly || !!this.value;
    }

    /**
     * Renders items when they are provided by the `items` property and clears the content otherwise.
     * @param {!HTMLElement} root
     * @param {!Select} _select
     * @private
     */
    __defaultRenderer(root, _select) {
      if (!this.items || this.items.length === 0) {
        root.textContent = '';
        return;
      }

      let listBox = root.firstElementChild;
      if (!listBox) {
        listBox = document.createElement('vaadin-select-list-box');
        root.appendChild(listBox);
      }

      listBox.textContent = '';
      this.items.forEach((item) => {
        listBox.appendChild(this.__createItemElement(item));
      });
    }

    /** @private */
    async __dispatchChange() {
      // Wait for the update complete to guarantee that value-changed is fired
      // before validated and change events when using the Lit version of the component.
      if (this.updateComplete) {
        await this.updateComplete;
      }

      this._requestValidation();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      this.__dispatchChangePending = false;
    }
  };
