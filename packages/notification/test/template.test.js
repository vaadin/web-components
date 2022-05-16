import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-notification.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

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
      text: String,
    };
  }
}

customElements.define('x-notification', XNotification);

describe('template', () => {
  it('should render the template', () => {
    const notification = fixtureSync(`
      <vaadin-notification opened>
        <template>foo</template>
      </vaadin-notification>
    `);

    expect(notification._card.textContent.trim()).to.equal('foo');
  });

  describe('data-binding', () => {
    let container, notification;

    beforeEach(() => {
      container = fixtureSync('<x-notification></x-notification>');
      notification = container.$.notification;
    });

    afterEach(() => {
      // Close to stop all pending timers.
      notification.close();
      notification._removeNotificationCard(); // Force sync card removal instead of waiting for the animation
      // delete singleton reference, so as it's created in next test
      delete notification.constructor._container;
    });

    it('notification should bind parent property', () => {
      container.message = 'foo';

      expect(notification._card.textContent.trim()).to.equal('foo');
    });

    it('notification should support two-way data binding', () => {
      const input = notification._card.querySelector('input');
      input.value = 'bar';
      input.dispatchEvent(new CustomEvent('input'));
      expect(container.text).to.equal('bar');
    });
  });
});
