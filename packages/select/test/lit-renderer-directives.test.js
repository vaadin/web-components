import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-select.js';
import { html, render } from 'lit';
import { selectRenderer } from '../lit.js';

async function renderOpenedSelect(container, { content }) {
  render(
    html`<vaadin-select opened ${content ? selectRenderer(() => html`${content}`, content) : null}></vaadin-select>`,
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
        overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(select.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderOpenedSelect(container, {});
        expect(select.renderer).not.to.exist;
      });

      it('should render the content with the renderer', () => {
        expect(overlay.textContent).to.equal('Content');
      });

      it('should re-render the content when a renderer dependency changes', async () => {
        await renderOpenedSelect(container, { content: 'New Content' });
        expect(overlay.textContent).to.equal('New Content');
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
