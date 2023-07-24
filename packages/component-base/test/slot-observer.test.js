import { expect } from '@esm-bundle/chai';
import { aTimeout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { SlotObserver } from '../src/slot-observer.js';

describe('SlotObserver', () => {
  let host, slot, observer, spy;

  beforeEach(() => {
    host = document.createElement('div');
    host.attachShadow({ mode: 'open' });
    host.shadowRoot.innerHTML = '<slot></slot>';
    slot = host.shadowRoot.firstElementChild;
    document.body.appendChild(host);
    host.innerHTML = '<div>foo</div><div>bar</div><div>baz</div>';
  });

  afterEach(() => {
    host.remove();
  });

  it('should run callback for initial nodes asynchronously', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    expect(spy.called).to.be.false;

    await aTimeout(0);

    const addedNodes = spy.firstCall.args[0].addedNodes;

    expect(addedNodes).to.be.an('array');
    expect(addedNodes.length).to.equal(3);
    expect(addedNodes[0]).to.equal(host.childNodes[0]);
    expect(addedNodes[1]).to.equal(host.childNodes[1]);
    expect(addedNodes[2]).to.equal(host.childNodes[2]);
  });

  it('should run callback asynchronously after node is added', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await aTimeout(0);
    spy.resetHistory();

    const div = document.createElement('div');
    host.appendChild(div);
    await aTimeout(0);

    expect(spy.called).to.be.true;
    const addedNodes = spy.firstCall.args[0].addedNodes;
    expect(addedNodes.length).to.equal(1);
    expect(addedNodes[0]).to.equal(div);
  });

  it('should run callback asynchronously after node is removed', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await aTimeout(0);
    spy.resetHistory();

    const div = host.firstElementChild;
    host.removeChild(div);
    await aTimeout(0);

    expect(spy.calledOnce).to.be.true;
    const removedNodes = spy.firstCall.args[0].removedNodes;
    expect(removedNodes.length).to.equal(1);
    expect(removedNodes[0]).to.equal(div);
  });

  it('should run callback asynchronously after node is moved', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await aTimeout(0);
    spy.resetHistory();

    const nodes = host.children;
    host.insertBefore(nodes[1], nodes[0]);
    await aTimeout(0);

    expect(spy.calledOnce).to.be.true;
    const movedNodes = spy.firstCall.args[0].movedNodes;
    expect(movedNodes.length).to.equal(2);
    expect(movedNodes[0]).to.equal(nodes[1]);
    expect(movedNodes[1]).to.equal(nodes[0]);
  });

  it('should run callback synchronously when calling flush()', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await aTimeout(0);
    spy.resetHistory();

    const div = document.createElement('div');
    host.appendChild(div);

    observer.flush();

    expect(spy.calledOnce).to.be.true;
    const addedNodes = spy.firstCall.args[0].addedNodes;
    expect(addedNodes[0]).to.equal(div);
  });
});
