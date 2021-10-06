import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, render } from 'lit';

import '../vaadin-notification.js';

describe('lit', () => {
  describe('renderer', () => {
    let notification;

    beforeEach(() => {
      notification = fixtureSync(`<vaadin-notification></vaadin-notification>`);
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
