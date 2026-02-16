import { expect } from '@vaadin/chai-plugins';
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

    await Promise.resolve();

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
    await Promise.resolve();
    spy.resetHistory();

    const div = document.createElement('div');
    host.appendChild(div);

    // Wait for slotchange
    await Promise.resolve();
    // Wait for microtask
    await Promise.resolve();

    expect(spy.calledOnce).to.be.true;
    const addedNodes = spy.firstCall.args[0].addedNodes;
    expect(addedNodes.length).to.equal(1);
    expect(addedNodes[0]).to.equal(div);
  });

  it('should run callback asynchronously after node is removed', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    const div = host.firstElementChild;
    host.removeChild(div);

    // Wait for slotchange
    await Promise.resolve();
    // Wait for microtask
    await Promise.resolve();

    expect(spy.calledOnce).to.be.true;
    const removedNodes = spy.firstCall.args[0].removedNodes;
    expect(removedNodes.length).to.equal(1);
    expect(removedNodes[0]).to.equal(div);
  });

  it('should run callback asynchronously after node is moved', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    const nodes = host.children;
    host.insertBefore(nodes[1], nodes[0]);

    // Wait for slotchange
    await Promise.resolve();
    // Wait for microtask
    await Promise.resolve();

    expect(spy.calledOnce).to.be.true;
    const movedNodes = spy.firstCall.args[0].movedNodes;
    expect(movedNodes.length).to.equal(2);
    expect(movedNodes[0]).to.equal(nodes[1]);
    expect(movedNodes[1]).to.equal(nodes[0]);
  });

  it('should run callback synchronously when calling flush()', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    const div = document.createElement('div');
    host.appendChild(div);

    observer.flush();

    expect(spy.calledOnce).to.be.true;
    const addedNodes = spy.firstCall.args[0].addedNodes;
    expect(addedNodes[0]).to.equal(div);
  });

  it('should not run callback after node is added if disconnected', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    observer.disconnect();

    const div = document.createElement('div');
    host.appendChild(div);

    // Wait for slotchange
    await Promise.resolve();
    // Wait for microtask
    await Promise.resolve();

    expect(spy.called).to.be.false;
  });

  it('should not run callback when calling flush() if disconnected', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    observer.disconnect();

    const div = document.createElement('div');
    host.appendChild(div);

    observer.flush();

    expect(spy.called).to.be.false;
  });

  it('should run callback when calling flush() if re-connected', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();
    spy.resetHistory();

    observer.disconnect();
    observer.connect();

    const div = document.createElement('div');
    host.appendChild(div);

    observer.flush();

    expect(spy.calledOnce).to.be.true;
  });

  it('should include current nodes in the callback', async () => {
    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    expect(spy.called).to.be.false;

    await Promise.resolve();

    const childNodes = [...host.childNodes];
    const currentNodes = spy.firstCall.args[0].currentNodes;

    expect(currentNodes).to.be.an('array');
    expect(currentNodes.length).to.equal(3);
    expect(currentNodes).to.eql(childNodes);

    spy.resetHistory();

    childNodes[1].remove();
    observer.flush();

    const newCurrentNodes = spy.firstCall.args[0].currentNodes;
    expect(newCurrentNodes.length).to.equal(2);
    expect(newCurrentNodes).to.eql([childNodes[0], childNodes[2]]);
  });

  it('should not run callback if there is no child nodes by default', async () => {
    host.innerHTML = '';

    spy = sinon.spy();
    observer = new SlotObserver(slot, spy);
    await Promise.resolve();

    expect(spy).to.be.not.called;
  });

  it('should run callback if there is no child nodes with forceInitial: true', async () => {
    host.innerHTML = '';

    spy = sinon.spy();
    observer = new SlotObserver(slot, spy, true);
    await Promise.resolve();

    expect(spy).to.be.calledOnce;
  });

  it('should not run callback again after flush with forceInitial: true', async () => {
    host.innerHTML = '';

    spy = sinon.spy();
    observer = new SlotObserver(slot, spy, true);
    await Promise.resolve();

    spy.resetHistory();

    observer.flush();

    expect(spy).to.be.not.called;
  });
});
