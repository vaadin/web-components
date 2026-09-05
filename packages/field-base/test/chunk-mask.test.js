import { expect } from '@vaadin/chai-plugins';
import { chunkMask, chunkMaskFor } from '../src/chunk-mask.js';
import { calibrate, unmask } from '../src/mask-utils.js';

/**
 * Renders the items of a mask as one string, with a user slot shown as `_` and a
 * fixed character as itself, so that a whole layout can be asserted at a glance.
 */
function layout(mask) {
  return mask.items.map((item) => (typeof item === 'string' ? item : '_')).join('');
}

describe('chunkMask', () => {
  it('should lay out the first block for a length of zero', () => {
    expect(layout(chunkMask({ blocks: [4, 4, 2], delimiter: ' ' }, 0))).to.equal('____');
  });

  it('should lay out one block without a trailing delimiter', () => {
    expect(layout(chunkMask({ blocks: [4, 4], delimiter: ' ' }, 4))).to.equal('____');
  });

  it('should stop the last block where the given length reaches', () => {
    expect(layout(chunkMask({ blocks: [4, 4], delimiter: ' ' }, 6))).to.equal('____ __');
  });

  it('should lay out every block that the given length reaches', () => {
    expect(layout(chunkMask({ blocks: [4, 4, 2], delimiter: ' ' }, 10))).to.equal('____ ____ __');
  });

  it('should cover the overflow past the blocks with one more delimiter', () => {
    expect(layout(chunkMask({ blocks: [4, 4], delimiter: ' ' }, 10))).to.equal('____ ____ __');
  });

  it('should never truncate a length longer than the blocks describe', () => {
    const mask = chunkMask({ blocks: [4, 4, 4, 4, 2], delimiter: ' ' }, 25);
    expect(layout(mask)).to.equal('____ ____ ____ ____ __ _______');
  });

  it('should join the blocks with the configured delimiter', () => {
    expect(layout(chunkMask({ blocks: [3, 3], delimiter: '-' }, 5))).to.equal('___-__');
  });

  it('should escape a delimiter that has a meaning in a regular expression', () => {
    const [slot] = chunkMask({ blocks: [3, 3], delimiter: '-' }, 5).items;
    expect(slot.test('-')).to.be.false;
    expect(slot.test('5')).to.be.true;
  });

  it('should hold the delimiter as the only fixed character', () => {
    const mask = chunkMask({ blocks: [3, 3], delimiter: '-' }, 5);
    expect([...mask.literalChars]).to.eql(['-']);
  });

  it('should carry the configured text case', () => {
    expect(chunkMask({ blocks: [3, 3], delimiter: ' ', textCase: 'upper' }, 5).textCase).to.equal('upper');
  });

  it('should carry no text case when none is configured', () => {
    expect(chunkMask({ blocks: [3, 3], delimiter: ' ' }, 5).textCase).to.be.undefined;
  });
});

describe('chunkMaskFor', () => {
  it('should derive the mask from the number of characters in the state', () => {
    const expression = chunkMaskFor({ blocks: [4, 4], delimiter: ' ' });
    expect(layout(expression({ value: 'FI21 12', selection: [7, 7] }))).to.equal('____ __');
  });

  it('should not count the delimiter as a character of the value', () => {
    const expression = chunkMaskFor({ blocks: [4, 4], delimiter: ' ' });
    expect(layout(expression({ value: 'FI21 1234', selection: [9, 9] }))).to.equal('____ ____');
  });

  it('should lay out a value that the engine masks with it', () => {
    const expression = chunkMaskFor({ blocks: [4, 4, 4, 4, 2], delimiter: ' ' });
    const { value } = calibrate({ value: 'FI2112345600000785', selection: [0, 0] }, expression, { raw: true });
    expect(value).to.equal('FI21 1234 5600 0007 85');
  });

  it('should remove the delimiters that the engine inserted', () => {
    const expression = chunkMaskFor({ blocks: [4, 4, 4, 4, 2], delimiter: ' ' });
    expect(unmask('FI21 1234 5600 0007 85', expression)).to.equal('FI2112345600000785');
  });

  it('should apply the text case that the engine carries', () => {
    const expression = chunkMaskFor({ blocks: [4, 4], delimiter: ' ', textCase: 'upper' });
    const { value } = calibrate({ value: 'fi211234', selection: [0, 0] }, expression, { raw: true });
    expect(value).to.equal('FI21 1234');
  });
});
