import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-virtual-list.js';
import { html, render } from 'lit';
import { virtualListRenderer } from '../lit.js';

async function renderVirtualList(container, { items }) {
  render(
    html`
      <vaadin-virtual-list
        .items="${items}"
        ${items ? virtualListRenderer((item) => html`${item}`, items) : null}
      ></vaadin-virtual-list>
    `,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-virtual-list');
}

describe('lit renderer directive', () => {
  let container, list;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('virtualListRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        list = await renderVirtualList(container, { items: ['Item'] });
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(list.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderVirtualList(container, {});
        expect(list.renderer).not.to.exist;
      });

      it('should render items when the renderer directive is attached', () => {
        expect(list.children[0].textContent.trim()).to.equal('Item');
      });

      it('should re-render items when the renderer dependency changes', async () => {
        await renderVirtualList(container, { items: ['New Item'] });
        expect(list.children[0].textContent.trim()).to.equal('New Item');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-virtual-list .items="${['Item']}" ${virtualListRenderer(rendererSpy)}></vaadin-virtual-list>`,
          container,
        );
        await nextFrame();
        list = container.querySelector('vaadin-virtual-list');
      });

      it('should pass the item to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal('Item');
      });

      it('should pass the model to the renderer', () => {
        expect(rendererSpy.firstCall.args[1]).to.deep.equal({
          item: 'Item',
          index: 0,
        });
      });

      it('should pass the virtual-list instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[2]).to.equal(list);
      });
    });
  });
});
