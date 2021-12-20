import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ResizableMixin } from '../src/resizable-mixin.js';

describe('resizable-mixin', () => {
  let element;

  before(() => {
    customElements.define(
      'resizable-mixin-element',
      class extends ResizableMixin(PolymerElement) {
        static get template() {
          return html`
            <style>
              :host {
                display: block;
              }
            </style>
            <div></div>
          `;
        }

        _onResize() {
          this.__resolveResize?.();
        }

        nextResize() {
          return new Promise((resolve) => {
            this.__resolveResize = resolve;
          });
        }
      }
    );
  });

  beforeEach(async () => {
    element = fixtureSync(`<resizable-mixin-element></resizable-mixin-element>`);
    // Wait for the initial resize.
    await element.nextResize();
  });

  it('should notify resize', async () => {
    element.style.width = '100px';
    await element.nextResize();
  });

  it('should warn when calling deprecated notifyResize()', () => {
    const stub = sinon.stub(console, 'warn');
    element.notifyResize();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
    expect(stub.args[0][0]).to.include('WARNING: Since Vaadin 23, notifyResize() is deprecated.');
  });
});
