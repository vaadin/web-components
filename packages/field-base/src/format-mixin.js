/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { InputMixin } from './input-mixin.js';

// Marks a `_presentValue` call that passed no caret index, as opposed to no
// `_presentValue` call being in flight at all. The two cases differ: the first
// leaves the caret alone, the second asks `_mapCaretToPresentedValue` for it.
const SKIP_CARET = Symbol('skip-caret');

/**
 * A mixin that provides the machinery for presenting the field value in another
 * form than the one stored in the `value` property.
 *
 * The mixin defines no format of its own. It owns the presentation write path
 * and the read-only `formattedValue` property, and exposes protected seams that
 * a layer above implements to decide when a reformat runs and what the presented
 * text is. Without such a layer `_hasFormat` stays `false`, `formattedValue`
 * stays empty, and the field behaves exactly as an unformatted one.
 *
 * Requires `InputControlMixin` (or a mixin applying it) below this mixin in the
 * chain. The `beforeinput`, `paste` and `drop` listeners are registered there;
 * without it, the delete intents and paste acceptance are inert and shrink
 * detection falls back to the view-length diff. Formatting on input still works.
 */
const FormatMixinImplementation = (superclass) =>
  class FormatMixinClass extends InputMixin(superclass) {
    /** @private */
    #caretIntent;

    /** @private */
    #composing = false;

    /** @private */
    #lastInputType;

    /** @private */
    #prevViewValue = '';

    static get properties() {
      return {
        /**
         * Empty unless a format is configured. When one is, the value as presented in
         * the input element, with delimiters applied. Set `value` (the unformatted
         * model value) to change it; the `formatted-value` attribute is not a write
         * channel.
         */
        formattedValue: {
          type: String,
          value: '',
          readOnly: true,
        },
      };
    }

    /**
     * Returns true when a format is configured, which enables the presentation
     * write path and the live reformat. Override in a layer that presents the
     * value in another form than the model value.
     *
     * @return {boolean}
     * @protected
     */
    get _hasFormat() {
      return false;
    }

    /**
     * Override a getter from `InputMixin` to keep it paired with the setter
     * below. A class that declares only the setter shadows the inherited getter
     * into `undefined`.
     *
     * @return {string}
     * @protected
     * @override
     */
    get _inputElementValue() {
      return super._inputElementValue;
    }

    /**
     * Override a setter from `InputMixin` to make the write idempotent, keep the
     * caret in place, and keep `formattedValue` in sync on every write path.
     *
     * Without a format the write is a plain passthrough, so an unformatted field
     * behaves exactly as it does without this mixin.
     *
     * @protected
     * @override
     */
    set _inputElementValue(value) {
      // The intent is scoped to the write that follows it, so it is consumed
      // even by a write that takes the passthrough branch below. Otherwise it
      // would outlive its write and be applied to an unrelated one.
      const intent = this.#caretIntent;
      this.#caretIntent = undefined;

      const input = this.inputElement;
      if (!this._hasFormat || !input) {
        super._inputElementValue = value;
        return;
      }

      if (input[this._inputElementValueProperty] === value) {
        // Writing the same string collapses the selection, so the write is
        // skipped altogether rather than followed by a caret restore.
        this._setFormattedValue(value);
        this.#prevViewValue = value;
        return;
      }

      let caret;
      if (typeof intent === 'number') {
        caret = intent;
      } else if (intent !== SKIP_CARET) {
        caret = this._mapCaretToPresentedValue(input, value);
      }

      super._inputElementValue = value;

      if (caret !== undefined) {
        this.#restoreCaret(input, caret);
      }

      this._setFormattedValue(value);
      this.#prevViewValue = value;
    }

    /**
     * Returns true when a live reformat should run for this input event.
     * Override to format on commit instead of on input; the write site stays
     * reachable through `_presentValue`.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldFormatOnInput(event) {
      if (!this._hasFormat || this.#composing) {
        return false;
      }
      return !this.#isDeleteIntent(event);
    }

    /**
     * Presents the text entered in the input element in its formatted form.
     * The default implementation does nothing. Override in a layer that defines
     * a format, and write the result through `_presentValue`.
     *
     * @param {Event} _event
     * @protected
     */
    _formatOnInput(_event) {}

    /**
     * Writes presentation text to the input element.
     *
     * Pass `caret` to restore the caret to that index. Omit it to leave the caret
     * wherever writing the text puts it, which is what a formatter that only runs
     * on commit wants. Either way the caret is left alone when no format is
     * configured.
     *
     * @param {string} text
     * @param {number} [caret]
     * @protected
     */
    _presentValue(text, caret) {
      this.#caretIntent = caret === undefined ? SKIP_CARET : caret;
      this._inputElementValue = text;
    }

    /**
     * Returns the caret index to restore after a presentation write that did not
     * come through `_presentValue`, or `undefined` to leave the caret alone.
     * The default implementation maps no caret. Override in a layer whose presented
     * text differs in length from the model value.
     *
     * @param {HTMLElement} _input
     * @param {string} _text
     * @return {number | undefined}
     * @protected
     */
    _mapCaretToPresentedValue(_input, _text) {
      return undefined;
    }

    /**
     * Override a method from `InputMixin` so that the presentation layer can
     * register its own listeners on the input element.
     *
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _addInputListeners(input) {
      super._addInputListeners(input);
    }

    /**
     * Override a method from `InputMixin` so that the presentation layer can
     * remove the listeners it registered in `_addInputListeners`.
     *
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _removeInputListeners(input) {
      super._removeInputListeners(input);
    }

    /**
     * Override a method from `InputControlMixin` so that the presentation layer
     * can inspect an edit before it is applied. The `super` method is called
     * defensively, since the control layer that registers the `beforeinput`
     * listener sits below this mixin and is optional.
     *
     * @param {InputEvent} event
     * @protected
     * @override
     */
    _onBeforeInput(event) {
      super._onBeforeInput?.(event);
    }

    /**
     * Override a method from `InputMixin` so that the presentation layer can
     * update the presented text before the model value is set, keeping
     * `formattedValue` current when `value-changed` fires.
     *
     * @param {Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      super._onInput(event);
    }

    /**
     * Returns true when the edit that caused the given input event removes
     * characters, in which case no reformat runs.
     *
     * The primary signal is the `inputType` recorded in `beforeinput`. Synthetic
     * input events carry none, and are classified by a view-length diff instead.
     *
     * @private
     */
    #isDeleteIntent(event) {
      if (this.#lastInputType !== undefined) {
        return this.#lastInputType.startsWith('delete');
      }

      const input = event.composedPath()[0];
      return !!input && input.value.length < this.#prevViewValue.length;
    }

    /**
     * Places the caret of the input element at the given index. Only runs on the
     * focused element, since assigning `selectionStart` moves focus in Safari,
     * and tolerates input types that throw on selection access.
     *
     * @private
     */
    #restoreCaret(input, caret) {
      if (!input || !isElementFocused(input)) {
        return;
      }

      try {
        input.selectionStart = caret;
        input.selectionEnd = caret;
      } catch {
        // Some input types have no selection API. Leave the caret as it is.
      }
    }
  };

export const FormatMixin = dedupeMixin(FormatMixinImplementation);
