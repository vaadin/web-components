import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-notification.js';
import { html, render } from 'lit';
import { notificationRenderer } from '../lit.js';

async function renderNotification(container, { content }) {
  render(
    html`<vaadin-notification
      ${content ? notificationRenderer(() => html`${content}`, content) : null}
    ></vaadin-notification>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-notification');
}

describe('lit renderer directives', () => {
  let container, notification, card;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('notificationRenderer', () => {
    describe('basic', () => {
      beforeEach(async () => {
        notification = await renderNotification(container, { content: 'Content' });
        card = notification.shadowRoot.querySelector('vaadin-notification-card');
        notification.open();
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(notification.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderNotification(container, {});
        expect(notification.renderer).not.to.exist;
      });

      it('should render the content with the renderer', () => {
        expect(card.textContent).to.equal('Content');
      });

      it('should re-render the content when a renderer dependency changes', async () => {
        await renderNotification(container, { content: 'New Content' });
        expect(card.textContent).to.equal('New Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-notification opened ${notificationRenderer(rendererSpy)}></vaadin-notification>`,
          container,
        );
        await nextFrame();
        notification = container.querySelector('vaadin-notification');
      });

      it('should pass the notification instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal(notification);
      });
    });
  });
});
