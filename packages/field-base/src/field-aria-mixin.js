/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { HelperTextMixin } from './helper-text-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

const FieldAriaMixinImplementation = (superclass) =>
  class FieldAriaMixinClass extends HelperTextMixin(ValidateMixin(superclass)) {
    /** @protected */
    get _ariaTarget() {
      return this;
    }

    /** @protected */
    get _ariaAttr() {
      return 'aria-describedby';
    }

    static get observers() {
      return ['__ariaChanged(invalid, _helperId)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this._updateAriaAttribute(this.invalid, this._helperId);
    }

    /** @protected */
    _updateAriaAttribute(invalid, helperId) {
      const attr = this._ariaAttr;

      if (this._ariaTarget && attr) {
        // For groups, add all IDs to aria-labelledby rather than aria-describedby -
        // that should guarantee that it's announced when the group is entered.
        const ariaIds = attr === 'aria-describedby' ? [helperId] : [this._labelId, helperId];

        // Error message ID needs to be dynamically added / removed based on the validity
        // Otherwise assistive technologies would announce the error, even if we hide it.
        if (invalid) {
          ariaIds.push(this._errorId);
        }

        this._ariaTarget.setAttribute(attr, ariaIds.join(' '));
      }
    }

    /** @private */
    __ariaChanged(invalid, helperId) {
      this._updateAriaAttribute(invalid, helperId);
    }
  };

/**
 * A mixin to handle field ARIA attributes based on the label, error message and helper text.
 */
export const FieldAriaMixin = dedupingMixin(FieldAriaMixinImplementation);
