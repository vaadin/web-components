import { expect } from '@vaadin/chai-plugins';
import { formatFilterValue, parseQuery } from '../src/vaadin-query-field-parser.js';

describe('query-field parser', () => {
  describe('parseQuery', () => {
    it('should return no segments for empty text', () => {
      expect(parseQuery('')).to.eql([]);
    });

    it('should split text into words, whitespace and filters', () => {
      const segments = parseQuery('foo  year:2001 bar');
      expect(segments.map((s) => [s.type, s.raw])).to.eql([
        ['text', 'foo'],
        ['space', '  '],
        ['filter', 'year:2001'],
        ['space', ' '],
        ['text', 'bar'],
      ]);
    });

    it('should parse filter name, value and offsets', () => {
      const [segment] = parseQuery('year:2001');
      expect(segment).to.include({ name: 'year', value: '2001', start: 0, end: 9, valueStart: 5, quoted: false });
    });

    it('should parse a quoted value containing whitespace', () => {
      const [, , segment] = parseQuery('a label:"Warp Records" b');
      expect(segment).to.include({ raw: 'label:"Warp Records"', value: 'Warp Records', quoted: true, closed: true });
    });

    it('should extend an unclosed quoted value to the end of the text', () => {
      const [segment] = parseQuery('label:"Warp Rec');
      expect(segment).to.include({ value: 'Warp Rec', quoted: true, closed: false, end: 15 });
    });

    it('should parse a filter with an empty value', () => {
      const [segment] = parseQuery('label:');
      expect(segment).to.include({ type: 'filter', name: 'label', value: '' });
    });

    it('should not treat words not starting with a letter as filters', () => {
      expect(parseQuery('12:30 :foo').map((s) => s.type)).to.eql(['text', 'space', 'text']);
    });
  });

  describe('formatFilterValue', () => {
    it('should not quote a single word', () => {
      expect(formatFilterValue('vinyl')).to.equal('vinyl');
    });

    it('should quote a value containing whitespace', () => {
      expect(formatFilterValue('Warp Records')).to.equal('"Warp Records"');
    });

    it('should quote an empty value', () => {
      expect(formatFilterValue('')).to.equal('""');
    });

    it('should remove double quotes from the value', () => {
      expect(formatFilterValue('say "hi"')).to.equal('"say hi"');
    });
  });
});
