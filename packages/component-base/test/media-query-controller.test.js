import { expect } from '@vaadin/chai-plugins';
import { defineLit, definePolymer, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '../src/controller-mixin.js';
import { MediaQueryController } from '../src/media-query-controller.js';
import { PolylitMixin } from '../src/polylit-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper('media-query-controller', `<slot></slot>`, (Base) => class extends baseMixin(Base) {});

  let element, controller;

  beforeEach(() => {
    element = fixtureSync(`<${tag}></${tag}>`);
  });

  it('should return true when media query matches', () => {
    const stub = sinon.stub();
    controller = new MediaQueryController('(min-width: 1px)', stub);
    element.addController(controller);
    expect(stub.calledOnce).to.be.true;
    expect(stub.firstCall.args[0]).to.be.true;
  });

  it('should return false when media query does not match', () => {
    const stub = sinon.stub();
    controller = new MediaQueryController('(min-width: 100000px)', stub);
    element.addController(controller);
    expect(stub.calledOnce).to.be.true;
    expect(stub.firstCall.args[0]).to.be.false;
  });

  it('should run the callback again when the element is re-attached', () => {
    const stub = sinon.stub();
    controller = new MediaQueryController('(min-width: 1px)', stub);
    element.addController(controller);

    const parent = element.parentNode;
    parent.removeChild(element);
    parent.appendChild(element);

    expect(stub.calledTwice).to.be.true;
  });
};

describe('MediaQueryController + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('MediaQueryController + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
