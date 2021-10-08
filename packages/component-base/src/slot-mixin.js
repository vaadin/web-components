/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * A mixin to provide content for named slots defined by component.
 *
 * @polymerMixin
 */
export const SlotMixin = dedupingMixin(
  (superclass) =>
    class SlotMixinClass extends superclass {
      /**
       * List of named slots to initialize.
       * @protected
       */
      get slots() {
        return {};
      }

      /** @protected */
      ready() {
        super.ready();
        this._connectSlotMixin();
      }

      /** @private */
      _connectSlotMixin() {
        Object.keys(this.slots).forEach((slotName) => {
          // Ignore labels of nested components, if any
          const hasContent = this._getDirectSlotChild(slotName) !== undefined;

          if (!hasContent) {
            const slotFactory = this.slots[slotName];
            const slotContent = slotFactory();
            if (slotContent instanceof Element) {
              slotContent.setAttribute('slot', slotName);
              this.appendChild(slotContent);
            }
          }
        });
      }

      /** @protected */
      _getDirectSlotChild(slotName) {
        return Array.from(this.children).find((el) => el.slot === slotName);
      }
    }
);
