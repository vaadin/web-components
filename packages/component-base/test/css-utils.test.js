import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import { registerCSSProperty } from '../src/css-utils.js';

describe('registerCSSProperty', () => {
  let warn;
  let counter = 0;

  // CSS property registration is global and cannot be undone within a page,
  // so use a unique name per test to keep tests order-independent.
  function uniqueName() {
    counter += 1;
    return `--test-register-style-property-${counter}`;
  }

  beforeEach(() => {
    warn = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warn.restore();
  });

  it('should register a property once without warning', () => {
    const name = uniqueName();
    registerCSSProperty({ name, syntax: '<number>', inherits: false, initialValue: '0' });

    expect(warn.called).to.be.false;
  });

  it('should not throw when the same property is registered twice', () => {
    const name = uniqueName();
    const definition = { name, syntax: '<number>', inherits: false, initialValue: '0' };

    registerCSSProperty(definition);
    expect(() => registerCSSProperty(definition)).to.not.throw();
  });

  it('should warn when the same property is registered twice', () => {
    const name = uniqueName();
    const definition = { name, syntax: '<number>', inherits: false, initialValue: '0' };

    registerCSSProperty(definition);
    registerCSSProperty(definition);

    expect(warn.calledOnce).to.be.true;
    expect(warn.firstCall.args[0]).to.include(name);
  });

  it('should rethrow errors other than InvalidModificationError', () => {
    expect(() => registerCSSProperty({ name: uniqueName(), syntax: '<not-a-syntax>' })).to.throw();
  });
});
