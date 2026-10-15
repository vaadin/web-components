import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-popover.js';
import { html, nothing, render } from 'lit';
import { popoverRenderer } from '../lit.js';

async function renderOpenedPopover(container, { content }) {
  render(
    html`
      <vaadin-popover opened ${content ? popoverRenderer(() => html`${content}`, content) : nothing}></vaadin-popover>
    `,
    container,
  );
  const popover = container.querySelector('vaadin-popover');
  await nextUpdate(popover);
  return popover;
}

describe('lit renderer directives', () => {
  let container, popover;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('popoverRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        popover = await renderOpenedPopover(container, { content: 'Content' });
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(popover.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderOpenedPopover(container, {});
        expect(popover.renderer).not.to.exist;
      });

      it('should render the content with the renderer', () => {
        expect(popover.textContent).to.equal('Content');
      });

      it('should re-render the content when a renderer dependency changes', async () => {
        await renderOpenedPopover(container, { content: 'New Content' });
        expect(popover.textContent).to.equal('New Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(html`<vaadin-popover opened ${popoverRenderer(rendererSpy)}></vaadin-popover>`, container);
        await nextFrame();
        popover = container.querySelector('vaadin-popover');
      });

      it('should pass the popover instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal(popover);
      });
    });
  });
});
