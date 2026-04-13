import { expect } from '@vaadin/chai-plugins';
import { nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { cancel, flush, schedule } from '../src/dom-read-write.js';

describe('dom-read-write', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  afterEach(() => {
    // Clean up any pending tasks
    cancel();
  });

  describe('schedule', () => {
    it('should execute read and write callbacks on next microtask', async () => {
      const readSpy = sinon.spy();
      const writeSpy = sinon.spy();
      schedule(element, { read: readSpy, write: writeSpy });
      expect(readSpy).to.not.be.called;
      expect(writeSpy).to.not.be.called;

      await nextFrame();
      expect(readSpy).to.be.calledOnce;
      expect(writeSpy).to.be.calledOnce;
    });

    it('should execute read before write', async () => {
      const calls = [];
      schedule(element, {
        read: () => calls.push('read'),
        write: () => calls.push('write'),
      });

      await nextFrame();
      expect(calls).to.eql(['read', 'write']);
    });

    it('should schedule only a read callback', async () => {
      const readSpy = sinon.spy();
      schedule(element, { read: readSpy });

      await nextFrame();
      expect(readSpy).to.be.calledOnce;
    });

    it('should schedule only a write callback', async () => {
      const writeSpy = sinon.spy();
      schedule(element, { write: writeSpy });

      await nextFrame();
      expect(writeSpy).to.be.calledOnce;
    });

    it('should keep tasks for different elements', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      await nextFrame();
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.be.calledOnce;
    });

    it('should execute reads before writes across elements', async () => {
      const other = document.createElement('div');
      const calls = [];
      schedule(element, {
        read: () => calls.push('read-1'),
        write: () => calls.push('write-1'),
      });
      schedule(other, {
        read: () => calls.push('read-2'),
        write: () => calls.push('write-2'),
      });

      await nextFrame();
      expect(calls).to.eql(['read-1', 'read-2', 'write-1', 'write-2']);
    });
  });

  describe('flush', () => {
    it('should flush all pending tasks when called without arguments', () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      flush();
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.be.calledOnce;
    });

    it('should flush only tasks for the given element', () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      flush(element);
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.not.be.called;
    });

    it('should not execute flushed tasks again on next frame', async () => {
      const spy = sinon.spy();
      schedule(element, { write: spy });

      flush(element);
      expect(spy).to.be.calledOnce;

      await nextFrame();
      expect(spy).to.be.calledOnce;
    });

    it('should still execute remaining tasks on next frame', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      flush(element);
      expect(spy1).to.be.calledOnce;
      expect(spy2).to.not.be.called;

      await nextFrame();
      expect(spy2).to.be.calledOnce;
    });

    it('should execute read before write when flushing', () => {
      const calls = [];
      schedule(element, {
        read: () => calls.push('read'),
        write: () => calls.push('write'),
      });

      flush(element);
      expect(calls).to.eql(['read', 'write']);
    });
  });

  describe('cancel', () => {
    it('should cancel all pending tasks when called without arguments', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      cancel();

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.not.be.called;
    });

    it('should cancel only tasks for the given element', async () => {
      const other = document.createElement('div');
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      schedule(element, { write: spy1 });
      schedule(other, { write: spy2 });

      cancel(element);

      await nextFrame();
      expect(spy1).to.not.be.called;
      expect(spy2).to.be.calledOnce;
    });

    it('should cancel both read and write for the given element', async () => {
      const readSpy = sinon.spy();
      const writeSpy = sinon.spy();
      schedule(element, { read: readSpy, write: writeSpy });

      cancel(element);

      await nextFrame();
      expect(readSpy).to.not.be.called;
      expect(writeSpy).to.not.be.called;
    });
  });
});
