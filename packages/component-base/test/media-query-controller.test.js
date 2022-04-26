import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { MediaQueryController } from '../src/media-query-controller.js';

customElements.define(
  'media-query-element',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`<slot></slot>`;
    }
  },
);

describe('media-query-controller', () => {
  let element, controller;

  beforeEach(() => {
    element = fixtureSync(`<media-query-element></media-query-element>`);
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
});
