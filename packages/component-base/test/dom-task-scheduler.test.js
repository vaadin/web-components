import { expect } from '@vaadin/chai-plugins';
import { nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { cancelWrites, flushWrites, scheduleWrite } from '../src/dom-task-scheduler.js';

describe('dom-task-scheduler', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  afterEach(() => {
    // Clean up any pending writes
    cancelWrites();
  });

  describe('scheduleWrite', () => {
    it('should execute callback on next animation frame', async () => {
      const spy = sinon.spy();
      scheduleWrite(element, spy);
      expect(spy).to.not.be.called;

      await nextFrame();
      expect(spy).to.be.calledOnce;
    });

    it('should replace a previous write for the same element', async () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(element, spy2);

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.be.calledOnce;
    });

    it('should replace a previous write for the same element and id', async () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1, { id: 'resize' });
      scheduleWrite(element, spy2, { id: 'resize' });

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.be.calledOnce;
    });

    it('should keep writes with different ids for the same element', async () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1, { id: 'resize' });
      scheduleWrite(element, spy2, { id: 'scroll' });

      await nextFrame();
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.be.calledOnce;
    });

    it('should keep writes for different elements', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      await nextFrame();
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.be.calledOnce;
    });

    it('should execute callbacks in scheduling order', async () => {
      const other = document.createElement('div');
      const calls = [];
      scheduleWrite(element, () => calls.push('first'));
      scheduleWrite(other, () => calls.push('second'));

      await nextFrame();
      expect(calls).to.eql(['first', 'second']);
    });
  });

  describe('flushWrites', () => {
    it('should flush all pending writes when called without arguments', () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      flushWrites();
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.be.calledOnce;
    });

    it('should flush only writes for the given element', () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      flushWrites(element);
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.not.be.called;
    });

    it('should flush only writes matching the given element and id', () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1, { id: 'resize' });
      scheduleWrite(element, spy2, { id: 'scroll' });

      flushWrites(element, { id: 'resize' });
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.not.be.called;
    });

    it('should not execute flushed writes again on next frame', async () => {
      const spy = sinon.spy();
      scheduleWrite(element, spy);

      flushWrites(element);
      expect(spy).to.be.calledOnce;

      await nextFrame();
      expect(spy).to.be.calledOnce;
    });

    it('should still execute remaining writes on next frame', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      flushWrites(element);
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.not.be.called;

      await nextFrame();
      expect(spy2).to.be.calledOnce;
    });
  });

  describe('cancelWrites', () => {
    it('should cancel all pending writes when called without arguments', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      cancelWrites();

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.not.be.called;
    });

    it('should cancel only writes for the given element', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1);
      scheduleWrite(other, spy2);

      cancelWrites(element);

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.be.calledOnce;
    });

    it('should cancel only writes matching the given element and id', async () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      scheduleWrite(element, spy1, { id: 'resize' });
      scheduleWrite(element, spy2, { id: 'scroll' });

      cancelWrites(element, { id: 'resize' });

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.be.calledOnce;
    });
  });
});
