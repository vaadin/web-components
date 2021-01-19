import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../vaadin-notification.js';

class XNotification extends PolymerElement {
  static get template() {
    return html`
      <vaadin-notification id="notification" duration="20" opened>
        <template>
          <span>[[message]]</span>
          <input value="{{text::input}}" />
        </template>
      </vaadin-notification>
    `;
  }

  static get properties() {
    return {
      message: String,
      text: String
    };
  }
}

customElements.define('x-notification', XNotification);

describe('template', () => {
  let container, notification, content;

  beforeEach(() => {
    container = fixtureSync('<x-notification></x-notification>');
    notification = container.$.notification;
    content = notification._card.shadowRoot.querySelector('[part~="content"]');
  });

  afterEach(() => {
    // Close to stop all pending timers.
    notification.close();
    notification._removeNotificationCard(); // Force sync card removal instead of waiting for the animation
    // delete singleton reference, so as it's created in next test
    delete notification.constructor._container;
  });

  describe('data-binding', () => {
    it('notification should bind parent property', () => {
      container.message = 'foo';
      expect(content.shadowRoot.textContent.trim()).to.equal('foo');
    });

    it('notification should support two-way data binding', () => {
      const input = content.shadowRoot.querySelector('input');
      input.value = 'bar';
      input.dispatchEvent(new CustomEvent('input'));
      expect(container.text).to.equal('bar');
    });
  });
});
