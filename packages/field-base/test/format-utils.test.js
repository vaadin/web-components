import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import {
  formatChunks,
  normalizeFormat,
  rawIndexFromViewIndex,
  unformat,
  viewIndexFromRawIndex,
} from '../src/format-utils.js';

const IBAN_BLOCKS = [4, 4, 4, 4, 2];
const IBAN_RAW = 'FI2112345600000785';
const IBAN_FORMATTED = 'FI21 1234 5600 0007 85';

describe('normalizeFormat', () => {
  beforeEach(() => {
    clearWarnings();
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
    clearWarnings();
  });

  it('should return null without warning when format is undefined', () => {
    expect(normalizeFormat(undefined)).to.be.null;
    expect(console.warn).to.not.be.called;
  });

  it('should return null without warning when format is null', () => {
    expect(normalizeFormat(null)).to.be.null;
    expect(console.warn).to.not.be.called;
  });

  it('should default the delimiter to a space', () => {
    expect(normalizeFormat({ blocks: IBAN_BLOCKS })).to.eql({ blocks: IBAN_BLOCKS, delimiter: ' ' });
  });

  it('should keep a single character delimiter', () => {
    expect(normalizeFormat({ blocks: [3, 3], delimiter: '-' })).to.eql({ blocks: [3, 3], delimiter: '-' });
  });

  it('should keep a valid case', () => {
    expect(normalizeFormat({ blocks: [3, 3], case: 'upper' }).case).to.equal('upper');
    expect(normalizeFormat({ blocks: [3, 3], case: 'lower' }).case).to.equal('lower');
  });

  it('should omit case when it is not set', () => {
    expect(normalizeFormat({ blocks: [3, 3] })).to.not.have.property('case');
  });

  it('should copy the blocks array so that mutating the original has no effect', () => {
    const blocks = [3, 3];
    const normalized = normalizeFormat({ blocks });
    blocks.push(4);
    expect(normalized.blocks).to.eql([3, 3]);
  });

  it('should return null and warn once when blocks is missing', () => {
    expect(normalizeFormat({ delimiter: ' ' })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when blocks is not an array', () => {
    expect(normalizeFormat({ blocks: 'nope' })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when blocks is empty', () => {
    expect(normalizeFormat({ blocks: [] })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when a block is not an integer', () => {
    expect(normalizeFormat({ blocks: [4, 2.5] })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when a block is zero', () => {
    expect(normalizeFormat({ blocks: [4, 0] })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when a block is negative', () => {
    expect(normalizeFormat({ blocks: [4, -1] })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the delimiter is not a single character', () => {
    expect(normalizeFormat({ blocks: IBAN_BLOCKS, delimiter: '--' })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the delimiter is an empty string', () => {
    expect(normalizeFormat({ blocks: IBAN_BLOCKS, delimiter: '' })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the delimiter is not a string', () => {
    expect(normalizeFormat({ blocks: IBAN_BLOCKS, delimiter: 1 })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the case is unknown', () => {
    expect(normalizeFormat({ blocks: IBAN_BLOCKS, case: 'title' })).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should warn once for repeated calls with the same invalid config', () => {
    normalizeFormat({ blocks: 'nope' });
    normalizeFormat({ blocks: 'nope' });
    expect(console.warn).to.be.calledOnce;
  });

  it('should not throw when format is not an object', () => {
    expect(() => normalizeFormat('nope')).to.not.throw();
    expect(normalizeFormat('nope')).to.be.null;
  });
});

describe('formatChunks', () => {
  it('should group an IBAN into blocks separated by a space', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(formatChunks(IBAN_RAW, options).formatted).to.equal(IBAN_FORMATTED);
  });

  it('should group a phone number into blocks separated by a space', () => {
    const options = normalizeFormat({ blocks: [3, 3, 4] });
    expect(formatChunks('0401234567', options).formatted).to.equal('040 123 4567');
  });

  it('should group with a custom delimiter', () => {
    const options = normalizeFormat({ blocks: [3, 3, 4], delimiter: '-' });
    expect(formatChunks('0401234567', options).formatted).to.equal('040-123-4567');
  });

  it('should apply the upper case', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS, case: 'upper' });
    expect(formatChunks('fi2112345600000785', options).formatted).to.equal(IBAN_FORMATTED);
  });

  it('should apply the lower case', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS, case: 'lower' });
    expect(formatChunks(IBAN_RAW, options).formatted).to.equal('fi21 1234 5600 0007 85');
  });

  it('should return an empty string for an empty value', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(formatChunks('', options).formatted).to.equal('');
  });

  it('should not pad a value shorter than the blocks describe', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(formatChunks('FI211', options).formatted).to.equal('FI21 1');
  });

  it('should not emit a trailing delimiter when the value ends at a block boundary', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(formatChunks('FI21', options).formatted).to.equal('FI21');
  });

  it('should keep overflow after one more delimiter instead of truncating it', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    const raw = 'FI2112345600000785ABCDEFG';
    const { formatted } = formatChunks(raw, options);
    expect(formatted).to.equal('FI21 1234 5600 0007 85 ABCDEFG');
    expect(unformat(formatted, options)).to.equal(raw);
  });
});

describe('unformat', () => {
  it('should remove every delimiter', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(unformat(IBAN_FORMATTED, options)).to.equal(IBAN_RAW);
  });

  it('should remove a custom delimiter', () => {
    const options = normalizeFormat({ blocks: [3, 3, 4], delimiter: '-' });
    expect(unformat('040-123-4567', options)).to.equal('0401234567');
  });

  it('should apply the case', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS, case: 'upper' });
    expect(unformat('fi21 1234 5600 0007 85', options)).to.equal(IBAN_RAW);
  });

  it('should return an empty string for an empty value', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(unformat('', options)).to.equal('');
  });

  it('should be idempotent on an already unformatted value', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(unformat(IBAN_RAW, options)).to.equal(IBAN_RAW);
    expect(unformat(unformat(IBAN_FORMATTED, options), options)).to.equal(IBAN_RAW);
  });

  it('should round-trip a value that is already unformatted', () => {
    const options = normalizeFormat({ blocks: IBAN_BLOCKS });
    expect(unformat(formatChunks(IBAN_RAW, options).formatted, options)).to.equal(IBAN_RAW);
  });
});

describe('rawIndexFromViewIndex', () => {
  const options = normalizeFormat({ blocks: IBAN_BLOCKS });

  it('should return 0 for the start of the value', () => {
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 0, options)).to.equal(0);
  });

  it('should not count a delimiter before the index', () => {
    // 'FI21 1' -> 5 raw characters
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 6, options)).to.equal(5);
  });

  it('should return the same index while no delimiter precedes it', () => {
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 3, options)).to.equal(3);
  });

  it('should treat an index on a delimiter as the end of the preceding block', () => {
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 4, options)).to.equal(4);
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 5, options)).to.equal(4);
  });

  it('should count every character for the end of the value', () => {
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, IBAN_FORMATTED.length, options)).to.equal(IBAN_RAW.length);
  });

  it('should clamp an index past the end of the value', () => {
    expect(rawIndexFromViewIndex(IBAN_FORMATTED, 100, options)).to.equal(IBAN_RAW.length);
  });
});

describe('viewIndexFromRawIndex', () => {
  const options = normalizeFormat({ blocks: IBAN_BLOCKS });

  it('should return 0 for raw index 0', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, 0, options)).to.equal(0);
  });

  it('should return the index just after the counted character', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, 3, options)).to.equal(3);
  });

  it('should return the index before the delimiter at a block boundary', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, 4, options)).to.equal(4);
  });

  it('should skip the delimiter for the first character of the next block', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, 5, options)).to.equal(6);
  });

  it('should return the length of the value for the last raw index', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, IBAN_RAW.length, options)).to.equal(IBAN_FORMATTED.length);
  });

  it('should return the length of the value for a raw index past the end', () => {
    expect(viewIndexFromRawIndex(IBAN_FORMATTED, 100, options)).to.equal(IBAN_FORMATTED.length);
  });

  it('should return 0 for a raw index past the end of an empty value', () => {
    expect(viewIndexFromRawIndex('', 5, options)).to.equal(0);
  });

  it('should map back to the same raw index for every index of the presented value', () => {
    for (let viewIndex = 0; viewIndex <= IBAN_FORMATTED.length; viewIndex++) {
      const rawIndex = rawIndexFromViewIndex(IBAN_FORMATTED, viewIndex, options);
      const mapped = viewIndexFromRawIndex(IBAN_FORMATTED, rawIndex, options);
      expect(rawIndexFromViewIndex(IBAN_FORMATTED, mapped, options)).to.equal(rawIndex);
    }
  });
});
