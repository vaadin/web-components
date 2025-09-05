/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

const DEFAULT_I18N = {
  toggle: 'Toggle child items',
};

/**
 * A controller that manages the item content children slot.
 */
class ChildrenController extends SlotController {
  constructor(host, slotName) {
    super(host, slotName, null, { observe: true, multiple: true });
  }

  /**
   * @protected
   * @override
   */
  initAddedNode() {
    this.host.requestUpdate();
  }

  /**
   * @protected
   * @override
   */
  teardownNode() {
    this.host.requestUpdate();
  }
}

/**
 * @polymerMixin
 */
export const SideNavChildrenMixin = (superClass) =>
  class SideNavChildrenMixin extends I18nMixin(DEFAULT_I18N, superClass) {
    static get properties() {
      return {
        /**
         * Count of child items.
         * @protected
         */
        _itemsCount: {
          type: Number,
          value: 0,
        },
      };
    }

    constructor() {
      super();

      this._childrenController = new ChildrenController(this, this._itemsSlotName);
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following structure and default values:
     * ```js
     * {
     *   toggle: 'Toggle child items'
     * }
     * ```
     * @return {!SideNavI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /**
     * List of child items of this component.
     * @protected
     */
    get _items() {
      return this._childrenController.nodes;
    }

    /**
     * Name of the slot to be used for children.
     * @protected
     */
    get _itemsSlotName() {
      return 'children';
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Controller that detects changes to the side-nav items.
      this.addController(this._childrenController);
    }

    /**
     * @protected
     * @override
     */
    willUpdate(props) {
      super.willUpdate(props);

      this._itemsCount = this._items.length;
    }

    /**
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('_itemsCount')) {
        this.toggleAttribute('has-children', this._itemsCount > 0);
      }

      // Propagate i18n object to all the child items
      if (props.has('_itemsCount') || props.has('__effectiveI18n')) {
        this._items.forEach((item) => {
          item.i18n = this.__effectiveI18n;
        });
      }
    }
  };
