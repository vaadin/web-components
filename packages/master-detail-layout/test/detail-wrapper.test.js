import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-master-detail-layout.js';
import '../vaadin-master-detail-layout-detail.js';
import './helpers/master-content.js';
import './helpers/detail-content.js';

describe('Detail wrapper', () => {
  const originalStartViewTransition = document.startViewTransition;

  let layout, detailsWrapper;
  let startViewTransitionSpy;
  let transitionType;
  let beforeTransitionChildren, afterTransitionChildren;

  beforeEach(async () => {
    startViewTransitionSpy = sinon.spy();
    document.startViewTransition = (callback) => {
      beforeTransitionChildren = Array.from(detailsWrapper.children);
      transitionType = layout.getAttribute('transition');
      callback();
      afterTransitionChildren = Array.from(detailsWrapper.children);
      startViewTransitionSpy();
      return {
        finished: Promise.resolve(),
      };
    };

    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <master-content></master-content>
        <vaadin-master-detail-layout-detail></vaadin-master-detail-layout-detail>
      </vaadin-master-detail-layout>
    `);
    detailsWrapper = layout.querySelector('vaadin-master-detail-layout-detail');
    await nextRender();
  });

  after(() => {
    document.startViewTransition = originalStartViewTransition;
  });

  it('should detect parent layout when connected', () => {
    expect(detailsWrapper.__layout).to.equal(layout);

    detailsWrapper.remove();

    expect(detailsWrapper.__layout).to.be.null;
  });

  ['supported', 'unsupported'].forEach((support) => {
    it(`should update slot name if view transitions are ${support}`, async () => {
      if (support === 'unsupported') {
        document.startViewTransition = null;
      }

      // Add details
      const detail = document.createElement('detail-content');
      detailsWrapper.append(detail);
      await nextRender();

      expect(detailsWrapper.getAttribute('slot')).to.equal('detail');
      expect(layout.hasAttribute('has-detail')).to.be.true;

      // Replace details
      const newDetail = document.createElement('detail-content');
      detail.remove();
      detailsWrapper.append(newDetail);
      await nextRender();

      expect(detailsWrapper.getAttribute('slot')).to.equal('detail');
      expect(layout.hasAttribute('has-detail')).to.be.true;

      // Remove details
      newDetail.remove();
      await nextRender();

      expect(detailsWrapper.getAttribute('slot')).to.equal('detail-hidden');
      expect(layout.hasAttribute('has-detail')).to.be.false;
    });
  });

  it('should update slot name when disconnected', async () => {
    detailsWrapper.remove();
    const detail = document.createElement('detail-content');
    detailsWrapper.append(detail);
    layout.append(detailsWrapper);
    await nextRender();

    expect(detailsWrapper.getAttribute('slot')).to.equal('detail');
    expect(detailsWrapper.__previousChildren).to.deep.equal([detail]);
    expect(layout.hasAttribute('has-detail')).to.be.true;

    detailsWrapper.remove();
    detail.remove();
    layout.append(detailsWrapper);
    await nextRender();

    expect(detailsWrapper.getAttribute('slot')).to.equal('detail-hidden');
    expect(detailsWrapper.__previousChildren).to.deep.equal([]);
    expect(layout.hasAttribute('has-detail')).to.be.false;
  });

  it('should ignore non-element child nodes', async () => {
    const textNode = document.createTextNode('text');
    detailsWrapper.append(textNode);
    await nextRender();

    expect(detailsWrapper.getAttribute('slot')).to.equal('detail-hidden');
    expect(startViewTransitionSpy.called).to.be.false;

    const commentNode = document.createComment('comment');
    detailsWrapper.innerHTML = '';
    detailsWrapper.append(commentNode);
    await nextRender();

    expect(detailsWrapper.getAttribute('slot')).to.equal('detail-hidden');
    expect(startViewTransitionSpy.called).to.be.false;

    const detail = document.createElement('detail-content');
    detailsWrapper.innerHTML = '';
    detailsWrapper.append(detail);
    await nextRender();

    expect(detailsWrapper.getAttribute('slot')).to.equal('detail');
    expect(startViewTransitionSpy.calledOnce).to.be.true;
  });

  it('should start a transition when slotted content changes', async () => {
    const detail = document.createElement('detail-content');
    detailsWrapper.append(detail);
    await nextRender();

    expect(startViewTransitionSpy.calledOnce).to.be.true;

    detail.remove();
    await nextRender();

    expect(startViewTransitionSpy.calledTwice).to.be.true;
  });

  it('should use the correct transition type', async () => {
    // "add" transition
    const addDetail = document.createElement('detail-content');
    detailsWrapper.append(addDetail);
    await nextRender();

    expect(transitionType).to.equal('add');
    expect(layout.hasAttribute('transition')).to.be.false;

    // "replace" transition
    const replaceDetail = document.createElement('detail-content');
    addDetail.remove();
    detailsWrapper.append(replaceDetail);
    await nextRender();

    expect(transitionType).to.equal('replace');
    expect(layout.hasAttribute('transition')).to.be.false;

    // "remove" transition
    replaceDetail.remove();
    await nextRender();

    expect(transitionType).to.equal('remove');
    expect(layout.hasAttribute('transition')).to.be.false;
  });

  it('should replay DOM operations when starting a transition', async () => {
    // "add" transition
    const addDetail = document.createElement('detail-content');
    detailsWrapper.append(addDetail);
    await nextRender();

    expect(beforeTransitionChildren).to.deep.equal([]);
    expect(afterTransitionChildren).to.deep.equal([addDetail]);

    // "replace" transition
    const replaceDetail = document.createElement('detail-content');
    addDetail.remove();
    detailsWrapper.append(replaceDetail);
    await nextRender();

    expect(beforeTransitionChildren).to.deep.equal([addDetail]);
    expect(afterTransitionChildren).to.deep.equal([replaceDetail]);

    // "remove" transition
    replaceDetail.remove();
    await nextRender();

    expect(beforeTransitionChildren).to.deep.equal([replaceDetail]);
    expect(afterTransitionChildren).to.deep.equal([]);
  });

  describe('noAnimation', () => {
    it('should not start view transition when noAnimation is set to true', async () => {
      layout.noAnimation = true;

      const detail = document.createElement('detail-content');
      detailsWrapper.append(detail);
      await nextRender();

      expect(startViewTransitionSpy.called).to.be.false;

      layout.noAnimation = false;

      detail.remove();
      await nextRender();

      expect(startViewTransitionSpy.calledOnce).to.be.true;
    });
  });

  describe('skipping transitions', () => {
    let resolveTransition;
    let finishedPromise;

    beforeEach(() => {
      document.startViewTransition = (callback) => {
        callback();
        startViewTransitionSpy();
        finishedPromise = new Promise((resolve) => {
          resolveTransition = resolve;
        });
        return {
          finished: finishedPromise,
        };
      };
    });

    it('should skip transition if a transition is already in progress', async () => {
      // Add / remove elements without resolving the first transition
      const detail = document.createElement('detail-content');
      detailsWrapper.append(detail);
      await nextRender();

      detail.remove();
      await nextRender();

      const newDetail = document.createElement('detail-content');
      detailsWrapper.append(newDetail);
      await nextRender();

      resolveTransition();
      await finishedPromise;

      // Should only start one transition
      expect(startViewTransitionSpy.calledOnce).to.be.true;

      // Should only have the last detail
      expect(detailsWrapper.children.length).to.equal(1);
      expect(detailsWrapper.children[0]).to.equal(newDetail);
    });
  });
});
