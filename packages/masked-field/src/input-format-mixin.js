/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { chunkMaskFor } from './chunk-mask.js';
import { FormatMixin } from './format-mixin.js';
import {
  applyTextCase,
  calibrate,
  compileMask,
  deleteRange,
  insertText,
  isDigitSlot,
  maskedIndex,
  maximalOf,
  reconstructEdit,
  unmask,
  unmaskedIndex,
  validateWithMask,
} from './mask-utils.js';

const DEFAULT_DELIMITER = ' ';

/**
 * A mixin that presents the field value in another form than the one stored in
 * `value`, as the user types: an IBAN presented as `FI21 1234 5600 0007 85`, a
 * phone number presented as `+1 (555) 123-4567`.
 *
 * A format is defined in one of two ways:
 *
 * - `formatMask` lays the value out with a pattern of slots and fixed characters,
 *   for example `'+1 (000) 000-0000'`.
 * - `formatBlocks`, `formatDelimiter` and `formatTextCase` group the value into
 *   blocks of a fixed length, for example `[4, 4, 4, 4, 2]` for an IBAN.
 *
 * Setting both is reported with a warning, and `formatMask` is the one applied.
 * With neither of them set the field behaves exactly as an unformatted one.
 *
 * The `value` property stays the string the user entered, without the characters
 * that the format inserts. The presented text is written to the input element and
 * mirrored in the read-only `formattedValue` property. A value that the format
 * cannot lay out in full is kept as it is, and only the part that fits is shown.
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
const InputFormatMixinImplementation = (superclass) =>
  class InputFormatMixinClass extends FormatMixin(superclass) {
    /** @private */
    #mask = null;

    /** @private */
    #prompt;

    static get properties() {
      return {
        /**
         * The group lengths for as-you-type chunking, e.g. `[4, 4, 4, 4, 2]` for an
         * IBAN. When unset, the field behaves exactly as an unformatted text field
         * and the other two chunking properties have no effect. Assign a new array
         * to change the grouping — mutating it in place does not trigger an update.
         *
         * Settable as a JSON attribute: format-blocks='[4,4,4,4,2]'
         *
         * Ignored while `formatMask` is set.
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

        /**
         * The pattern that the value is laid out with, e.g. `'+1 (000) 000-0000'`
         * for a US phone number. Each character of the pattern is either a slot
         * that the user fills or a character that the field inserts:
         *
         * - `0` any digit, stored as the ASCII digit
         * - `a` any letter
         * - `*` any character
         * - `[…]` an optional section at the end of the mask, shown once the user
         *   types into it, e.g. `'00000[-0000]'`
         * - `\x` the character `x` itself, e.g. `\0` for a literal zero
         * - every other character is inserted as it is
         *
         * Takes precedence over `formatBlocks`, which is then ignored with a
         * warning. Unlike the blocks, a mask is a fixed length: characters past
         * its last slot are dropped.
         *
         * An invalid value is reported with a warning and treated as unset.
         *
         * @attr {string} format-mask
         * @type {string | undefined}
         */
        formatMask: {
          type: String,
        },

        /**
         * A character shown in place of every slot the user has not filled yet,
         * e.g. `'_'`, laid out after the text the user entered so that the
         * remaining shape of the mask is visible.
         *
         * Only meaningful with `formatMask`; a format defined with `formatBlocks`
         * has no fixed shape to show. Unset, nothing is shown.
         *
         * An invalid value is reported with a warning and treated as unset.
         *
         * @attr {string} format-prompt
         * @type {string | undefined}
         */
        formatPrompt: {
          type: String,
        },

        /**
         * When true and a `formatMask` is set, a value that does not fill the mask
         * makes the field invalid. Checked on commit, like the other constraints,
         * so an incomplete value is reported when the user leaves the field, not
         * while typing.
         *
         * Has no effect with `formatBlocks`, which has no fixed length to fill, and
         * an empty value is left to `required`.
         *
         * @attr {boolean} format-completion-required
         * @type {boolean}
         */
        formatCompletionRequired: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
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
      return Boolean(this.#mask);
    }

    /**
     * The `inputmode` that the configured format implies, `'numeric'` for a mask
     * whose every slot is a digit, `undefined` otherwise. Derived from the mask's
     * maximal expansion, so it does not change while the user types.
     *
     * @return {string | undefined}
     * @protected
     */
    get _formatInputMode() {
      const maximal = maximalOf(this.#mask);

      if (!maximal) {
        return undefined;
      }

      const slots = maximal.items.filter((item) => typeof item !== 'string');

      return slots.length > 0 && slots.every(isDigitSlot) ? 'numeric' : undefined;
    }

    /**
     * The remainder of the mask that lays out the presented text, past the text
     * itself, with every slot the user has not filled yet shown as `formatPrompt`.
     * That is the part of the shape that is still to come, e.g. `-__` for a
     * `'00000[-0000]'` mask presenting `12345-6`.
     *
     * Empty when no prompt is configured, when the resolved mask is full, and for
     * a format that has no fixed shape to show, that is one defined with
     * `formatBlocks`.
     *
     * @return {string}
     * @protected
     */
    get _formatPromptRemainder() {
      // A format whose mask grows with the value has no maximal expansion, so
      // there is no shape past the text to show.
      if (!this.#prompt || !maximalOf(this.#mask)) {
        return '';
      }

      const view = this.formattedValue ?? '';
      const { items } = this.#resolveMask(view);

      return items
        .slice(view.length)
        .map((item) => (typeof item === 'string' ? item : this.#prompt))
        .join('');
    }

    /**
     * Override a method from `LitElement` to compile the format before the value
     * observer runs, so that the format properties and a `value` set in the same
     * cycle are presented together.
     *
     * @param {!Object} props
     * @protected
     * @override
     */
    willUpdate(props) {
      super.willUpdate(props);

      if (this.#hasFormatChanged(props)) {
        this.#mask = this.#compileFormat();
      }

      // Cached rather than normalized on read, so that an invalid value is
      // reported once per change instead of once per render.
      if (props.has('formatPrompt')) {
        this.#prompt = this.#normalizePrompt();
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
        // the last presented string. The property belongs to the whole chain, so
        // this is the one place that reads `_hasFormat` rather than the format of
        // this layer: a layer above may still be presenting one.
        if (!this._hasFormat) {
          this._setFormattedValue('');
        }
      }
    }

    /**
     * Override a method from `FormatMixin` to lay the text out again after a
     * deletion as well. The presentation is positional, so the characters that a
     * deletion leaves behind no longer line up with the characters that the format
     * inserts, and have to be laid out again.
     *
     * @param {Event} _event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldFormatOnDelete(_event) {
      return Boolean(this.#mask);
    }

    /**
     * Override a method from `FormatMixin` to lay out the text entered in the input
     * element, keeping the caret next to the character that the user just edited.
     *
     * The edit is reconstructed against the state that the input element was in
     * before it, and replayed on the value without the characters that the format
     * inserts, so that those flow around the edit instead of staying where they
     * were. An edit that cannot be reconstructed, such as an autofill that fires no
     * `beforeinput` event, is handled by laying out whatever the input element now
     * holds.
     *
     * @param {Event} event
     * @protected
     * @override
     */
    _formatOnInput(event) {
      if (!this.#mask) {
        super._formatOnInput(event);
        return;
      }

      const input = event.composedPath()[0] || this.inputElement;
      const caret = this.#readCaret(input);
      const next = { value: input.value, selection: [caret, caret] };
      const prev = this._prevState;
      const { start, end, data } = reconstructEdit(prev, next);

      let state = null;

      if (data !== '') {
        state = insertText({ value: prev.value, selection: [start, end] }, data, this.#mask);

        // Typing a character that the format inserts itself is not an error, so the
        // rejection is only reported when the text held something else as well.
        // The control layer that owns the attribute is optional, as it is for
        // `_shouldAcceptText` below.
        if (state === null && this.#hasUserCharacter(data)) {
          this._markInputPrevented?.();
        }
      } else if (end > start) {
        // A deletion that started from a selection removes exactly what was
        // selected, so a selection holding nothing but characters that the format
        // inserts leaves the value alone and only lays the text out again. A
        // deletion that started from a caret removes the character on the other
        // side of them instead, which is the same widening that `_onBeforeInput`
        // applies for the input types it can recognize.
        const isCollapsed = prev.selection[0] === prev.selection[1];

        state = deleteRange(prev, [start, end], this.#mask, {
          literals: isCollapsed ? 'widen' : 'hop',
          forward: this.#isForwardDelete(event),
        });
      }

      if (state === null) {
        const raw = unmask(next, this.#mask);
        state = calibrate(raw, this.#mask, { raw: true });
      }

      // Written even when the text is unchanged, so that `formattedValue` tracks
      // the last keystroke of a group as well. The write site skips the assignment
      // and leaves the caret alone in that case.
      this._presentValue(state.value, state.selection[1]);
    }

    /**
     * Override a method from `FormatMixin` to widen a deletion that would remove a
     * character that the format inserts, so that Backspace right after one and
     * Delete right before one each remove the character on its other side instead.
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
      if (event.defaultPrevented || !this.#mask) {
        return;
      }

      const input = event.composedPath()[0];
      const { selectionStart, selectionEnd, value: view } = input;

      // A selection is deleted as a whole, so there is no adjacent character of the
      // format to widen over.
      if (selectionStart !== selectionEnd) {
        return;
      }

      const forward = event.inputType === 'deleteContentForward';
      const backward = event.inputType === 'deleteContentBackward';

      if (!forward && !backward) {
        return;
      }

      const index = backward ? selectionStart - 1 : selectionStart;
      const { items } = this.#resolveMask(view);

      if (typeof items[index] !== 'string' || items[index] !== view[index]) {
        return;
      }

      const range = backward ? [index, selectionStart] : [selectionStart, index + 1];
      const state = deleteRange({ value: view, selection: [selectionStart, selectionStart] }, range, this.#mask, {
        literals: 'widen',
        forward,
      });

      // A character of the format with nothing on its other side to remove instead,
      // which only a hand-written value can produce, is left to the browser.
      if (state.value === view) {
        return;
      }

      event.preventDefault();
      this.#applyEdit(input, state);
    }

    /**
     * Override a method from `InputControlMixin` to test the text against
     * `allowedCharPattern` without the characters that the format inserts, so that
     * pasting or dropping an already formatted string is accepted by a pattern that
     * does not allow them. The same predicate backs the `paste`, `drop` and
     * `beforeinput` entry points, so the three can never disagree about one piece
     * of text.
     *
     * The text is a fragment with no index alignment, so the characters are matched
     * against the set of every character that the format inserts anywhere rather
     * than against the position they would land in.
     *
     * The configured case is applied as well, so `fi21 1234` under
     * `formatTextCase="upper"` is tested as `FI211234`. That is intended: the case
     * is applied on the way to `value`, so the pattern is tested against the text
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
      let candidate = text;

      if (this.#mask) {
        const { literalChars, textCase } = this.#resolveMask(text);
        candidate = applyTextCase(
          text
            .split('')
            .filter((char) => !literalChars.has(char))
            .join(''),
          textCase,
        );
      }

      return super._shouldAcceptText?.(candidate) ?? true;
    }

    /**
     * Override a method from `FormatMixin` to keep the caret next to the same
     * character of the value across a write that did not come from the user, most
     * notably a programmatic `value` set while the field is focused.
     *
     * The index is counted rather than matched by position, so that it also survives
     * a format that changes while the field is focused, where the character sits at
     * a different index before and after the write.
     *
     * @param {HTMLElement} input
     * @param {string} text
     * @return {number | undefined}
     * @protected
     * @override
     */
    _mapCaretToPresentedValue(input, text) {
      if (!this.#mask) {
        return undefined;
      }

      const caret = input.selectionStart;
      if (typeof caret !== 'number') {
        return undefined;
      }

      // The input element still holds the text that is about to be replaced, so
      // the caret is anchored against it before the write happens.
      return maskedIndex(text, this.#mask, unmaskedIndex(input.value, this.#mask, caret));
    }

    /**
     * Override a method from `InputMixin` to remove the characters that the format
     * inserts from the text entered in the input element, so that `value` carries
     * only what the user entered.
     *
     * @param {string} viewValue
     * @param {Event} event
     * @return {string}
     * @protected
     * @override
     */
    _modelValueFromInput(viewValue, event) {
      if (!this.#mask) {
        return super._modelValueFromInput(viewValue, event);
      }

      // The case is applied here as well as by the layout, since the text is taken
      // as it is while an IME session is in flight and no layout runs for it.
      return applyTextCase(unmask(viewValue, this.#mask), this.#resolveMask(viewValue).textCase);
    }

    /**
     * Override a method from `InputMixin` to lay the model value out before it is
     * written to the input element.
     *
     * The value is taken as one that holds none of the characters that the format
     * inserts, so a character equal to one of them is a character of its own rather
     * than one the format placed. A value that the format cannot lay out in full is
     * reported with a warning: the value is kept as it was assigned, and the input
     * element shows the part of it that fits.
     *
     * @param {string} value
     * @return {string}
     * @protected
     * @override
     */
    _inputValueFromModel(value) {
      if (!this.#mask) {
        return super._inputValueFromModel(value);
      }

      const presented = calibrate({ value, selection: [0, 0] }, this.#mask, { raw: true }).value;

      if (!this.#roundTrips(presented, value)) {
        issueWarning(
          `The value "${value}" does not fit the configured format. Keeping the value and presenting "${presented}".`,
        );
      }

      return presented;
    }

    /**
     * Returns whether the value fills the configured mask, which is what
     * `formatCompletionRequired` makes a constraint.
     *
     * A field with no `formatMask` reports complete: `formatBlocks` has no fixed
     * length to fill, so there is nothing for the value to be short of, and a mask
     * that did not compile is treated as unset everywhere else as well.
     *
     * @return {boolean}
     * @protected
     */
    _isFormatComplete() {
      if (!this.formatMask || !this.#mask) {
        return true;
      }

      // The presented text filling the mask is not enough on its own: a value that
      // the mask cannot lay out in full is kept and only partly shown, so a longer
      // value can present as a text that fills the mask exactly.
      return (
        validateWithMask(this.formattedValue, this.#mask) && this.#roundTrips(this.formattedValue, this.value ?? '')
      );
    }

    /**
     * Returns true when any of the four format properties changed in the update
     * cycle that the given changed properties describe.
     *
     * @private
     */
    #hasFormatChanged(props) {
      return (
        props.has('formatBlocks') ||
        props.has('formatDelimiter') ||
        props.has('formatTextCase') ||
        props.has('formatMask')
      );
    }

    /**
     * Returns the mask expression for the configured format properties, or `null`
     * when no valid format is configured. Each property is validated on its own, so
     * that one invalid value does not take the others down with it.
     *
     * @private
     */
    #compileFormat() {
      const { formatMask, formatBlocks } = this;
      const hasMask = formatMask !== undefined && formatMask !== null && formatMask !== '';
      const hasBlocks = formatBlocks !== undefined && formatBlocks !== null;

      if (!hasMask && !hasBlocks) {
        return null;
      }

      if (hasMask && hasBlocks) {
        issueWarning('Both "formatMask" and "formatBlocks" are set. Using "formatMask" and ignoring "formatBlocks".');
      }

      if (hasMask) {
        return compileMask(formatMask, { textCase: this.#normalizeTextCase() });
      }

      const blocks = this.#normalizeBlocks();
      if (!blocks) {
        return null;
      }

      return chunkMaskFor({
        blocks,
        delimiter: this.#normalizeDelimiter(),
        textCase: this.#normalizeTextCase(),
      });
    }

    /**
     * Returns a copy of the configured blocks, or `null` with a warning when they
     * are not a non-empty array of positive integers.
     *
     * @private
     */
    #normalizeBlocks() {
      const blocks = this.formatBlocks;

      if (
        !Array.isArray(blocks) ||
        blocks.length === 0 ||
        !blocks.every((block) => Number.isInteger(block) && block > 0)
      ) {
        issueWarning('Invalid "formatBlocks": must be a non-empty array of positive integers. Ignoring the format.');
        return null;
      }

      return [...blocks];
    }

    /**
     * Returns the configured delimiter, or a space with a warning when it is not a
     * single character.
     *
     * @private
     */
    #normalizeDelimiter() {
      const delimiter = this.formatDelimiter;

      if (delimiter === undefined || delimiter === null) {
        return DEFAULT_DELIMITER;
      }

      if (typeof delimiter === 'string' && delimiter.length === 1) {
        return delimiter;
      }

      issueWarning('Invalid "formatDelimiter": must be a single character. Using a space instead.');
      return DEFAULT_DELIMITER;
    }

    /**
     * Returns the configured text case, or `undefined` with a warning when it is
     * neither `'upper'` nor `'lower'`.
     *
     * @private
     */
    #normalizeTextCase() {
      const textCase = this.formatTextCase;

      if (textCase === undefined || textCase === null) {
        return undefined;
      }

      if (textCase === 'upper' || textCase === 'lower') {
        return textCase;
      }

      issueWarning('Invalid "formatTextCase": must be either "upper" or "lower". Ignoring the case.');
      return undefined;
    }

    /**
     * Returns the configured prompt character, or `undefined` with a warning when
     * it is neither unset nor a single character.
     *
     * @private
     */
    #normalizePrompt() {
      const prompt = this.formatPrompt;

      if (prompt === undefined || prompt === null || prompt === '') {
        return undefined;
      }

      if (typeof prompt === 'string' && prompt.length === 1) {
        return prompt;
      }

      issueWarning('Invalid "formatPrompt": must be a single character. Ignoring the prompt.');
      return undefined;
    }

    /**
     * Returns the mask to use for the given text, resolving the expression of a
     * format whose mask depends on how much text there is.
     *
     * @private
     */
    #resolveMask(value) {
      const mask = this.#mask;
      return typeof mask === 'function' ? mask({ value, selection: [value.length, value.length] }) : mask;
    }

    /**
     * Returns whether the given presented text unmasks back to the given value,
     * that is whether the format laid the value out in full rather than keeping it
     * and showing only the part of it that fits.
     *
     * @private
     */
    #roundTrips(presented, value) {
      return unmask(presented, this.#mask) === value;
    }

    /**
     * Returns true when the given text holds at least one character that the format
     * does not insert itself, that is a character the user meant to enter.
     *
     * @private
     */
    #hasUserCharacter(text) {
      const { literalChars } = this.#resolveMask(text);
      return text.split('').some((char) => !literalChars.has(char));
    }

    /**
     * Returns true when the given input event describes a deletion that runs
     * forwards, which decides the side that a deletion of a character the format
     * inserts is widened on.
     *
     * @private
     */
    #isForwardDelete(event) {
      return typeof event.inputType === 'string' && event.inputType.endsWith('Forward');
    }

    /**
     * Presents the result of an edit that this layer applied itself, in place of
     * the one that the browser was going to apply.
     *
     * The presented text is a script write, so the edit is not kept in the native
     * undo stack. Preserving undo across live formatting is a recorded follow-up
     * rather than a property of this prototype.
     *
     * @private
     */
    #applyEdit(input, state) {
      this._presentValue(state.value, state.selection[0]);

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

export const InputFormatMixin = dedupeMixin(InputFormatMixinImplementation);
