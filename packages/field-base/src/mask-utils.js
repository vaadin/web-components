/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { issueWarning } from '@vaadin/component-base/src/warnings.js';

/**
 * The user slots of the mask grammar, mapped to the pattern that a single character
 * has to match to be accepted in that slot.
 */
const USER_SLOTS = new Map([
  ['0', /\p{Nd}/u],
  ['a', /\p{L}/u],
  ['*', /./su],
]);

/**
 * Returns the given number limited to the given range.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns the text with the given case applied, or unchanged when no case is set.
 *
 * @param {string} text
 * @param {string | undefined} textCase
 * @return {string}
 */
function applyCase(text, textCase) {
  if (textCase === 'upper') {
    return text.toUpperCase();
  }

  if (textCase === 'lower') {
    return text.toLowerCase();
  }

  return text;
}

/**
 * Returns a mask state for the given value or state, with the selection defaulting to
 * a collapsed one at the end of the value.
 *
 * @param {MaskState | { value: string, selection?: number[] }} state
 * @return {MaskState}
 */
function toState(state) {
  const { value } = state;
  const selection = state.selection || [value.length, value.length];

  return { value, selection: [selection[0], selection[1]] };
}

/**
 * Returns the compiled mask to use for the given state, resolving a dynamic mask
 * against it.
 *
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {MaskState} state
 * @return {NormalizedMask}
 */
function resolveMask(compiled, state) {
  return typeof compiled === 'function' ? compiled(state) : compiled;
}

/**
 * Returns whether the given character is accepted by the given mask item, that is
 * whether it equals a fixed character or matches a user slot.
 *
 * @param {string} char
 * @param {RegExp | string} item
 * @return {boolean}
 */
function matchesItem(char, item) {
  return typeof item === 'string' ? char === item : item.test(char);
}

/**
 * Returns whether the given value fits the given mask items exactly.
 *
 * @param {string} value
 * @param {Array<RegExp | string>} items
 * @return {boolean}
 */
function isValidValue(value, items) {
  return value.length === items.length && items.every((item, index) => matchesItem(value[index], item));
}

/**
 * Returns whether the character at the given index of a masked value is a fixed
 * character of the mask sitting at its own index.
 *
 * @param {string} value
 * @param {Array<RegExp | string>} items
 * @param {number} index
 * @return {boolean}
 */
function isFixedAt(value, items, index) {
  return typeof items[index] === 'string' && items[index] === value[index];
}

/**
 * Returns the index in the unmasked value that corresponds to the given index in the
 * masked value, that is the number of characters before it that the mask does not
 * hold as a fixed character sitting at that same index.
 *
 * This is the positional counterpart of the exported `unmaskedIndex`, which counts
 * every character that the mask does not hold as a fixed character anywhere.
 *
 * @param {string} value
 * @param {Array<RegExp | string>} items
 * @param {number} index
 * @return {number}
 */
function positionalIndex(value, items, index) {
  const end = Math.min(index, value.length);
  let unmasked = 0;

  for (let i = 0; i < end; i++) {
    if (!isFixedAt(value, items, i)) {
      unmasked += 1;
    }
  }

  return unmasked;
}

/**
 * Returns the run of fixed characters that is due at the given index of the value
 * being rebuilt, that is every fixed mask item from that index up to the next user
 * slot.
 *
 * In user mode the run stops one item early when the character being placed equals
 * the fixed character that is due and the value did not already hold that character
 * at that index, so that typing a delimiter the mask is about to insert is consumed
 * instead of doubled. In raw mode the whole run is always returned, since a raw value
 * holds no fixed characters to begin with.
 *
 * @param {Array<RegExp | string>} items
 * @param {number} index
 * @param {string} char the character being placed, empty for the trailing run
 * @param {MaskState | null} initialState
 * @param {boolean} raw
 * @return {string}
 */
function fixedRunAt(items, index, char, initialState, raw) {
  let run = '';

  for (let i = index; i < items.length; i++) {
    const item = items[i];

    if (typeof item !== 'string') {
      return run;
    }

    if (!raw && item === char && (!initialState || initialState.value[i] !== item)) {
      return run;
    }

    run += item;
  }

  return run;
}

/**
 * Rebuilds the given value left to right so that it fits the given mask, and maps both
 * selection indexes to the rebuilt value.
 *
 * Before each character of the value, the run of fixed characters that is due at the
 * current output index is inserted. The character is then kept when it matches the
 * slot it lands in, consumed when that slot holds the fixed character it equals, and
 * dropped otherwise. Characters past the end of the mask are dropped, and the trailing
 * run of fixed characters is appended only when it completes the mask.
 *
 * The text case of the mask is applied to each character as it is placed, so the value
 * stores the transformed character while matching a slot and consuming a fixed character
 * both work off the character as it was typed. The fixed characters of the mask are
 * never transformed.
 *
 * @param {MaskState} state
 * @param {NormalizedMask} mask
 * @param {MaskState | null} initialState
 * @param {boolean} raw
 * @return {MaskState}
 */
function rebuildValue(state, mask, initialState, raw) {
  const { value, selection } = state;
  const { items, textCase } = mask;
  let result = '';
  let mappedFrom = null;
  let mappedTo = null;

  for (let i = 0; i < value.length && result.length < items.length; i++) {
    const char = value[i];
    const run = fixedRunAt(items, result.length, char, initialState, raw);
    const withRun = result + run;
    const item = items[withRun.length];

    if (mappedFrom === null && i >= selection[0]) {
      mappedFrom = withRun.length;
    }

    if (mappedTo === null && i >= selection[1]) {
      mappedTo = withRun.length;
    }

    if (typeof item === 'string') {
      // The character being placed is the fixed character due here, keep the latter only.
      result = withRun + item;
    } else if (item !== undefined && item.test(char)) {
      result = withRun + applyCase(char, textCase);
    } else if (run.startsWith(char)) {
      // The character was already covered by the run inserted for it.
      result = withRun;
    }
  }

  const trailing = fixedRunAt(items, result.length, '', initialState, raw);
  const completed = result + trailing;

  return {
    value: isValidValue(completed, items) ? completed : result,
    selection: [mappedFrom === null ? result.length : mappedFrom, mappedTo === null ? result.length : mappedTo],
  };
}

/**
 * Returns whether the given range covers fixed characters of the mask only, each one
 * sitting at its own index.
 *
 * @param {string} value
 * @param {Array<RegExp | string>} items
 * @param {number} from
 * @param {number} to
 * @return {boolean}
 */
function coversFixedOnly(value, items, from, to) {
  if (from >= to) {
    return false;
  }

  for (let i = from; i < to; i++) {
    if (!isFixedAt(value, items, i)) {
      return false;
    }
  }

  return true;
}

/**
 * Compiles a mask string into the list of items that the other functions work with,
 * one item per character of the masked value: a regular expression for a user slot
 * and a string for a fixed character. The compiled mask also carries the set of every
 * character that the mask holds as a fixed character, for offset independent filtering
 * of a text fragment.
 *
 * The compiled mask carries the text case to apply to the characters that the user
 * types, taken from `options.textCase`. Only `'upper'` and `'lower'` are accepted, any
 * other value is recorded as no case at all and does not warn, since the layer that
 * reads the property is the one that validates it.
 *
 * The grammar is a subset of the IMask one:
 *
 * - `0` any digit
 * - `a` any letter
 * - `*` any character
 * - `\x` the literal character `x`
 * - every other character is a fixed character
 *
 * Returns `null` when no mask is configured. Also returns `null` when the mask is
 * invalid, in which case a warning is logged and the mask is treated as unset:
 *
 * - the mask is not a non-empty string
 * - the mask ends with a dangling `\`
 * - the mask has no user slot at all
 *
 * @param {string | null | undefined} mask
 * @param {MaskCompileOptions} [options]
 * @return {NormalizedMask | null}
 */
export function compileMask(mask, options = {}) {
  if (mask === undefined || mask === null) {
    return null;
  }

  if (typeof mask !== 'string' || mask.length === 0) {
    issueWarning('Invalid "mask": must be a non-empty string. Ignoring the mask.');
    return null;
  }

  const items = [];
  const literalChars = new Set();
  let escaped = false;

  for (const char of mask.split('')) {
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }

    const slot = escaped ? undefined : USER_SLOTS.get(char);
    escaped = false;

    if (slot) {
      items.push(slot);
    } else {
      items.push(char);
      literalChars.add(char);
    }
  }

  if (escaped) {
    issueWarning('Invalid "mask": must not end with a dangling "\\". Ignoring the mask.');
    return null;
  }

  if (items.every((item) => typeof item === 'string')) {
    issueWarning('Invalid "mask": must have at least one "0", "a" or "*" slot. Ignoring the mask.');
    return null;
  }

  const textCase = options.textCase === 'upper' || options.textCase === 'lower' ? options.textCase : undefined;

  return { items, literalChars, textCase };
}

/**
 * Returns whether the given value fits the given mask exactly, that is whether it has
 * one character per mask item and every character is accepted by its item.
 *
 * @param {string} value
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @return {boolean}
 */
export function validateWithMask(value, compiled) {
  const { items } = resolveMask(compiled, toState({ value }));

  return isValidValue(value, items);
}

/**
 * Returns the given state masked, that is the closest value to it that the mask
 * accepts, with both selection indexes mapped to that value.
 *
 * A value that already fits the mask is returned unchanged. Otherwise it is rebuilt
 * left to right: the fixed characters of the mask are inserted where they are due,
 * characters that their slot rejects are dropped, and characters past the end of the
 * mask are truncated.
 *
 * With `raw: true` the value is taken as an unmasked one, so the fixed characters are
 * always inserted and never consume a character of the value. With `raw: false` a
 * character that equals the fixed character due next is consumed as that character,
 * unless `initialState` already held it at that index, which is how typing a delimiter
 * that the mask inserts anyway does not double it.
 *
 * When the mask has a text case, every character of the value is stored with that case
 * applied.
 *
 * @param {MaskState | { value: string, selection?: number[] }} state
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {MaskCalibrateOptions} [options]
 * @return {MaskState}
 */
export function calibrate(state, compiled, options = {}) {
  const { initialState = null, raw = false } = options;
  const candidate = toState(state);
  const mask = resolveMask(compiled, candidate);
  const { items, textCase } = mask;

  if (isValidValue(candidate.value, items) && candidate.value === applyCase(candidate.value, textCase)) {
    return candidate;
  }

  return rebuildValue(candidate, mask, initialState, raw);
}

/**
 * Returns the given masked value or state without the fixed characters of the mask,
 * that is the characters that the user typed. A character is only dropped where it
 * equals the fixed character sitting at its own index, so a value that does not fit
 * the mask keeps the characters that the mask does not describe.
 *
 * A string returns a string, a state returns a state with both selection indexes
 * mapped to the unmasked value.
 *
 * @param {MaskState | { value: string, selection?: number[] } | string} state
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @return {MaskState | string}
 */
export function unmask(state, compiled) {
  const isString = typeof state === 'string';
  const { value, selection } = toState(isString ? { value: state } : state);
  const { items } = resolveMask(compiled, { value, selection });

  let unmasked = '';

  for (let i = 0; i < value.length; i++) {
    if (!isFixedAt(value, items, i)) {
      unmasked += value[i];
    }
  }

  if (isString) {
    return unmasked;
  }

  return {
    value: unmasked,
    selection: [positionalIndex(value, items, selection[0]), positionalIndex(value, items, selection[1])],
  };
}

/**
 * Returns the index in the unmasked value that corresponds to the given index in the
 * masked value, that is the number of characters before it that the mask does not hold
 * as a fixed character anywhere.
 *
 * Unlike `unmask`, which only drops a fixed character sitting at its own index, this
 * does not depend on the offsets of the mask, so it also maps an index of a value that
 * another mask laid out, such as after a mask change while the field is focused. The
 * given index is clamped to the length of the value.
 *
 * @param {string} value
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {number} index
 * @return {number}
 */
export function unmaskedIndex(value, compiled, index) {
  const { literalChars } = resolveMask(compiled, { value, selection: [index, index] });
  const end = Math.min(index, value.length);
  let unmasked = 0;

  for (let i = 0; i < end; i++) {
    if (!literalChars.has(value[i])) {
      unmasked += 1;
    }
  }

  return unmasked;
}

/**
 * Returns the index in the masked value that corresponds to the given index in the
 * unmasked value, that is the index just after the character that the given index
 * counts up to, counting only the characters that the mask does not hold as a fixed
 * character anywhere.
 *
 * Returns `0` for index `0`, which callers must treat as a valid index rather than as
 * falsy, and the length of the value when the given index is past its last character
 * that the mask does not hold as a fixed character.
 *
 * @param {string} value
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {number} unmaskedIdx
 * @return {number}
 */
export function maskedIndex(value, compiled, unmaskedIdx) {
  if (unmaskedIdx <= 0) {
    return 0;
  }

  const { literalChars } = resolveMask(compiled, { value, selection: [unmaskedIdx, unmaskedIdx] });
  let count = 0;

  for (let i = 0; i < value.length; i++) {
    if (!literalChars.has(value[i])) {
      count += 1;

      if (count === unmaskedIdx) {
        return i + 1;
      }
    }
  }

  return value.length;
}

/**
 * Applies an edit that replaces the given range of the previous masked value with the
 * given data, by mapping the range into the unmasked value, splicing there, and masking
 * the result again. The fixed characters of the mask therefore flow around the
 * remaining characters instead of staying where they were.
 *
 * A deletion of a range that covers fixed characters only is not applied as such: with
 * `literals: 'hop'` only the caret moves over them, with `literals: 'widen'` the range
 * is extended by one character on the far side and that character is deleted instead.
 *
 * Returns the new state together with the masked leading part of an insertion, which
 * tells an insertion that the mask rejected entirely from one that changed the value.
 *
 * @param {MaskState} prevState
 * @param {number[]} range
 * @param {string} data
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {MaskDeleteOptions} [options]
 * @return {{ state: MaskState, leading: string | null }}
 */
function applyEdit(prevState, range, data, compiled, options = {}) {
  const { literals = 'hop', forward = false } = options;
  const prevValue = prevState.value;
  let [from, to] = range;

  const candidate = prevValue.slice(0, from) + data + prevValue.slice(to);
  const candidateCaret = from + data.length;
  const mask = resolveMask(compiled, { value: candidate, selection: [candidateCaret, candidateCaret] });

  if (data === '' && coversFixedOnly(prevValue, mask.items, from, to)) {
    const widened = forward ? [from, Math.min(to + 1, prevValue.length)] : [Math.max(from - 1, 0), to];

    if (literals !== 'widen' || (widened[0] === from && widened[1] === to)) {
      return { state: { value: prevValue, selection: forward ? [to, to] : [from, from] }, leading: null };
    }

    [from, to] = widened;
  }

  const unmasked = unmask({ value: prevValue, selection: [from, to] }, mask);
  const rawLeading = unmasked.value.slice(0, unmasked.selection[0]) + data;
  const rawValue = rawLeading + unmasked.value.slice(unmasked.selection[1]);
  const caret = rawLeading.length;
  const maskOptions = { initialState: prevState, raw: false };

  return {
    state: calibrate({ value: rawValue, selection: [caret, caret] }, mask, maskOptions),
    leading: data === '' ? null : calibrate({ value: rawLeading, selection: [caret, caret] }, mask, maskOptions).value,
  };
}

/**
 * Returns the state that results from inserting the given text at the selection of the
 * given state, with the text placed in the unmasked value so that the fixed characters
 * of the mask flow around it.
 *
 * Returns `null` when the mask rejected all of the given text, so that the caller can
 * signal the rejection instead of presenting an unchanged value.
 *
 * @param {MaskState} prevState
 * @param {string} data
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @return {MaskState | null}
 */
export function insertText(prevState, data, compiled) {
  const prev = toState(prevState);
  const { state, leading } = applyEdit(prev, prev.selection, data, compiled);

  const isUnchanged =
    state.value === prev.value && state.selection[0] === prev.selection[0] && state.selection[1] === prev.selection[1];

  if (data !== '' && (leading === prev.value.slice(0, prev.selection[0]) || isUnchanged)) {
    return null;
  }

  return state;
}

/**
 * Returns the state that results from deleting the given range of the given state, with
 * the range mapped into the unmasked value so that the fixed characters of the mask flow
 * around the remaining characters.
 *
 * A range that covers fixed characters only is not deleted as such. With the default
 * `literals: 'hop'` the value stays as it is and only the caret moves over the fixed
 * characters, in the direction of the deletion. With `literals: 'widen'` the range is
 * extended by one character on the far side and that character is deleted instead.
 *
 * @param {MaskState} prevState
 * @param {number[]} range
 * @param {NormalizedMask | function(MaskState): NormalizedMask} compiled
 * @param {MaskDeleteOptions} [options]
 * @return {MaskState}
 */
export function deleteRange(prevState, range, compiled, options = {}) {
  const prev = toState(prevState);
  const from = clamp(range[0], 0, prev.value.length);
  const to = clamp(range[1], 0, prev.value.length);

  if (from >= to) {
    return { value: prev.value, selection: [from, from] };
  }

  return applyEdit(prev, [from, to], '', compiled, options).state;
}

/**
 * Returns the edit that turned the previous state into the next one, as the range of the
 * previous value that was replaced and the text it was replaced with.
 *
 * The range is found with a common prefix scan disambiguated by the caret of the next
 * state, since a common suffix scan picks the wrong character whenever the edited one
 * repeats, such as deleting the middle `0` of `200`. A previously empty value is taken as
 * fully replaced, which is what an autofill looks like.
 *
 * @param {MaskState} prevState
 * @param {MaskState} nextState
 * @return {{ start: number, end: number, data: string }}
 */
export function reconstructEdit(prevState, nextState) {
  const prev = toState(prevState);
  const next = toState(nextState);

  if (prev.value === '' && next.value !== '') {
    return { start: 0, end: 0, data: next.value };
  }

  const caret = next.selection[1];
  const end = clamp(prev.value.length - next.value.length + caret, 0, prev.value.length);

  let prefix = 0;
  while (prefix < prev.value.length && prefix < next.value.length && prev.value[prefix] === next.value[prefix]) {
    prefix += 1;
  }

  const start = Math.min(prefix, caret, end);

  return { start, end, data: next.value.slice(start, caret) };
}
