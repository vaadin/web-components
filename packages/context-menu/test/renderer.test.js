import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('renderer', () => {
  let menu, target;

  beforeEach(() => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <div id="target"></div>
      </vaadin-context-menu>
    `);
    menu.renderer = sinon.spy((root, _, context) => {
      if (root.firstChild) {
        return;
      }
      root.appendChild(
        document.createTextNode(`Renderer ${context.detail && context.detail.foo} ${context.target.id}`)
      );
    });
    target = menu.querySelector('#target');
  });

  afterEach(() => {
    menu.close();
  });

  it('should render on open', () => {
    expect(menu.renderer.callCount).to.equal(0);

    fire(target, 'vaadin-contextmenu');

    expect(menu.renderer.callCount).to.equal(1);
    expect(menu.$.overlay.content.textContent).to.contain('Renderer');
  });

  it('should have target in context', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu.$.overlay.content.textContent).to.contain('target');
  });

  it('should have detail in context', () => {
    fire(target, 'vaadin-contextmenu', { foo: 'bar' });

    expect(menu.$.overlay.content.textContent).to.contain('bar');
  });

  it('should have contextMenu owner argument', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu.renderer.firstCall.args[1]).to.equal(menu);
  });

  it('should rerender on reopen', () => {
    fire(target, 'vaadin-contextmenu');
    menu.close();
    fire(target, 'vaadin-contextmenu');

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(1).args).to.deep.equal(menu.renderer.getCall(0).args);
  });

  it('should rerender with new target on reopen', () => {
    const otherTarget = document.createElement('div');
    menu.appendChild(otherTarget);
    fire(target, 'vaadin-contextmenu');
    menu.close();
    fire(otherTarget, 'vaadin-contextmenu');

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(0).args[2].target).to.equal(target);
    expect(menu.renderer.getCall(1).args[2].target).to.equal(otherTarget);
  });

  it('should rerender with new detail on reopen', () => {
    fire(target, 'vaadin-contextmenu', { foo: 'one' });
    menu.close();
    fire(target, 'vaadin-contextmenu', { foo: 'two' });

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(0).args[2].detail).to.deep.equal({ foo: 'one' });
    expect(menu.renderer.getCall(1).args[2].detail).to.deep.equal({ foo: 'two' });
  });

  it('should run renderers when requesting content update', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu.renderer.calledOnce).to.be.true;

    menu.requestContentUpdate();

    expect(menu.renderer.calledTwice).to.be.true;
  });

  it('should request content update when calling deprecated render()', () => {
    const stub = sinon.stub(menu, 'requestContentUpdate');
    fire(target, 'vaadin-contextmenu');
    menu.render();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should warn when calling deprecated render()', () => {
    const stub = sinon.stub(console, 'warn');
    fire(target, 'vaadin-contextmenu');
    menu.render();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
    expect(stub.args[0][0]).to.equal(
      'WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.'
    );
  });

  it('should clear the content when removing the renderer', () => {
    menu.renderer = (root) => {
      root.innerHTML = 'foo';
    };
    fire(target, 'vaadin-contextmenu');

    expect(menu.$.overlay.content.textContent.trim()).to.equal('foo');

    menu.renderer = null;

    expect(menu.$.overlay.content.textContent.trim()).to.equal('');
  });
});
