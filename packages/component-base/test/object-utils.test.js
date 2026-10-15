import { expect } from '@vaadin/chai-plugins';
import { deepMerge, deepMergePartials } from '../src/object-utils.js';

describe('object-utils', () => {
  describe('deepMerge', () => {
    it('should copy properties from source to target', () => {
      const target = { foo: 'foo' };
      expect(deepMerge(target, { bar: 'bar' })).to.equal(target);
      expect(target).to.eql({ foo: 'foo', bar: 'bar' });
    });

    it('should override existing properties of target', () => {
      expect(deepMerge({ foo: 'foo' }, { foo: 'bar' })).to.eql({ foo: 'bar' });
    });

    it('should merge nested objects', () => {
      const target = { foo: { bar: 'bar' } };
      expect(deepMerge(target, { foo: { baz: 'baz' } })).to.eql({ foo: { bar: 'bar', baz: 'baz' } });
    });

    it('should not modify the source object', () => {
      const source = { foo: { bar: 'bar' } };
      deepMerge({ foo: { baz: 'baz' } }, source);
      expect(source).to.eql({ foo: { bar: 'bar' } });
    });

    it('should replace a non-object target property with an object', () => {
      expect(deepMerge({ foo: 'foo' }, { foo: { bar: 'bar' } })).to.eql({ foo: { bar: 'bar' } });
    });

    it('should assign nullish values', () => {
      expect(deepMerge({ foo: 'foo', bar: 'bar' }, { foo: null, bar: undefined })).to.eql({
        foo: null,
        bar: undefined,
      });
    });

    it('should assign the array itself', () => {
      const array = ['foo'];
      expect(deepMerge({}, { foo: array }).foo).to.equal(array);
    });

    it('should replace an array target property with an object', () => {
      expect(deepMerge({ foo: ['foo'] }, { foo: { bar: 'bar' } })).to.eql({ foo: { bar: 'bar' } });
    });

    it('should assign a value that is an object but not a plain object', () => {
      const source = { date: new Date(0), map: new Map(), instance: new (class Foo {})() };
      const merged = deepMerge({}, source);
      expect(merged.date).to.equal(source.date);
      expect(merged.map).to.equal(source.map);
      expect(merged.instance).to.equal(source.instance);
    });

    it('should merge an object without a prototype', () => {
      const source = Object.create(null);
      source.foo = 'foo';
      expect(deepMerge({}, { nested: source })).to.eql({ nested: { foo: 'foo' } });
    });

    it('should return the target when the source is not an object', () => {
      const target = { foo: 'foo' };
      expect(deepMerge(target, 'bar')).to.equal(target);
      expect(target).to.eql({ foo: 'foo' });
    });

    it('should return the target when the source is null', () => {
      const target = { foo: 'foo' };
      expect(deepMerge(target, null)).to.equal(target);
      expect(target).to.eql({ foo: 'foo' });
    });

    it('should return the target when the source is an array', () => {
      const target = { foo: 'foo' };
      expect(deepMerge(target, ['bar'])).to.equal(target);
      expect(target).to.eql({ foo: 'foo' });
    });

    it('should return the target when the target is not a plain object', () => {
      expect(deepMerge('foo', { bar: 'bar' })).to.equal('foo');
    });

    describe('ignored keys', () => {
      afterEach(() => {
        delete Object.prototype.injected;
      });

      it('should not copy the __proto__ key', () => {
        const target = deepMerge({}, JSON.parse('{"__proto__": {"injected": "yes"}}'));
        expect({}.injected).to.be.undefined;
        expect(Object.getPrototypeOf(target)).to.equal(Object.prototype);
      });

      it('should not copy a nested __proto__ key', () => {
        deepMerge({}, JSON.parse('{"foo": {"__proto__": {"injected": "yes"}}}'));
        expect({}.injected).to.be.undefined;
      });

      it('should not copy the prototype key', () => {
        deepMerge({}, JSON.parse('{"prototype": {"injected": "yes"}}'));
        expect({}.injected).to.be.undefined;
      });

      it('should not copy the constructor key', () => {
        deepMerge({}, JSON.parse('{"constructor": {"prototype": {"injected": "yes"}}}'));
        expect({}.injected).to.be.undefined;
      });

      it('should not merge into an object inherited from the prototype chain', () => {
        // eslint-disable-next-line no-extend-native
        Object.prototype.injected = { foo: 'foo' };
        const target = deepMerge({}, { injected: { bar: 'bar' } });
        expect(Object.prototype.injected).to.eql({ foo: 'foo' });
        expect(target.injected).to.eql({ bar: 'bar' });
      });
    });
  });

  describe('deepMergePartials', () => {
    it('should merge multiple sources into the target', () => {
      expect(deepMergePartials({ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' })).to.eql({
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      });
    });

    it('should override an earlier source with a later one', () => {
      expect(deepMergePartials({}, { foo: 'foo' }, { foo: 'bar' })).to.eql({ foo: 'bar' });
    });

    it('should return the target', () => {
      const target = { foo: 'foo' };
      expect(deepMergePartials(target, { bar: 'bar' })).to.equal(target);
    });

    it('should skip nullish values', () => {
      const source = { foo: null, bar: undefined, baz: { qux: null } };
      const target = { foo: 'foo', bar: 'bar', baz: { qux: 'qux' } };
      expect(deepMergePartials(target, source)).to.eql({
        foo: 'foo',
        bar: 'bar',
        baz: { qux: 'qux' },
      });
    });

    it('should assign a copy of an array', () => {
      const array = ['foo'];
      const merged = deepMergePartials({}, { foo: array });
      expect(merged.foo).to.not.equal(array);
      expect(merged.foo).to.eql(array);
    });

    it('should not share nested objects with the sources', () => {
      const source = { foo: { bar: 'bar' } };
      const merged = deepMergePartials({}, source);
      expect(merged.foo).to.not.equal(source.foo);
      expect(merged.foo).to.eql(source.foo);
    });

    it('should keep a target property that is not a plain object', () => {
      const target = { weekdays: ['Sunday'], date: new Date(0), text: 'text' };
      const merged = deepMergePartials(target, {
        weekdays: { 0: 'Sunnuntai' },
        date: { foo: 'foo' },
        text: { foo: 'foo' },
      });
      expect(merged.weekdays).to.eql(['Sunday']);
      expect(merged.date).to.eql(new Date(0));
      expect(merged.text).to.equal('text');
    });

    it('should merge an object that the target does not have', () => {
      expect(deepMergePartials({ foo: 'foo' }, { bar: { baz: 'baz' } })).to.eql({ foo: 'foo', bar: { baz: 'baz' } });
    });

    it('should replace a falsy target property with the merged object', () => {
      expect(deepMergePartials({ foo: 0 }, { foo: { bar: 'bar' } })).to.eql({ foo: { bar: 'bar' } });
    });

    it('should assign a value that is an object but not a plain object', () => {
      const source = { date: new Date(0) };
      expect(deepMergePartials({}, source).date).to.equal(source.date);
    });

    it('should ignore a source that is not a plain object', () => {
      const target = { foo: 'foo' };
      expect(deepMergePartials(target, undefined, 'bar', ['baz'])).to.equal(target);
      expect(target).to.eql({ foo: 'foo' });
    });

    describe('ignored keys', () => {
      afterEach(() => {
        delete Object.prototype.injected;
      });

      it('should not copy the __proto__ key with an array value', () => {
        deepMergePartials({}, JSON.parse('{"__proto__": {"injected": ["yes"]}}'));
        expect({}.injected).to.be.undefined;
      });
    });
  });
});
