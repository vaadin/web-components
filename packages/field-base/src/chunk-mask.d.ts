/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { MaskState, NormalizedMask } from './mask-utils.js';

/**
 * A validated chunking format: the block lengths, the delimiter that joins them and
 * the case to apply to the characters that the user types.
 */
export interface ChunkFormat {
  blocks: number[];
  delimiter: string;
  textCase?: 'lower' | 'upper';
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
 */
export function chunkMask(format: ChunkFormat, rawLength: number): NormalizedMask;

/**
 * Returns the dynamic mask expression for the given chunking format, that is the
 * function that the mask engine calls to get the mask for a state. The mask is
 * derived from the number of user characters that the state holds, so that the
 * blocks grow with the value instead of padding it.
 */
export function chunkMaskFor(format: ChunkFormat): (state: MaskState) => NormalizedMask;
