import { expect } from '@vaadin/chai-plugins';
import { defineLit, definePolymer, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DisabledMixin } from '../src/disabled-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'disabled-mixin',
    '<slot></slot>',
    (Base) => class extends DisabledMixin(baseMixin(Base)) {},
  );

  let element;

  beforeEach(async () => {
    element = fixtureSync(`<${tag}></${tag}>`);
    await nextRender();
  });

  it('should set disabled property to false by default', () => {
    expect(element.disabled).to.be.false;
  });

  it('should reflect disabled property to attribute', () => {
    element.disabled = true;
    expect(element.hasAttribute('disabled')).to.be.true;

    element.disabled = false;
    expect(element.hasAttribute('disabled')).to.be.false;
  });

  it('should set the aria-disabled attribute when disabled', () => {
    element.disabled = true;
    expect(element.getAttribute('aria-disabled')).to.equal('true');

    element.disabled = false;
    expect(element.hasAttribute('aria-disabled')).to.be.false;
  });

  it('should prevent firing click event when disabled', () => {
    const spy = sinon.spy();
    element.addEventListener('click', spy);
    element.disabled = true;
    element.click();
    expect(spy.called).to.be.false;
  });
};

describe('DisabledMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('DisabledMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
