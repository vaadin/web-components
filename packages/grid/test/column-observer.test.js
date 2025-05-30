import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import { ColumnObserver } from '../src/vaadin-grid-helpers.js';

function createColumn() {
  return document.createElement('vaadin-grid-column');
}

class Wrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
        <div id="host"></div>
    `;
  }
}

customElements.define('wrapper-component', Wrapper);

describe('column observer', () => {
  let wrapper;
  let host;
  let spy;
  let observer;

  beforeEach(async () => {
    wrapper = fixtureSync('<wrapper-component></wrapper-component>');
    host = wrapper.shadowRoot.querySelector('#host');
    spy = sinon.spy();
    observer = new ColumnObserver(host, spy);
    await nextFrame();

    // Expect the initial call
    expect(spy.calledOnce).to.be.true;
    spy.resetHistory();
  });

  it('should call the callback when a column is added', async () => {
    const column = createColumn();
    host.appendChild(column);
    await nextFrame();

    expect(spy.calledOnce).to.be.true;

    const [addedColumns, removedColumns] = spy.getCalls()[0].args;
    expect(addedColumns).to.deep.equal([column]);
    expect(removedColumns).to.deep.equal([]);
  });

  it('should call the callback when a column is removed', async () => {
    const column = createColumn();
    host.appendChild(column);
    await nextFrame();
    host.removeChild(column);
    await nextFrame();

    expect(spy.calledTwice).to.be.true;

    const [addedColumns, removedColumns] = spy.getCalls()[1].args;
    expect(addedColumns).to.deep.equal([]);
    expect(removedColumns).to.deep.equal([column]);
  });

  it('should call the callback synchronously on flush', () => {
    const column = createColumn();
    host.appendChild(column);
    observer.flush();

    expect(spy.calledOnce).to.be.true;
  });

  it('should not call the callback when a non-column is added', () => {
    host.appendChild(document.createElement('div'));
    observer.flush();

    expect(spy).not.to.have.been.called;
  });

  it('should call the callback when a column order is changed', async () => {
    const column = createColumn();
    host.appendChild(column);
    const column2 = createColumn();
    host.appendChild(column2);
    observer.flush();
    spy.resetHistory();

    // Reorder columns
    host.appendChild(column);
    await nextFrame();

    expect(spy.calledOnce).to.be.true;

    const [addedColumns, removedColumns] = spy.getCalls()[0].args;
    expect(addedColumns).to.deep.equal([]);
    expect(removedColumns).to.deep.equal([]);
  });

  it('should stop observing when disconnected', async () => {
    observer.disconnect();
    const column = createColumn();
    host.appendChild(column);
    await nextFrame();

    expect(spy).not.to.have.been.called;
  });

  it('should not call the callback initially when disconnected', async () => {
    const newObserver = new ColumnObserver(host, spy);
    newObserver.disconnect();
    await nextFrame();

    expect(spy).not.to.have.been.called;
  });

  it('should support custom _isColumnElement', async () => {
    const customColumn = document.createElement('div');
    host._isColumnElement = (node) => node === customColumn;
    host.appendChild(customColumn);
    await nextFrame();

    expect(spy.calledOnce).to.be.true;

    const [addedColumns, removedColumns] = spy.getCalls()[0].args;
    expect(addedColumns).to.deep.equal([customColumn]);
    expect(removedColumns).to.deep.equal([]);
  });

  describe('slotted column', () => {
    let slot;
    let column;

    beforeEach(async () => {
      slot = document.createElement('slot');
      host.appendChild(slot);
      column = createColumn();
      wrapper.appendChild(column);
      await nextFrame();

      expect(spy.calledOnce).to.be.true;

      const [addedColumns, removedColumns] = spy.getCalls()[0].args;
      expect(addedColumns).to.deep.equal([column]);
      expect(removedColumns).to.deep.equal([]);

      spy.resetHistory();
    });

    it('should call the callback when a slotted column is removed', async () => {
      column.remove();
      await nextFrame();

      expect(spy.calledOnce).to.be.true;

      const [addedColumns, removedColumns] = spy.getCalls()[0].args;
      expect(addedColumns).to.deep.equal([]);
      expect(removedColumns).to.deep.equal([column]);
    });

    it('should call the callback when a slot is removed', async () => {
      slot.remove();
      await nextFrame();

      expect(spy.calledOnce).to.be.true;

      const [addedColumns, removedColumns] = spy.getCalls()[0].args;
      expect(addedColumns).to.deep.equal([]);
      expect(removedColumns).to.deep.equal([column]);
    });

    it('should clean up slot listeners', async () => {
      const mutationSpy = sinon.spy(observer, '__onMutation');
      observer.flush();
      expect(mutationSpy.calledOnce).to.be.true;
      slot.remove();
      mutationSpy.resetHistory();

      slot.appendChild(createColumn());
      await nextFrame();
      expect(mutationSpy).not.to.have.been.called;
    });

    it('should not call the callback when a non-column is slotted', () => {
      wrapper.appendChild(document.createElement('div'));
      observer.flush();

      expect(spy).not.to.have.been.called;
    });

    it('should stop listening to slotchange events when disconnected', async () => {
      observer.disconnect();
      wrapper.appendChild(createColumn());
      await nextFrame();

      expect(spy).not.to.have.been.called;
    });

    it('should call the callback when a column is added trough multiple slots', async () => {
      const slot2 = document.createElement('slot');
      wrapper.appendChild(slot2);

      const wrapper2 = document.createElement('wrapper-component');
      wrapper2.shadowRoot.appendChild(wrapper);

      const column = createColumn();
      wrapper2.appendChild(column);
      await nextFrame();

      expect(spy.calledOnce).to.be.true;

      const [addedColumns, removedColumns] = spy.getCalls()[0].args;
      expect(addedColumns).to.deep.equal([column]);
      expect(removedColumns).to.deep.equal([]);
    });
  });
});
