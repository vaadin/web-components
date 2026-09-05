/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FormatMixin } from './format-mixin.js';
import {
  formatChunks,
  normalizeFormat,
  rawIndexFromViewIndex,
  unformat,
  viewIndexFromRawIndex,
} from './format-utils.js';

/**
 * A mixin that presents the field value in groups of a fixed length, separated
 * by a delimiter, as the user types. An IBAN presented as `FI21 1234 5600 0007 85`
 * and a phone number presented as `555 123 4567` are the two typical cases.
 *
 * The `value` property stays the unformatted string. The grouped text is written
 * to the input element and mirrored in the read-only `formattedValue` property.
 * With no `formatBlocks` configured the field behaves exactly as an unformatted one.
 *
 * Applies `FormatMixin`, which owns the presentation write path, so the mixin is
 * applied on its own rather than on top of it. Every behavior of this mixin is
 * conditional on its own format properties, so a layer above it can present a
 * format of its own and this one stays out of the way.
 *
 * Requires `InputControlMixin` (or a mixin applying it) below this mixin in the
 * chain. The `beforeinput`, `paste` and `drop` listeners are registered there;
 * without it, the delete intents and paste acceptance are inert and shrink
 * detection falls back to the view-length diff. Formatting on input still works.
 */
const ChunkFormatMixinImplementation = (superclass) =>
  class ChunkFormatMixinClass extends FormatMixin(superclass) {
    /** @private */
    #format = null;

    static get properties() {
      return {
        /**
         * The group lengths for as-you-type chunking, e.g. `[4, 4, 4, 4, 2]` for an
         * IBAN. When unset, the field behaves exactly as an unformatted text field
         * and the other two format properties have no effect. Assign a new array to
         * change the grouping — mutating it in place does not trigger an update.
         *
         * Settable as a JSON attribute: format-blocks='[4,4,4,4,2]'
         *
         * An invalid value is reported with a warning and treated as unset.
         *
         * @type {number[] | undefined}
         */
        formatBlocks: {
          type: Array,
        },

        /**
         * The single character inserted between the groups of `formatBlocks`.
         * Defaults to a space.
         *
         * An invalid value is reported with a warning, and a space is used instead.
         *
         * @attr {string} format-delimiter
         * @type {string | undefined}
         */
        formatDelimiter: {
          type: String,
        },

        /**
         * The case applied to the value, either `'upper'` or `'lower'`. When unset,
         * the value is kept as the user enters it.
         *
         * An invalid value is reported with a warning, and no case is applied.
         *
         * @attr {string} format-text-case
         * @type {string | undefined}
         */
        formatTextCase: {
          type: String,
        },
      };
    }

    /**
     * Override a getter from `FormatMixin` to enable the presentation write path
     * and the live reformat once a valid format is configured.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    get _hasFormat() {
      return Boolean(this.#format);
    }

    /**
     * Override a method from `LitElement` to derive the normalized format before
     * the value observer runs, so that the format properties and a `value` set in
     * the same cycle are presented together.
     *
     * @param {!Object} props
     * @protected
     * @override
     */
    willUpdate(props) {
      super.willUpdate(props);

      if (this.#hasFormatChanged(props)) {
        this.#format = normalizeFormat(this.formatBlocks, this.formatDelimiter, this.formatTextCase);
      }
    }

    /**
     * Override a method from `LitElement` to re-present the value when the format
     * changes, and to reset `formattedValue` when the format is removed.
     *
     * @param {!Object} props
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (this.#hasFormatChanged(props)) {
        this._forwardInputValue(this.value);

        // Once the write site short-circuits on `!_hasFormat`, nothing else would
        // clear the property, so a field that loses its format would keep reporting
        // the last formatted string. The property belongs to the whole chain, so
        // this is the one place that reads `_hasFormat` rather than the format of
        // this layer: a layer above may still be presenting one.
        if (!this._hasFormat) {
          this._setFormattedValue('');
        }
      }
    }

    /**
     * Override a method from `FormatMixin` to group the text entered in the input
     * element, keeping the caret next to the character that the user just typed.
     *
     * @param {Event} event
     * @protected
     * @override
     */
    _formatOnInput(event) {
      if (!this.#format) {
        super._formatOnInput(event);
        return;
      }

      const input = event.composedPath()[0] || this.inputElement;
      const format = this.#format;

      const view = input.value;
      const rawCaret = rawIndexFromViewIndex(view, this.#readCaret(input), format);
      const formatted = formatChunks(unformat(view, format), format).formatted;

      let caret = viewIndexFromRawIndex(formatted, rawCaret, format);

      // Move the caret past a delimiter that the edit has just inserted in front
      // of it, so that the next character lands in the following group.
      if (formatted[caret] === format.delimiter && this.#isInsertIntent(event)) {
        caret += 1;
      }

      // Written even when the text is unchanged, so that `formattedValue` tracks
      // the last keystroke of a group as well. The write site skips the assignment
      // and leaves the caret alone in that case.
      this._presentValue(formatted, caret);
    }

    /**
     * Override a method from `FormatMixin` to widen a deletion that would remove
     * a delimiter, so that Backspace right after one and Delete right before one
     * each remove the user character on its other side instead.
     *
     * @param {InputEvent} event
     * @protected
     * @override
     */
    _onBeforeInput(event) {
      // Called first, so that the core has recorded the intent before the edit
      // below dispatches its own `input` event.
      super._onBeforeInput(event);

      // Rejecting an edit and performing it by hand are two different decisions,
      // so an edit that a layer below has already dropped is left alone here. The
      // widening below is this layer's own behavior, so it is conditional on this
      // layer's own format rather than on the one that `_hasFormat` reports for
      // the whole chain.
      if (event.defaultPrevented || !this.#format) {
        return;
      }

      const input = event.composedPath()[0];
      const { selectionStart, selectionEnd, value: view } = input;

      // A selection is deleted as a whole, so there is no adjacent delimiter to
      // widen over.
      if (selectionStart !== selectionEnd) {
        return;
      }

      const { delimiter } = this.#format;
      let start, end;

      if (event.inputType === 'deleteContentBackward' && view[selectionStart - 1] === delimiter) {
        start = selectionStart - 2;
        end = selectionStart;
      } else if (event.inputType === 'deleteContentForward' && view[selectionStart] === delimiter) {
        start = selectionStart;
        end = selectionStart + 2;
      } else {
        return;
      }

      // A delimiter with no user character on its other side, which only a
      // hand-written value can produce, is deleted on its own as it is.
      if (start < 0 || end > view.length) {
        return;
      }

      event.preventDefault();
      this.#deleteRange(input, start, end);
    }

    /**
     * Override a method from `InputControlMixin` to test the unformatted text
     * against `allowedCharPattern`, so that pasting or dropping an already
     * grouped string is accepted by a pattern that does not allow the delimiter.
     * The same predicate backs the `paste`, `drop` and `beforeinput` entry
     * points, so the three can never disagree about one piece of text.
     *
     * Unformatting also applies the configured `case`, so `fi21 1234` under
     * `case: 'upper'` is tested as `FI211234`. That is intended: the case is
     * applied on the way to `value`, so the pattern is tested against the text
     * that the field actually stores.
     *
     * The `super` method is called defensively, since the control layer that
     * declares it sits below this mixin and is optional. Without it there is no
     * pattern to test against, so the text is accepted.
     *
     * @param {string} text
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldAcceptText(text) {
      const candidate = this.#format ? unformat(text, this.#format) : text;
      return super._shouldAcceptText?.(candidate) ?? true;
    }

    /**
     * Override a method from `FormatMixin` to keep the caret at the same position
     * in the unformatted value across a write that did not come from the user,
     * most notably a programmatic `value` set while the field is focused.
     *
     * @param {HTMLElement} input
     * @param {string} text
     * @return {number | undefined}
     * @protected
     * @override
     */
    _mapCaretToPresentedValue(input, text) {
      if (!this.#format) {
        return undefined;
      }

      const caret = input.selectionStart;
      if (typeof caret !== 'number') {
        return undefined;
      }

      // The input element still holds the text that is about to be replaced, so
      // the caret is anchored against it before the write happens.
      const rawCaret = rawIndexFromViewIndex(input.value, caret, this.#format);
      return viewIndexFromRawIndex(text, rawCaret, this.#format);
    }

    /**
     * Override a method from `InputMixin` to strip the delimiters from the text
     * entered in the input element, so that `value` carries the unformatted string.
     *
     * @param {string} viewValue
     * @param {Event} event
     * @return {string}
     * @protected
     * @override
     */
    _modelValueFromInput(viewValue, event) {
      if (!this.#format) {
        return super._modelValueFromInput(viewValue, event);
      }

      return unformat(viewValue, this.#format);
    }

    /**
     * Override a method from `InputMixin` to group the model value before it is
     * written to the input element.
     *
     * @param {string} value
     * @return {string}
     * @protected
     * @override
     */
    _inputValueFromModel(value) {
      if (!this.#format) {
        return super._inputValueFromModel(value);
      }

      return formatChunks(unformat(value, this.#format), this.#format).formatted;
    }

    /**
     * Returns true when any of the three format properties changed in the update
     * cycle that the given changed properties describe.
     *
     * @private
     */
    #hasFormatChanged(props) {
      return props.has('formatBlocks') || props.has('formatDelimiter') || props.has('formatTextCase');
    }

    /**
     * Returns true when the given event describes an edit that inserts text. An
     * event that carries no `inputType`, such as a synthetic `input` event or the
     * `compositionend` event, is treated as an insert, since the reformat only
     * runs for edits that are not deletions.
     *
     * @private
     */
    #isInsertIntent(event) {
      const { inputType } = event;
      return inputType === undefined || inputType.startsWith('insert');
    }

    /**
     * Removes the given range from the presented text, regroups what is left and
     * keeps the caret at the same position in the unformatted value.
     *
     * The regrouped text is a script write, so the deletion is not kept in the
     * native undo stack. Preserving undo across live formatting is a recorded
     * follow-up rather than a property of this prototype.
     *
     * @private
     */
    #deleteRange(input, start, end) {
      const before = input.value;
      const format = this.#format;
      const raw = unformat(before.slice(0, start) + before.slice(end), format);
      const formatted = formatChunks(raw, format).formatted;
      const caret = viewIndexFromRawIndex(formatted, rawIndexFromViewIndex(before, start, format), format);

      this._presentValue(formatted, caret);

      // The prevented edit dispatched nothing, so the model value is updated
      // through the regular input path, which sets `value` and fires
      // `value-changed` exactly once. The re-presentation that path performs
      // for an untrusted event finds the text already in place and writes nothing.
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    /**
     * Returns the caret index of the input element, falling back to the end of
     * the text for an input type that exposes no selection.
     *
     * @private
     */
    #readCaret(input) {
      const caret = input.selectionStart;
      return typeof caret === 'number' ? caret : input.value.length;
    }
  };

export const ChunkFormatMixin = dedupeMixin(ChunkFormatMixinImplementation);
