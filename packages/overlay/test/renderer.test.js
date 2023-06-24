import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-overlay.js';

describe('renderer', () => {
  let overlay, content;

  beforeEach(async () => {
    overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
    await nextRender();
    content = document.createElement('p');
    content.textContent = 'renderer-content';
  });

  afterEach(async () => {
    overlay.opened = false;
    await nextRender();
  });

  it('should use renderer when it is defined', async () => {
    overlay.renderer = (root) => root.appendChild(content);
    overlay.opened = true;
    await nextRender();
    expect(overlay.textContent.trim()).to.equal('renderer-content');
  });

  it('should receive empty root, model and owner when they are defined', async () => {
    const overlayOwner = {};
    const overlayModel = {};

    overlay.owner = overlayOwner;
    overlay.model = overlayModel;

    const renderer = sinon.spy();

    overlay.renderer = renderer;
    overlay.opened = true;
    await nextRender();

    const [root, owner, model] = renderer.firstCall.args;
    expect(root.firstChild).to.be.null;
    expect(owner).to.eql(overlayOwner);
    expect(model).to.eql(overlayModel);
  });

  it('should clean the root on renderer change', async () => {
    overlay.renderer = (root) => root.appendChild(content);
    overlay.opened = true;
    await nextRender();
    expect(overlay.textContent.trim()).to.equal('renderer-content');

    const renderer = sinon.spy();
    overlay.renderer = renderer;
    await nextRender();

    const root = renderer.firstCall.args[0];
    expect(root.firstChild).to.be.null;
  });

  it('should not clean the root on model or owner change', async () => {
    overlay.renderer = (root) => root.appendChild(content);
    overlay.opened = true;
    await nextRender();
    expect(overlay.textContent.trim()).to.equal('renderer-content');

    const overlayOwner = {};
    const overlayModel = {};

    overlay.owner = overlayOwner;
    overlay.model = overlayModel;
    await nextRender();

    expect(overlay.textContent.trim()).to.equal('renderer-content');
  });

  it('should pass owner as this to the renderer', async () => {
    const owner = {};
    overlay.owner = owner;

    const renderer = sinon.spy();
    overlay.renderer = renderer;

    overlay.opened = true;
    await nextRender();

    expect(renderer.firstCall.thisValue).to.equal(owner);
  });

  it('should call renderer on model change', async () => {
    const spy = sinon.spy();

    overlay.opened = true;
    overlay.renderer = () => spy();
    await nextRender();

    spy.resetHistory();
    overlay.model = {};
    await nextRender();

    expect(spy.calledOnce).to.be.true;
  });

  it('should call renderer on owner change', async () => {
    const spy = sinon.spy();

    overlay.opened = true;
    overlay.renderer = () => spy();
    await nextRender();

    spy.resetHistory();
    overlay.owner = {};
    await nextRender();

    expect(spy.calledOnce).to.be.true;
  });

  it('should call renderer when requesting content update', () => {
    overlay.renderer = sinon.spy();
    overlay.requestContentUpdate();

    expect(overlay.renderer.calledOnce).to.be.true;
  });

  it('should not call renderer if overlay is not open', async () => {
    const spy = sinon.spy();
    overlay.renderer = () => spy();
    await nextRender();
    expect(spy.called).to.be.false;
  });

  it('should clear the content when removing the renderer', async () => {
    overlay.renderer = (root) => {
      root.innerHTML = 'foo';
    };

    overlay.opened = true;
    await nextRender();
    expect(overlay.textContent.trim()).to.equal('foo');

    overlay.renderer = null;
    await nextRender();
    expect(overlay.textContent.trim()).to.equal('');
  });
});
