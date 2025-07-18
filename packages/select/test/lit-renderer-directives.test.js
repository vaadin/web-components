import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-select.js';
import { html, nothing, render } from 'lit';
import { selectRenderer } from '../lit.js';

async function renderOpenedSelect(container, { content }) {
  render(
    html`<vaadin-select opened ${content ? selectRenderer(() => html`${content}`, content) : nothing}></vaadin-select>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-select');
}

describe('lit renderer directives', () => {
  let container, select, overlay;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('selectRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        select = await renderOpenedSelect(container, { content: 'Content' });
        overlay = select._overlayElement;
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(select.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderOpenedSelect(container, {});
        expect(select.renderer).not.to.exist;
      });

      it('should render the content with the renderer', () => {
        expect(overlay._contentRoot.textContent.trim()).to.equal('Content');
      });

      it('should re-render the content when a renderer dependency changes', async () => {
        await renderOpenedSelect(container, { content: 'New Content' });
        expect(overlay._contentRoot.textContent.trim()).to.equal('New Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(html`<vaadin-select opened ${selectRenderer(rendererSpy)}></vaadin-select>`, container);
        await nextFrame();
        select = container.querySelector('vaadin-select');
      });

      it('should pass the select instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal(select);
      });
    });
  });
});
