import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { html, render } from 'lit';
import { contextMenuRenderer } from '../lit.js';

async function renderContextMenu(container, { content }) {
  render(
    html`<vaadin-context-menu open-on="click" ${content ? contextMenuRenderer(() => html`${content}`, content) : null}>
      <button>Target</button>
    </vaadin-context-menu>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-context-menu');
}

describe('lit renderer directives', () => {
  let container, contextMenu, target, overlay;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('contextMenuRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        contextMenu = await renderContextMenu(container, { content: 'Content' });
        target = contextMenu.querySelector('button');
        overlay = contextMenu.$.overlay;
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(contextMenu.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderContextMenu(container, {});
        expect(contextMenu.renderer).not.to.exist;
      });

      it('should render the content with the renderer when the menu is opened', () => {
        target.click();
        expect(overlay.textContent).to.equal('Content');
      });

      it('should re-render the content when the menu is opened and a renderer dependency changes', async () => {
        target.click();
        await renderContextMenu(container, { content: 'New Content' });
        expect(overlay.textContent).to.equal('New Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-context-menu open-on="click" ${contextMenuRenderer(rendererSpy)}>
            <button></button>
          </vaadin-context-menu>`,
          container,
        );
        await nextFrame();
        contextMenu = container.querySelector('vaadin-context-menu');
        target = contextMenu.querySelector('button');
        target.click();
      });

      it('should pass the context object to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.have.property('detail');
        expect(rendererSpy.firstCall.args[0]).to.have.property('target');
      });

      it('should pass the context-menu instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[1]).to.equal(contextMenu);
      });
    });
  });
});
