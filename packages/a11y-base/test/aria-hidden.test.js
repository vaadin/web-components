import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { hideOthers, inertOthers } from '../src/aria-hidden.js';

describe('aria-hidden', () => {
  let parent, target1, target2, sibling, hidden1, hidden2;

  const callbacks = new Set();

  function clear(callback) {
    callbacks.delete(callback);
    callback();
  }

  [
    { name: 'hideOthers', attr: 'aria-hidden', hideFunc: hideOthers },
    { name: 'inertOthers', attr: 'inert', hideFunc: inertOthers },
  ].forEach(({ name, attr, hideFunc }) => {
    describe(name, () => {
      beforeEach(async () => {
        parent = fixtureSync(`
          <div>
            <div id="sibling">hide me 1</div>
            <div id="target1">not me 2</div>
            <div>
              <div id="target2">not me 3</div>
            </div>
            <div id="hidden1" aria-hidden="true">I am already hidden! 4</div>
            <div id="hidden2" aria-hidden>I am hidden in a wrong way 5</div>
          </div>
        `);
        sibling = parent.querySelector('#sibling');
        target1 = parent.querySelector('#target1');
        target2 = parent.querySelector('#target2');
        hidden1 = parent.querySelector('#hidden1');
        hidden2 = parent.querySelector('#hidden2');
        await nextRender();
      });

      afterEach(() => {
        callbacks.forEach(clear);
      });

      it(`should set ${attr} on other nodes when passing a single target`, () => {
        const unhide = hideFunc(target1, parent);

        callbacks.add(unhide);

        // Target node is not hidden
        expect(target1.hasAttribute(attr)).to.be.false;

        // Leaf element isn't hidden
        expect(target2.hasAttribute(attr)).to.be.false;

        // Leaf's parent node is hidden
        expect(target2.parentNode.getAttribute(attr)).to.equal('true');

        // Sibling element is hidden too
        expect(sibling.getAttribute(attr)).to.equal('true');
      });

      it(`should remove ${attr} from other nodes when passing a single target`, () => {
        const unhide = hideFunc(target1, parent);

        unhide();

        // Elements are no longer hidden
        expect(target2.parentNode.hasAttribute(attr)).to.be.false;
        expect(sibling.hasAttribute(attr)).to.be.false;

        // Hidden elements are still hidden
        expect(hidden1.getAttribute(attr)).to.equal(attr === 'inert' ? null : 'true');
        expect(hidden2.getAttribute(attr)).to.equal(attr === 'inert' ? null : '');

        // Marker attributes are removed
        expect(hidden1.hasAttribute(`data-${attr}`)).to.be.false;
        expect(hidden2.hasAttribute(`data-${attr}`)).to.be.false;
      });

      it(`should set ${attr} on other nodes when passing multiple targets`, () => {
        const unhide = hideFunc([target1, target2], parent);
        callbacks.add(unhide);

        // First target node is not hidden
        expect(target1.hasAttribute(attr)).to.be.false;

        // Second target node is not hidden
        expect(target2.hasAttribute(attr)).to.be.false;

        // Parent node is not hidden either
        expect(target2.parentNode.hasAttribute(attr)).to.be.false;

        // Sibling element is hidden
        expect(sibling.getAttribute(attr)).to.equal('true');
      });

      it(`should remove ${attr} from other nodes when passing multiple targets`, () => {
        const unhide = hideFunc([target1, target2], parent);
        unhide();

        // Sibling element is no longer hidden
        expect(sibling.hasAttribute(attr)).to.be.false;

        // Hidden elements are still hidden
        expect(hidden1.getAttribute(attr)).to.equal(attr === 'inert' ? null : 'true');
        expect(hidden2.getAttribute(attr)).to.equal(attr === 'inert' ? null : '');
      });

      it(`should set ${attr} correctly when calling on two different targets`, () => {
        const unhide1 = hideFunc(target1, parent);
        callbacks.add(unhide1);

        // Everything but the target node is hidden
        expect(target1.hasAttribute(attr)).to.be.false;
        expect(target2.parentNode.getAttribute(attr)).to.equal('true');
        expect(sibling.getAttribute(attr)).to.equal('true');

        const unhide2 = hideFunc(target2, parent);
        callbacks.add(unhide2);

        // And now the first target is also hidden
        expect(target1.getAttribute(attr)).to.equal('true');
        expect(target2.parentNode.getAttribute(attr)).to.equal('true');
        expect(sibling.getAttribute(attr)).to.equal('true');
      });

      it(`should remove ${attr} correctly when calling on two different targets`, () => {
        const unhide1 = hideFunc(target1, parent);
        const unhide2 = hideFunc(target2, parent);

        unhide1();
        unhide2();

        // All the elements are no longer hidden
        expect(target1.hasAttribute(attr)).to.be.false;
        expect(target2.parentNode.hasAttribute(attr)).to.be.false;
        expect(sibling.hasAttribute(attr)).to.be.false;
      });

      it(`should remove ${attr} correctly after un-hiding only one target`, () => {
        const unhide1 = hideFunc(target1, parent);
        const unhide2 = hideFunc(target2, parent);
        callbacks.add(unhide1);

        unhide2();

        // First target element should not be hidden anymore
        expect(target1.hasAttribute(attr)).to.be.false;
        // Other elements should still be hidden as expected
        expect(target2.parentNode.hasAttribute(attr)).to.be.true;
        expect(sibling.hasAttribute(attr)).to.be.true;
      });

      it(`should set different attribute markers when using setting ${attr}`, () => {
        const unhide1 = hideFunc(target1, parent, 'marker1');
        callbacks.add(unhide1);

        // First marker attribute is set
        expect(sibling.getAttribute('marker1')).to.equal('true');

        const unhide2 = hideFunc(target2, parent, 'marker2');
        callbacks.add(unhide2);

        // Both marker attributes are set
        expect(sibling.getAttribute('marker1')).to.equal('true');
        expect(sibling.getAttribute('marker2')).to.equal('true');
      });

      it(`should remove all the attribute markers when using removing ${attr}`, () => {
        const unhide1 = hideFunc(target1, parent, 'marker1');
        const unhide2 = hideFunc(target2, parent, 'marker2');

        unhide1();
        unhide2();

        // Both marker attributes are removed
        expect(sibling.hasAttribute('marker1')).to.be.false;
        expect(sibling.hasAttribute('marker2')).to.be.false;
      });

      describe(`${attr} with shadow DOM`, () => {
        let nested;

        beforeEach(() => {
          const root = sibling.attachShadow({ mode: 'open' });
          nested = document.createElement('span');
          root.appendChild(nested);
        });

        it(`should set ${attr} attribute on elements except the one in shadow DOM`, () => {
          const unhide = hideFunc(nested, parent);
          callbacks.add(unhide);

          // All the elements are hidden
          expect(target1.getAttribute(attr)).to.equal('true');
          expect(target2.parentNode.getAttribute(attr)).to.equal('true');

          // Shadow root host isn't hidden
          expect(sibling.hasAttribute(attr)).to.be.false;
        });

        it(`should set ${attr} attribute on elements except the one in shadow DOM`, () => {
          const unhide = hideFunc(nested, parent);
          callbacks.add(unhide);

          // All the elements are hidden
          expect(target1.getAttribute(attr)).to.equal('true');
          expect(target2.parentNode.getAttribute(attr)).to.equal('true');

          // Shadow root host isn't hidden
          expect(sibling.hasAttribute(attr)).to.be.false;
        });

        it(`should set ${attr} attribute on elements except the one in deep shadow DOM`, () => {
          const deepRoot = nested.attachShadow({ mode: 'open' });
          const deep1 = document.createElement('div');
          const deep2 = document.createElement('div');
          deepRoot.appendChild(deep1);
          deepRoot.appendChild(deep2);

          const unhide = hideFunc(deep1, parent);
          callbacks.add(unhide);

          // Shadow root host isn't hidden
          expect(sibling.hasAttribute(attr)).to.be.false;
          expect(nested.hasAttribute(attr)).to.be.false;

          // Sibling in shadow root is hidden
          expect(deep2.hasAttribute(attr)).to.be.true;
        });

        it(`should not set ${attr} attribute on assigned slot elements of target`, () => {
          const deepRoot = nested.attachShadow({ mode: 'open' });
          deepRoot.innerHTML = '<slot></slot><span></span>';
          const [slot, span] = deepRoot.children;

          const deep = document.createElement('div');
          nested.appendChild(deep);

          const unhide = hideFunc(deep, parent);
          callbacks.add(unhide);

          // Slot in the shadow root isn't hidden
          expect(slot.hasAttribute(attr)).to.be.false;

          // Sibling in the shadow root is hidden
          expect(span.hasAttribute(attr)).to.be.true;
        });

        it(`should remove ${attr} attribute from elements outside the shadow DOM`, () => {
          const unhide = hideFunc(nested, parent);

          unhide();

          // Elements are no longer hidden
          expect(target1.hasAttribute(attr)).to.be.false;
          expect(target2.parentNode.hasAttribute(attr)).to.be.false;
        });

        describe('error handling', () => {
          let errorStub;

          beforeEach(() => {
            errorStub = sinon.stub(console, 'error');
          });

          afterEach(() => {
            errorStub.restore();
          });

          it(`should not throw when trying to set ${attr} and passing empty target`, () => {
            expect(() => {
              hideFunc(null);
            }).to.not.throw(Error);
          });

          it(`should log error when trying to set ${attr} and passing empty target`, () => {
            hideFunc(null);

            expect(errorStub.calledOnce).to.be.true;
            expect(errorStub.firstCall.args[0]).to.include('is not a valid element');
          });

          it(`should not throw when trying to set ${attr} and passing empty parent`, () => {
            expect(() => {
              hideFunc(target1, null);
            }).to.not.throw(Error);
          });

          it(`should log error when trying to set ${attr} and passing empty parent`, () => {
            hideFunc(target1, null);

            expect(errorStub.calledOnce).to.be.true;
            expect(errorStub.firstCall.args[0]).to.include('is not a valid element');
          });

          it(`should not throw when trying to set ${attr} and passing target outside parent`, () => {
            expect(() => {
              hideFunc(target1, sibling);
            }).to.not.throw(Error);
          });

          it(`should log error when trying to set ${attr} and passing target outside parent`, () => {
            hideFunc(target1, sibling);

            expect(errorStub.calledOnce).to.be.true;
            expect(errorStub.firstCall.args[0]).to.include('is not contained inside');
          });
        });
      });
    });
  });
});
