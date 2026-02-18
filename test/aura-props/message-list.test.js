import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/message-list/src/vaadin-message-list.js';

export const props = [
  // === Message List ===
  {
    name: '--vaadin-message-list-padding',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },

  // === Message Layout ===
  {
    name: '--vaadin-message-padding',
    value: '30px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      return getComputedStyle(message).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-message-gap',
    value: '20px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      return getComputedStyle(message).getPropertyValue('gap').trim();
    },
  },

  // === Message Header ===
  {
    name: '--vaadin-message-header-line-height',
    value: '30px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const header = message.shadowRoot.querySelector('[part="header"]');
      return getComputedStyle(header).getPropertyValue('line-height').trim();
    },
  },

  // === Name ===
  {
    name: '--vaadin-message-name-color',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const name = message.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-message-name-font-size',
    value: '24px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const name = message.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-message-name-font-weight',
    value: '800',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const name = message.shadowRoot.querySelector('[part="name"]');
      return getComputedStyle(name).getPropertyValue('font-weight').trim();
    },
  },

  // === Time ===
  {
    name: '--vaadin-message-time-color',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const time = message.shadowRoot.querySelector('[part="time"]');
      return getComputedStyle(time).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-message-time-font-size',
    value: '20px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const time = message.shadowRoot.querySelector('[part="time"]');
      return getComputedStyle(time).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-message-time-font-weight',
    value: '700',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const time = message.shadowRoot.querySelector('[part="time"]');
      return getComputedStyle(time).getPropertyValue('font-weight').trim();
    },
  },

  // === Message Text ===
  {
    name: '--vaadin-message-font-size',
    value: '22px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const text = message.shadowRoot.querySelector('[part="message"]');
      return getComputedStyle(text).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-message-font-weight',
    value: '700',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const text = message.shadowRoot.querySelector('[part="message"]');
      return getComputedStyle(text).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-message-line-height',
    value: '30px',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const text = message.shadowRoot.querySelector('[part="message"]');
      return getComputedStyle(text).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-message-text-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.items = [{ text: 'Hello', userName: 'User', time: '10:00' }];
    },
    compute(element) {
      const message = element.querySelector('vaadin-message');
      const text = message.shadowRoot.querySelector('[part="message"]');
      return getComputedStyle(text).getPropertyValue('color').trim();
    },
  },
];

describe('message-list', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-message-list></vaadin-message-list>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
