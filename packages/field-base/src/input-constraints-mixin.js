/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DelegateInputStateMixin } from './delegate-input-state-mixin.js';

const InputConstraintsMixinImplementation = (superclass) =>
  class InputConstraintsMixinClass extends DelegateInputStateMixin(superclass) {
    /**
     * An array of attributes which participate in the input validation.
     * Changing these attributes will cause the input to re-validate.
     *
     * IMPORTANT: The attributes should be properly delegated to the input element from the host
     * which can be achieved by listing them in the list of delegated attributes (see `DelegateStateMixin.delegateAttrs`).
     * Otherwise, the input validation will not work correctly.
     *
     * Note, the `required` attribute is already delegated in the parent `DelegateInputStateMixin`.
     */
    static get constraints() {
      return ['required'];
    }

    /** @protected */
    ready() {
      super.ready();

      this._createConstraintsObserver();
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (this.inputElement && this.constructor.constraints.some((c) => this.__isValidConstraint(this[c]))) {
        return this.inputElement.checkValidity();
      } else {
        return !this.invalid;
      }
    }

    /**
     * Override this method to customize setting up constraints observer.
     * @protected
     */
    _createConstraintsObserver() {
      // This complex observer needs to be added dynamically instead of using `static get observers()`
      // to make it possible to tweak this behavior in classes that apply this mixin.
      this._createMethodObserver(`_constraintsChanged(${this.constructor.constraints.join(', ')})`);
    }

    /**
     * Override this method to implement custom validation constraints.
     * @param {unknown[]} constraints
     * @protected
     */
    _constraintsChanged(...constraints) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (constraints.some((c) => this.__isValidConstraint(c))) {
        this.validate();
      } else {
        this.invalid = false;
      }
    }

    /**
     * Override an event listener inherited from `InputMixin`
     * to capture native `change` event and make sure that
     * a new one is dispatched after validation runs.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      event.stopImmediatePropagation();

      this.validate();

      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            sourceEvent: event
          },
          bubbles: event.bubbles,
          cancelable: event.cancelable
        })
      );
    }

    /** @private */
    __isValidConstraint(constraint) {
      // 0 is valid for `minlength` and `maxlength`
      return Boolean(constraint) || constraint === 0;
    }
  };

/**
 * A mixin to combine multiple input validation constraints.
 */
export const InputConstraintsMixin = dedupingMixin(InputConstraintsMixinImplementation);
