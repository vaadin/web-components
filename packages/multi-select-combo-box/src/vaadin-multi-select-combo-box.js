/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-multi-select-combo-box-internal.js';
import './vaadin-multi-select-combo-box-tokens.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-multi-select-combo-box', inputFieldShared, { moduleId: 'vaadin-multi-select-combo-box-styles' });

class MultiSelectComboBox extends PatternMixin(InputControlMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-multi-select-combo-box';
  }

  static get template() {
    return html`
      <div class="vaadin-multi-select-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-multi-select-combo-box-internal
          id="comboBox"
          items="[[items]]"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          allow-custom-value="[[allowCustomValues]]"
          position-target="[[_inputContainer]]"
          renderer="[[renderer]]"
          theme$="[[theme]]"
          on-combo-box-item-selected="_onComboBoxItemSelected"
          on-change="_onComboBoxItemSelected"
        >
          <vaadin-input-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[theme]]"
          >
            <vaadin-multi-select-combo-box-tokens
              id="tokens"
              compact-mode="[[compactMode]]"
              compact-mode-label-generator="[[compactModeLabelGenerator]]"
              items="[[selectedItems]]"
              slot="prefix"
              on-item-removed="_onItemRemoved"
              on-mousedown="_preventBlur"
            ></vaadin-multi-select-combo-box-tokens>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix" on-click="_onClearButtonClick"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix"></div>
          </vaadin-input-container>
        </vaadin-multi-select-combo-box-internal>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * The value for this element.
       */
      value: {
        type: String,
        notify: true,
        value: ''
      },

      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /**
       * When true, the component does not render tokens for every selected value.
       * Instead, only the number of currently selected items is shown.
       */
      compactMode: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Custom function for generating the display label when in compact mode.
       *
       * This function receives the array of selected items and should return
       * a string value that will be used as the display label.
       */
      compactModeLabelGenerator: {
        type: Object
      },

      /**
       * When true, the user can input a value that is not present in the items list.
       * @attr {boolean} allow-custom-values
       */
      allowCustomValues: {
        type: Boolean,
        value: false
      },

      /**
       * The list of items.
       */
      items: Array,

      /**
       * The item property to be used as the `label` in combo-box.
       */
      itemLabelPath: String,

      /**
       * The item property to be used as the `value` of combo-box.
       */
      itemValuePath: String,

      /**
       * Custom function for rendering the content of every item.
       * Receives three arguments:
       *
       * - `root` The `<vaadin-combo-box-item>` internal container DOM element.
       * - `comboBox` The reference to the `<vaadin-combo-box>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.index` The index of the rendered item.
       *   - `model.item` The item.
       */
      renderer: Function,

      /**
       * The list of selected items.
       * Note: modifying the selected items creates a new array each time.
       */
      selectedItems: {
        type: Array,
        value: () => [],
        notify: true
      },

      /** @private */
      _inputContainer: Object
    };
  }

  static get observers() {
    return ['_selectedItemsObserver(selectedItems, selectedItems.*)'];
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      })
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._inputContainer = this.$.comboBox;

    processTemplates(this);
  }

  /**
   * Override method inherited from `InputMixin` to forward the input to combo-box.
   * @protected
   * @override
   */
  _inputElementChanged(input) {
    super._inputElementChanged(input);

    if (input) {
      this.$.comboBox._setInputElement(input);
    }
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /** @private */
  _selectedItemsObserver(selectedItems) {
    this.toggleAttribute('has-value', Boolean(selectedItems && selectedItems.length));

    // TODO: Implement "ordered" property
    // if (this.ordered && !this.compactMode) {
    //   this._sortSelectedItems(selectedItems);
    // }

    // TODO: Do we actually need "title" at all?
    // this.compactMode && (this.title = this._getDisplayValue(selectedItems, this.itemLabelPath, ', '));

    // Re-render tokens
    this.$.tokens.requestUpdate();

    // Re-render scroller
    this.$.comboBox.$.dropdown._scroller.__virtualizer.update();

    // Wait for tokens to render
    requestAnimationFrame(() => {
      this.$.comboBox.$.dropdown._setOverlayWidth();
    });
  }

  /** @private */
  _findIndex(item, selectedItems, itemIdPath) {
    if (itemIdPath && item) {
      for (let index = 0; index < selectedItems.length; index++) {
        if (selectedItems[index] && selectedItems[index][itemIdPath] === item[itemIdPath]) {
          return index;
        }
      }
      return -1;
    }

    return selectedItems.indexOf(item);
  }

  /** @private */
  _onClearButtonClick(event) {
    event.stopPropagation();

    this.selectedItems = [];

    // if (this.validate()) {
    //   this._dispatchChangeEvent();
    // }
  }

  /** @private */
  _onComboBoxItemSelected(event) {
    // TODO: use separate listener for change event to make it less confusing
    const item = event.detail ? event.detail.item : this.$.comboBox.selectedItem;

    if (!item) {
      return;
    }

    const update = this.selectedItems.slice(0);
    const index = this._findIndex(item, this.selectedItems, this.itemIdPath);
    if (index !== -1) {
      update.splice(index, 1);
    } else {
      update.push(item);
    }

    this.inputElement.value = null;

    this.selectedItems = update;

    // TODO: validate and dispatch change

    // if (this.validate()) {
    //   this._dispatchChangeEvent();
    // }

    // Avoid firing `value-changed` event.
    this.$.comboBox._focusedIndex = -1;

    // Avoid firing `custom-value-set` event.
    if (this.allowCustomValues) {
      this.inputElement.value = '';
    }
  }

  /** @private */
  _onItemRemoved(event) {
    const item = event.detail.item;
    const update = this.selectedItems.slice(0);
    update.splice(update.indexOf(item), 1);
    this.selectedItems = update;

    // TODO: validate and dispatch change

    // if (this.validate()) {
    //   this._dispatchChangeEvent();
    // }
  }

  /** @private */
  _preventBlur(event) {
    // Prevent mousedown event to keep the input focused
    // and keep the overlay opened when clicking a token.
    event.preventDefault();
  }
}

customElements.define(MultiSelectComboBox.is, MultiSelectComboBox);

export { MultiSelectComboBox };
