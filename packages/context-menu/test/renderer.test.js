import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';

describe('renderer', () => {
  let menu, target, overlay;

  beforeEach(async () => {
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
        document.createTextNode(`Renderer ${context.detail && context.detail.foo} ${context.target.id}`),
      );
    });
    await nextRender();
    target = menu.querySelector('#target');
    overlay = menu._overlayElement;
  });

  afterEach(() => {
    menu.close();
  });

  it('should render on open', async () => {
    expect(menu.renderer.callCount).to.equal(0);

    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(menu.renderer.callCount).to.equal(1);
    expect(overlay.textContent).to.contain('Renderer');
  });

  it('should have target in context', async () => {
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(overlay.textContent).to.contain('target');
  });

  it('should have detail in context', async () => {
    fire(target, 'vaadin-contextmenu', { foo: 'bar' });
    await nextRender();

    expect(overlay.textContent).to.contain('bar');
  });

  it('should have contextMenu owner argument', async () => {
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(menu.renderer.firstCall.args[1]).to.equal(menu);
  });

  it('should rerender on reopen', async () => {
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    menu.close();

    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(1).args).to.deep.equal(menu.renderer.getCall(0).args);
  });

  it('should rerender with new target on reopen', async () => {
    const otherTarget = document.createElement('div');
    menu.appendChild(otherTarget);

    fire(target, 'vaadin-contextmenu');
    await nextRender();

    menu.close();

    fire(otherTarget, 'vaadin-contextmenu');
    await nextRender();

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(0).args[2].target).to.equal(target);
    expect(menu.renderer.getCall(1).args[2].target).to.equal(otherTarget);
  });

  it('should rerender with new detail on reopen', async () => {
    fire(target, 'vaadin-contextmenu', { foo: 'one' });
    await nextRender();

    menu.close();

    fire(target, 'vaadin-contextmenu', { foo: 'two' });
    await nextRender();

    expect(menu.renderer.callCount).to.equal(2);
    expect(menu.renderer.getCall(0).args[2].detail).to.deep.equal({ foo: 'one' });
    expect(menu.renderer.getCall(1).args[2].detail).to.deep.equal({ foo: 'two' });
  });

  it('should run renderers when requesting content update', async () => {
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(menu.renderer.calledOnce).to.be.true;

    menu.requestContentUpdate();

    expect(menu.renderer.calledTwice).to.be.true;
  });

  it('should clear the content when removing the renderer', async () => {
    menu.renderer = (root) => {
      root.innerHTML = 'foo';
    };
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(overlay.textContent.trim()).to.equal('foo');

    menu.renderer = null;
    await nextRender();

    expect(overlay.textContent.trim()).to.equal('');
  });

  it('should not throw if requestContentUpdate() called before adding to DOM', () => {
    const contextMenu = document.createElement('vaadin-context-menu');
    expect(() => contextMenu.requestContentUpdate()).not.to.throw(Error);
  });
});
