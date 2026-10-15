import { expect } from '@vaadin/chai-plugins';
import { get, set } from '../src/path-utils.js';

describe('path-utils', () => {
  describe('get', () => {
    const object = { foo: { bar: { baz: 42 } } };

    it('should return correct value from an object', () => {
      expect(get('foo.bar.baz', object)).to.equal(42);
      expect(get('foo.bar', object)).to.eql({ baz: 42 });
    });

    it('should return undefined for a non-existent path', () => {
      expect(get('foo.bar.qux', object)).to.be.undefined;
    });
  });

  describe('set', () => {
    const object = { foo: {} };

    it('should set the nested sub-property to the object', () => {
      set('foo.bar', 'baz', object);
      expect(object.foo.bar).to.equal('baz');
    });
  });
});
