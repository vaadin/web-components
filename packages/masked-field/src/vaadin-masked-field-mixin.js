/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputFormatMixin } from './input-format-mixin.js';

// The constraints that a configured format takes away from the input element and
// matches against the unformatted `value` instead.
const FORMAT_CONSTRAINTS = ['maxlength', 'minlength', 'pattern'];

/**
 * A mixin providing the format properties and format-aware constraint validation
 * for `<vaadin-masked-field>`.
 */
export const MaskedFieldMixin = (superClass) =>
  class MaskedFieldMixinClass extends InputFormatMixin(superClass) {
    /** @private */
    #previousFormatKey = null;

    /**
     * Override a method from `InputConstraintsMixin` to match `maxlength`,
     * `minlength` and `pattern` against the unformatted `value` while a format
     * is configured. Those attributes are then not on the input element, so the
     * native constraint validation would otherwise not run them at all, and it
     * would run them against the presented value if they were.
     *
     * @return {boolean}
     * @override
     */
    checkValidity() {
      if (!this._hasFormat) {
        return super.checkValidity();
      }

      // A readonly or disabled control is barred from constraint validation and
      // always reports valid, exactly as a native input does.
      if (this.readonly || this.disabled) {
        return true;
      }

      const value = this.value ?? '';

      if (this.required && value === '') {
        return false;
      }

      // An empty value satisfies `minlength` and `pattern` natively, which only
      // ever fail a value the user has actually entered.
      if (this.minlength != null && value !== '' && value.length < this.minlength) {
        return false;
      }

      if (this.maxlength != null && value.length > this.maxlength) {
        return false;
      }

      if (this.pattern && value !== '') {
        try {
          if (!new RegExp(`^(?:${this.pattern})$`, 'u').test(value)) {
            return false;
          }
        } catch {
          // A pattern that does not compile is ignored, the same way the browser
          // ignores an invalid `pattern` attribute.
        }
      }

      return true;
    }

    /**
     * Override a method from `DelegateStateMixin` to stop delegating the length
     * and pattern constraints while a format is configured. Left on the input
     * element, `maxlength` would block typing before the last group is finished,
     * and `pattern` would be matched against the text with its delimiters.
     *
     * @param {string} name
     * @param {unknown} value
     * @protected
     * @override
     */
    _delegateAttribute(name, value) {
      if (this._hasFormat && FORMAT_CONSTRAINTS.includes(name)) {
        super._delegateAttribute(name, null);
        return;
      }

      super._delegateAttribute(name, value);
    }

    /**
     * Override a method from `InputConstraintsMixin` to also observe the format
     * properties. They change what the length and pattern constraints are matched
     * against without being constraints themselves, so a field that already has a
     * value or is already invalid has to be validated again when the format is set
     * or removed.
     *
     * @protected
     * @override
     */
    _createConstraintsObserver() {
      super._createConstraintsObserver();

      this._createMethodObserver(
        '__formatConstraintsChanged(stateTarget, formatBlocks, formatDelimiter, formatTextCase, formatMask)',
      );
    }

    /** @private */
    __formatConstraintsChanged(stateTarget, formatBlocks, formatDelimiter, formatTextCase, formatMask) {
      if (!stateTarget) {
        return;
      }

      // The four properties are compared as one JSON key rather than by identity,
      // so that a new array holding the same blocks is not read as a change, and
      // the key is `null` while no format is configured, which is the state the
      // field starts in.
      const hasFormat = Boolean(formatMask || formatBlocks);
      const formatKey = hasFormat ? JSON.stringify([formatMask, formatBlocks, formatDelimiter, formatTextCase]) : null;

      // The observer also runs when the state target is set, which is when the
      // constraints are delegated for the first time anyway. Only a format that
      // has actually changed asks for anything to be done again.
      const hasFormatChanged = formatKey !== this.#previousFormatKey;
      this.#previousFormatKey = formatKey;

      if (!hasFormatChanged) {
        return;
      }

      this.#ensureFormatConstraintsDelegated();

      if (this._hasValue || this.invalid) {
        this._requestValidation();
      }
    }

    /**
     * Re-delegates the constraints that the format gates. Their own values have
     * not changed, so the observer that normally delegates them does not run.
     *
     * @private
     */
    #ensureFormatConstraintsDelegated() {
      FORMAT_CONSTRAINTS.forEach((name) => {
        this._delegateAttribute(name, this[name]);
      });
    }
  };
