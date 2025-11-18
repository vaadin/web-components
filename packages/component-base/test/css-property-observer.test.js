import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { CSSPropertyObserver } from '../src/css-property-observer.js';

CSS.registerProperty({
  name: '--test-prop-0',
  syntax: '<number>',
  inherits: true,
  initialValue: '0',
});

CSS.registerProperty({
  name: '--test-prop-1',
  syntax: '<number>',
  inherits: true,
  initialValue: '0',
});

describe('CSSPropertyObserver', () => {
  let observer, element, callback;

  beforeEach(async () => {
    element = fixtureSync('<div></div>');
    callback = sinon.spy();
    observer = new CSSPropertyObserver(element, callback);
    await nextFrame();
  });

  it('should observe CSS property changes', async () => {
    observer.observe('--test-prop-0', '--test-prop-1');
    await nextFrame();
    expect(callback).to.be.not.called;

    element.style.setProperty('--test-prop-0', '1');
    await nextFrame();
    expect(callback).to.be.calledOnceWith('--test-prop-0');

    callback.resetHistory();

    element.style.setProperty('--test-prop-1', '1');
    await nextFrame();
    expect(callback).to.be.calledOnceWith('--test-prop-1');
  });

  it('should stop observing when disconnect is called', async () => {
    observer.observe('--test-prop-0');
    await nextFrame();
    observer.disconnect();
    await nextFrame();

    element.style.setProperty('--test-prop-0', '1');
    await nextFrame();
    expect(callback).to.be.not.called;
  });
});
