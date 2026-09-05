import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';
import {
  calibrate,
  compileMask,
  deleteRange,
  insertText,
  maskedIndex,
  reconstructEdit,
  unmask,
  unmaskedIndex,
  validateWithMask,
} from '../src/mask-utils.js';

// A phone mask where every user slot is a digit slot.
const PHONE = compileMask('+7 (000) 000-00-00');

// The same phone mask with a fixed 0 at index 10, as used by the Maskito specs.
const PHONE_FIXED_ZERO = compileMask('+7 (000) 0\\00-00-00');

// A legacy product code mask with an escaped fixed run right after the first slot.
const LEGACY = compileMask('*\\08\\0\\0\\0-00-**-000000-0');

const TIME = compileMask('00:00');

// A dynamic mask that lays a value out in blocks joined by a delimiter, as a chunk
// format does, so that a value laid out by one set of blocks can be mapped under another.
function chunkMaskFor(blocks, delimiter = ' ') {
  const slot = new RegExp(`[^${delimiter}]`, 'u');

  return ({ value }) => {
    const rawLength = value.split(delimiter).join('').length;
    const items = [];
    let covered = 0;

    for (const block of blocks) {
      if (items.length > 0) {
        items.push(delimiter);
      }

      for (let i = 0; i < block; i++) {
        items.push(slot);
      }

      covered += block;

      if (covered >= rawLength) {
        return { items, literalChars: new Set([delimiter]) };
      }
    }

    items.push(delimiter);

    for (let i = covered; i < rawLength; i++) {
      items.push(slot);
    }

    return { items, literalChars: new Set([delimiter]) };
  };
}

describe('compileMask', () => {
  beforeEach(() => {
    clearWarnings();
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
    clearWarnings();
  });

  it('should compile one item per mask character', () => {
    expect(PHONE.items).to.have.lengthOf(18);
  });

  it('should compile a regexp for every user slot', () => {
    expect(PHONE.items.filter((item) => item instanceof RegExp)).to.have.lengthOf(10);
  });

  it('should collect every fixed character of the mask', () => {
    expect(PHONE.literalChars).to.eql(new Set(['+', '7', ' ', '(', ')', '-']));
  });

  it('should compile an escaped character as a fixed character', () => {
    expect(LEGACY.items).to.have.lengthOf(21);
    expect(LEGACY.items.slice(1, 6)).to.eql(['0', '8', '0', '0', '0']);
  });

  it('should match any character in a star slot', () => {
    const star = compileMask('*');
    expect(validateWithMask('C', star)).to.be.true;
    expect(validateWithMask('-', star)).to.be.true;
    expect(validateWithMask('0', star)).to.be.true;
  });

  it('should match any unicode digit in a digit slot', () => {
    expect(validateWithMask('7', compileMask('0'))).to.be.true;
    expect(validateWithMask('٣', compileMask('0'))).to.be.true;
    expect(validateWithMask('a', compileMask('0'))).to.be.false;
  });

  it('should match any unicode letter in a letter slot', () => {
    expect(validateWithMask('x', compileMask('a'))).to.be.true;
    expect(validateWithMask('ä', compileMask('a'))).to.be.true;
    expect(validateWithMask('1', compileMask('a'))).to.be.false;
  });

  it('should record the text case on the compiled mask', () => {
    expect(compileMask('aa00', { textCase: 'upper' }).textCase).to.equal('upper');
    expect(compileMask('aa00', { textCase: 'lower' }).textCase).to.equal('lower');
  });

  it('should record no text case without warning for an unknown value', () => {
    expect(compileMask('aa00').textCase).to.be.undefined;
    expect(compileMask('aa00', { textCase: 'title' }).textCase).to.be.undefined;
    expect(console.warn).to.not.be.called;
  });

  it('should return null without warning when the mask is not set', () => {
    expect(compileMask(undefined)).to.be.null;
    expect(compileMask(null)).to.be.null;
    expect(console.warn).to.not.be.called;
  });

  it('should return null and warn once when the mask is an empty string', () => {
    expect(compileMask('')).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the mask ends with a dangling backslash', () => {
    expect(compileMask('00-00\\')).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when the mask has no user slot', () => {
    expect(compileMask('-+')).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });

  it('should return null and warn once when every slot of the mask is escaped', () => {
    expect(compileMask('\\0\\a')).to.be.null;
    expect(console.warn).to.be.calledOnce;
  });
});

describe('validateWithMask', () => {
  it('should return true for a value that fills the mask', () => {
    expect(validateWithMask('+7 (900) 201-11-22', PHONE)).to.be.true;
  });

  it('should return false for a value that is shorter than the mask', () => {
    expect(validateWithMask('+7 (900) 201-11-2', PHONE)).to.be.false;
  });

  it('should return false when a character does not match its slot', () => {
    expect(validateWithMask('+7 (900) 201-11-2x', PHONE)).to.be.false;
  });

  it('should return false when a fixed character is replaced', () => {
    expect(validateWithMask('+7 (900) 201.11-22', PHONE)).to.be.false;
  });
});

describe('calibrate', () => {
  it('should return a value that already fits the mask unchanged', () => {
    const state = calibrate({ value: '12:34', selection: [2, 2] }, TIME);
    expect(state.value).to.equal('12:34');
    expect(state.selection).to.eql([2, 2]);
  });

  it('should insert the fixed characters of the mask', () => {
    expect(calibrate({ value: '1234' }, TIME).value).to.equal('12:34');
  });

  it('should truncate a value that is longer than the mask', () => {
    expect(calibrate({ value: '123456' }, TIME).value).to.equal('12:34');
  });

  it('should drop the characters that their slot rejects', () => {
    expect(calibrate({ value: '1x2y34' }, TIME).value).to.equal('12:34');
  });

  it('should always insert the fixed characters in raw mode', () => {
    expect(calibrate({ value: 'C01476001374' }, LEGACY, { raw: true }).value).to.equal('C08000-01-47-600137-4');
  });

  it('should consume a character equal to the next fixed character in user mode', () => {
    expect(calibrate({ value: 'C01476001374' }, LEGACY).value).to.equal('C08000-14-76-001374');
  });

  it('should mask a value with no character equal to a fixed one the same in both modes', () => {
    expect(calibrate({ value: 'C10476001374' }, LEGACY, { raw: true }).value).to.equal('C08000-10-47-600137-4');
    expect(calibrate({ value: 'C10476001374' }, LEGACY).value).to.equal('C08000-10-47-600137-4');
  });

  it('should drop a rejected character of a masked value with no initial state', () => {
    const state = calibrate({ value: '+7 (900) 2x1', selection: [11, 11] }, PHONE);
    expect(state.value).to.equal('+7 (900) 21');
    expect(unmask(state.value, PHONE)).to.equal('90021');
  });

  it('should keep a fixed character that the initial state already held', () => {
    const initialState = { value: '+7 (900) 20', selection: [11, 11] };
    expect(calibrate({ value: '90020' }, PHONE_FIXED_ZERO, { initialState }).value).to.equal('+7 (900) 200');
  });

  it('should append the trailing fixed characters only when they complete the mask', () => {
    expect(calibrate({ value: '12' }, compileMask('00:')).value).to.equal('12:');
    expect(calibrate({ value: '1' }, compileMask('00:')).value).to.equal('1');
  });

  it('should apply the text case of the mask to the value', () => {
    expect(calibrate({ value: 'fi21' }, compileMask('aa00', { textCase: 'upper' }), { raw: true }).value).to.equal(
      'FI21',
    );
    expect(calibrate({ value: 'FI21' }, compileMask('aa00', { textCase: 'lower' }), { raw: true }).value).to.equal(
      'fi21',
    );
  });

  it('should keep the case of the value when the mask has no text case', () => {
    expect(calibrate({ value: 'fi21' }, compileMask('aa00'), { raw: true }).value).to.equal('fi21');
  });

  it('should map both selection indexes to the masked value', () => {
    const state = calibrate({ value: '900201', selection: [3, 5] }, PHONE);
    expect(state.value).to.equal('+7 (900) 201');
    expect(state.selection).to.eql([9, 11]);
  });
});

describe('unmask', () => {
  it('should remove the fixed characters from a full value', () => {
    expect(unmask('C08000-10-47-600137-4', LEGACY)).to.equal('C10476001374');
  });

  it('should remove the fixed characters from a partial value', () => {
    expect(unmask('+7 (90', PHONE)).to.equal('90');
  });

  it('should keep a character that does not sit at the index of its fixed character', () => {
    expect(unmask('12-34', TIME)).to.equal('12-34');
  });

  it('should map both selection indexes to the unmasked value', () => {
    const state = unmask({ value: '+7 (900) 201-11', selection: [9, 10] }, PHONE);
    expect(state.value).to.equal('90020111');
    expect(state.selection).to.eql([3, 4]);
  });

  it('should keep the case of the characters when the mask has a text case', () => {
    expect(unmask('fi21', compileMask('aa00', { textCase: 'upper' }))).to.equal('fi21');
    expect(unmask('FI21', compileMask('aa00', { textCase: 'lower' }))).to.equal('FI21');
  });

  it('should map a selection past the end of the value to its end', () => {
    const state = unmask({ value: '+7 (90' }, PHONE);
    expect(state.selection).to.eql([2, 2]);
  });
});

describe('unmaskedIndex', () => {
  it('should count the characters that are not a fixed character of the mask', () => {
    expect(unmaskedIndex('12:34', TIME, 4)).to.equal(3);
  });

  it('should return 0 for index 0', () => {
    expect(unmaskedIndex('12:34', TIME, 0)).to.equal(0);
  });

  it('should clamp an index past the end of the value', () => {
    expect(unmaskedIndex('12:34', TIME, 99)).to.equal(4);
  });

  it('should count independently of where the fixed characters sit', () => {
    // Spike defect D-1: the value was laid out by the blocks [4, 4, 4, 4, 2] and is
    // counted under [2, 4, 4], where none of the delimiters sit at the same index.
    expect(unmaskedIndex('FI21 1234 5600', chunkMaskFor([2, 4, 4]), 6)).to.equal(5);
  });
});

describe('maskedIndex', () => {
  it('should return the index after the character that the index counts up to', () => {
    expect(maskedIndex('12:34', TIME, 3)).to.equal(4);
  });

  it('should return 0 for index 0', () => {
    expect(maskedIndex('12:34', TIME, 0)).to.equal(0);
  });

  it('should return the length of the value for an index past its last character', () => {
    expect(maskedIndex('12:34', TIME, 9)).to.equal(5);
  });

  it('should keep the caret next to the same character across a mask change', () => {
    // Spike defect D-1: the caret at 6 of a value laid out by the blocks [4, 4, 4, 4, 2]
    // counts five characters, and lands next to the same one after [2, 4, 4] laid it out again.
    expect(maskedIndex('FI 2112 3456 00', chunkMaskFor([2, 4, 4]), 5)).to.equal(6);
  });
});

describe('insertText', () => {
  it('should insert the fixed characters due before the typed character', () => {
    const state = insertText({ value: '+7', selection: [2, 2] }, '7', PHONE_FIXED_ZERO);
    expect(state.value).to.equal('+7 (7');
    expect(state.selection).to.eql([5, 5]);
  });

  it('should insert a fixed character that is due at the caret', () => {
    const state = insertText({ value: '+7 (900) 2', selection: [10, 10] }, '1', PHONE_FIXED_ZERO);
    expect(state.value).to.equal('+7 (900) 201');
  });

  it('should keep a typed character that equals the fixed character it lands on', () => {
    const state = insertText({ value: '+7 (900) 20', selection: [11, 11] }, '0', PHONE_FIXED_ZERO);
    expect(state.value).to.equal('+7 (900) 200');
  });

  it('should not insert a fixed character where the mask has a user slot', () => {
    const state = insertText({ value: '+7 (900) 2', selection: [10, 10] }, '1', PHONE);
    expect(state.value).to.equal('+7 (900) 21');
  });

  it('should consume a typed character that equals the fixed character due next', () => {
    const state = insertText({ value: '12', selection: [2, 2] }, ':', TIME);
    expect(state.value).to.equal('12:');
  });

  it('should return null when the mask rejects the typed character', () => {
    expect(insertText({ value: '12', selection: [2, 2] }, 'x', TIME)).to.be.null;
  });

  it('should insert the fixed character before the typed character it precedes', () => {
    const state = insertText({ value: '12', selection: [2, 2] }, '5', TIME);
    expect(state.value).to.equal('12:5');
    expect(state.selection).to.eql([4, 4]);
  });

  it('should replace the selected range with the inserted text', () => {
    const state = insertText({ value: '12:34', selection: [3, 5] }, '59', TIME);
    expect(state.value).to.equal('12:59');
  });

  it('should apply the text case of the mask to the inserted text', () => {
    const state = insertText({ value: '', selection: [0, 0] }, 'ab', compileMask('aaa', { textCase: 'upper' }));
    expect(state.value).to.equal('AB');
    expect(state.selection).to.eql([2, 2]);
  });

  it('should apply the text case to a character typed in the other case', () => {
    const state = insertText({ value: 'A', selection: [1, 1] }, 'b', compileMask('aaa', { textCase: 'upper' }));
    expect(state.value).to.equal('AB');
    expect(state.selection).to.eql([2, 2]);
  });

  it('should keep the case of the inserted text when the mask has no text case', () => {
    const state = insertText({ value: '', selection: [0, 0] }, 'ab', compileMask('aaa'));
    expect(state.value).to.equal('ab');
  });

  it('should insert a pasted fragment that the mask partly rejects', () => {
    const state = insertText({ value: '', selection: [0, 0] }, '20-1', TIME);
    expect(state.value).to.equal('20:1');
  });
});

describe('deleteRange', () => {
  const PREV = { value: '+7 (900) 201-11', selection: [15, 15] };

  it('should shift the remaining characters into the freed slots', () => {
    const state = deleteRange(PREV, [9, 10], PHONE);
    expect(state.value).to.equal('+7 (900) 011-1');
    expect(state.selection).to.eql([9, 9]);
  });

  it('should hop a backward deletion over a fixed character', () => {
    const state = deleteRange(PREV, [7, 8], PHONE);
    expect(state.value).to.equal(PREV.value);
    expect(state.selection).to.eql([7, 7]);
  });

  it('should hop a forward deletion over a fixed character', () => {
    const state = deleteRange(PREV, [12, 13], PHONE, { forward: true });
    expect(state.value).to.equal(PREV.value);
    expect(state.selection).to.eql([13, 13]);
  });

  it('should widen a backward deletion over a fixed character to the character before it', () => {
    const state = deleteRange(PREV, [7, 8], PHONE, { literals: 'widen' });
    expect(state.value).to.equal('+7 (902) 011-1');
    expect(state.selection).to.eql([6, 6]);
  });

  it('should widen a forward deletion over a fixed character to the character after it', () => {
    const state = deleteRange(PREV, [12, 13], PHONE, { literals: 'widen', forward: true });
    expect(state.value).to.equal('+7 (900) 201-1');
    expect(state.selection).to.eql([13, 13]);
  });

  it('should keep the value when there is nothing to delete before a fixed character', () => {
    const state = deleteRange({ value: '+7 (9', selection: [1, 1] }, [0, 1], PHONE, { literals: 'widen' });
    expect(state.value).to.equal('+7 (9');
    expect(state.selection).to.eql([0, 0]);
  });

  it('should delete a range that covers user characters and fixed characters', () => {
    const state = deleteRange(PREV, [6, 11], PHONE);
    expect(state.value).to.equal('+7 (901) 11');
    expect(state.selection).to.eql([6, 6]);
  });

  it('should keep the value for an empty range', () => {
    const state = deleteRange(PREV, [5, 5], PHONE);
    expect(state.value).to.equal(PREV.value);
    expect(state.selection).to.eql([5, 5]);
  });
});

describe('reconstructEdit', () => {
  it('should resolve a deletion to the character before the caret', () => {
    const edit = reconstructEdit({ value: '200', selection: [3, 3] }, { value: '20', selection: [2, 2] });
    expect(edit).to.eql({ start: 2, end: 3, data: '' });
  });

  it('should resolve an insertion at the caret', () => {
    const edit = reconstructEdit({ value: 'ab', selection: [1, 1] }, { value: 'aXb', selection: [2, 2] });
    expect(edit).to.eql({ start: 1, end: 1, data: 'X' });
  });

  it('should resolve a replaced selection', () => {
    const edit = reconstructEdit({ value: 'abcd', selection: [1, 3] }, { value: 'aZd', selection: [2, 2] });
    expect(edit).to.eql({ start: 1, end: 3, data: 'Z' });
  });

  it('should resolve a value that replaced an empty one', () => {
    const edit = reconstructEdit({ value: '', selection: [0, 0] }, { value: 'autofilled', selection: [10, 10] });
    expect(edit).to.eql({ start: 0, end: 0, data: 'autofilled' });
  });
});

describe('dynamic mask', () => {
  const SHORT = compileMask('0000000000');
  const MEDIUM = compileMask('0000 0000 0000 0000');
  const LONG = compileMask('00000000000000000000');

  const cardMask = ({ value }) => {
    const digits = value.replace(/\D/gu, '').length;

    if (digits <= 10) {
      return SHORT;
    }

    return digits <= 16 ? MEDIUM : LONG;
  };

  it('should mask with the short mask for up to ten digits', () => {
    const state = insertText({ value: '', selection: [0, 0] }, '01234abc56789', cardMask);
    expect(state.value).to.equal('0123456789');
    expect(state.selection).to.eql([10, 10]);
  });

  it('should regroup with the medium mask for up to sixteen digits', () => {
    const state = insertText({ value: '', selection: [0, 0] }, '01234abc56789123456', cardMask);
    expect(state.value).to.equal('0123 4567 8912 3456');
  });

  it('should regroup with the long mask for more than sixteen digits', () => {
    const state = insertText({ value: '', selection: [0, 0] }, '01234abc567891234567890', cardMask);
    expect(state.value).to.equal('01234567891234567890');
  });

  it('should regroup while typing past the length of the short mask', () => {
    const state = insertText({ value: '0123456789', selection: [10, 10] }, '1', cardMask);
    expect(state.value).to.equal('0123 4567 891');
  });

  it('should resolve the mask for a deletion', () => {
    const state = deleteRange({ value: '0123 4567 8912 3456', selection: [19, 19] }, [18, 19], cardMask);
    expect(state.value).to.equal('0123 4567 8912 345');
  });

  it('should resolve the mask for unmasking', () => {
    expect(unmask('0123 4567 8912 3456', cardMask)).to.equal('0123456789123456');
  });

  it('should resolve the mask for validating', () => {
    expect(validateWithMask('0123456789', cardMask)).to.be.true;
    expect(validateWithMask('0123 4567 8912 3456', cardMask)).to.be.true;
    expect(validateWithMask('0123456789123456', cardMask)).to.be.false;
  });

  it('should resolve the mask for calibrating', () => {
    expect(calibrate({ value: '0123456789123456' }, cardMask).value).to.equal('0123 4567 8912 3456');
  });
});
