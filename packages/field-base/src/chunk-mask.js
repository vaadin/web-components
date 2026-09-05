/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// Every character that has a special meaning inside a regular expression character
// class, so that a delimiter such as `-` is matched literally.
const REGEXP_SPECIALS = /[.*+?^${}()|[\]\\-]/gu;

/**
 * Returns the slot pattern for one character of a block: any character except the
 * delimiter. Chunking accepts any character, so the only thing a slot has to reject
 * is the delimiter itself, which belongs to the presentation rather than to the
 * text that the user enters.
 *
 * @param {string} delimiter
 * @return {RegExp}
 */
function slotFor(delimiter) {
  return new RegExp(`[^${delimiter.replace(REGEXP_SPECIALS, '\\$&')}]`, 'u');
}

/**
 * Returns the number of characters of the given presented value that the user
 * entered, that is everything that is not the delimiter.
 *
 * The mask to lay a value out with depends on how many characters have to be laid
 * out, and that count has to be available before there is a mask, so it is counted
 * with the delimiter alone.
 *
 * @param {string} value
 * @param {string} delimiter
 * @return {number}
 */
function rawLengthOf(value, delimiter) {
  return value.split(delimiter).join('').length;
}

/**
 * Builds the mask that lays out the given number of user characters in the blocks
 * of the given chunking format, joined by its delimiter.
 *
 * Blocks are emitted until they cover the given length, and the last of them only
 * as far as that length reaches, so that the mask is never longer than the text it
 * describes. Characters past the sum of the blocks are covered by one more delimiter
 * and an open run of slots, which is what keeps a value longer than the blocks from
 * being truncated. A length of zero yields the slots of the first block, so that an
 * empty value is laid out without a leading delimiter.
 *
 * @param {{ blocks: number[], delimiter: string, textCase?: string }} format
 * @param {number} rawLength the number of user characters to lay out
 * @return {NormalizedMask}
 */
export function chunkMask(format, rawLength) {
  const { blocks, delimiter, textCase } = format;
  const slot = slotFor(delimiter);
  const literalChars = new Set([delimiter]);
  const items = [];
  // A length of zero still lays the first block out in full.
  const length = rawLength || blocks[0];
  let covered = 0;

  for (let i = 0; i < blocks.length; i++) {
    if (i > 0) {
      items.push(delimiter);
    }

    for (let j = 0; j < Math.min(blocks[i], length - covered); j++) {
      items.push(slot);
    }

    covered += blocks[i];

    if (covered >= length) {
      return { items, literalChars, textCase };
    }
  }

  items.push(delimiter);

  for (let j = covered; j < length; j++) {
    items.push(slot);
  }

  return { items, literalChars, textCase };
}

/**
 * Returns the dynamic mask expression for the given chunking format, that is the
 * function that the mask engine calls to get the mask for a state. The mask is
 * derived from the number of user characters that the state holds, so that the
 * blocks grow with the value instead of padding it.
 *
 * @param {{ blocks: number[], delimiter: string, textCase?: string }} format
 * @return {function(MaskState): NormalizedMask}
 */
export function chunkMaskFor(format) {
  return (state) => chunkMask(format, rawLengthOf(state.value, format.delimiter));
}
