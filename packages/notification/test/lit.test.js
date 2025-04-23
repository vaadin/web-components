import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-notification.js';
import { html, render } from 'lit';

describe('lit', () => {
  describe('renderer', () => {
    let notification;

    beforeEach(async () => {
      notification = fixtureSync(`<vaadin-notification></vaadin-notification>`);
      await nextFrame();
      notification.open();
      notification.renderer = (root) => {
        render(html`Initial Content`, root);
      };
    });

    it('should render the content', () => {
      expect(notification._card.textContent).to.equal('Initial Content');
    });

    it('should render new content after assigning a new renderer', () => {
      notification.renderer = (root) => {
        render(html`New Content`, root);
      };

      expect(notification._card.textContent).to.equal('New Content');
    });
  });
});
