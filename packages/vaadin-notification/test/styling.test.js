import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../vaadin-notification.js';

customElements.define(
  'local-styles',
  class extends PolymerElement {
    static get template() {
      return html`
        <style>
          :host {
            font-family: ':host';
          }

          .local-styles-content {
            font-family: '.local-styles-content';
          }

          [part='overlay'] {
            font-family: '[part="overlay"]';
          }
        </style>

        <vaadin-notification id="notification" duration="0">
          <template>
            <div class="local-styles-content"></div>
            <div class="global-styles-content"></div>
          </template>
        </vaadin-notification>
      `;
    }

    static get properties() {
      return {
        opened: Boolean
      };
    }
  }
);

function getComputedStyleSource(element) {
  return getComputedStyle(element)
    .getPropertyValue('font-family')
    .trim()
    .replace(/^([''"])(.*)\1/, '$2');
}

describe('notification content styling', () => {
  let notification, card, cardContent;

  before(() => {
    const tpl = document.createElement('template');
    tpl.innerHTML = `
      <style>
        .global-styles-content {
          font-family: ".global-styles-content";
        }
      </style>
    `;
    document.head.appendChild(tpl.content);
  });

  describe('local styles', () => {
    beforeEach(() => {
      const localStyles = fixtureSync('<local-styles></local-styles>');
      notification = localStyles.$.notification;
      card = notification.shadowRoot.querySelector('vaadin-notification-card');
      cardContent = card.shadowRoot.querySelector('[part~="content"]');
      notification.open();
    });

    afterEach(() => {
      // Close everything to stop all pending timers.
      notification.close();
      notification._removeNotificationCard();
      // delete singleton reference, so as it's created in next test
      delete notification.constructor._container;
    });

    it('should stamp content into a shadowRoot', () => {
      expect(cardContent.shadowRoot).to.be.instanceof(ShadowRoot);
    });

    it('should not slot the content', () => {
      expect(cardContent.firstElementChild.assignedSlot).to.be.null;
    });

    it('should apply local styles to notification overlay content', () => {
      expect(getComputedStyleSource(cardContent.shadowRoot.querySelector('.local-styles-content'))).to.equal(
        '.local-styles-content'
      );
    });

    it('should not apply global styles to notification overlay content', () => {
      expect(getComputedStyleSource(cardContent.shadowRoot.querySelector('.global-styles-content'))).to.not.equal(
        '.global-styles-content'
      );
    });

    it('should not apply host styles to notification overlay content', () => {
      expect(getComputedStyleSource(cardContent.shadowRoot.host)).to.not.equal(':host');
    });

    it('should not apply local part styles to notification overlay', () => {
      expect(getComputedStyleSource(card.shadowRoot.querySelector('[part="overlay"]'))).to.not.equal(
        '[part="overlay"]'
      );
    });
  });

  describe('global styles', () => {
    beforeEach(() => {
      notification = fixtureSync(`
        <vaadin-notification id="notification" duration="0">
          <template>
            <div class="local-styles-content"></div>
            <div class="global-styles-content"></div>
          </template>
        </vaadin-notification>
      `);
      card = notification.shadowRoot.querySelector('vaadin-notification-card');
      cardContent = card.shadowRoot.querySelector('[part~="content"]');
      notification.open();
    });

    afterEach(() => {
      // Close everything to stop all pending timers.
      notification.close();
      notification._removeNotificationCard();
      // delete singleton reference, so as it's created in next test
      delete notification.constructor._container;
    });

    it('should stamp content into notification overlay host', () => {
      expect(cardContent.shadowRoot).not.to.be.instanceof(ShadowRoot);
      expect(card.childElementCount).to.be.eql(2);
    });

    it('should slot content into content part', () => {
      const slot = cardContent.firstElementChild;
      expect(card.children[0].assignedSlot).to.equal(slot);
      expect(card.children[1].assignedSlot).to.equal(slot);
    });

    it('should apply global styles to notification overlay content', () => {
      expect(getComputedStyleSource(card.querySelector('.global-styles-content'))).to.equal('.global-styles-content');
    });

    it('should not apply local styles to notification overlay content', () => {
      expect(getComputedStyleSource(card.querySelector('.local-styles-content'))).to.not.equal('.local-styles-content');
    });
  });
});

describe('theme attribute', () => {
  let notification;

  beforeEach(() => {
    notification = fixtureSync(`
      <vaadin-notification theme="foo" duration="0">
        <template></template>
      </vaadin-notification>
    `);
  });

  it('should propagate theme attribute to card', () => {
    const card = notification.shadowRoot.querySelector('vaadin-notification-card');
    expect(card.getAttribute('theme')).to.equal('foo');
  });
});
