import { expect } from '@esm-bundle/chai';
import { aTimeout } from '@vaadin/testing-helpers';
import '../vaadin-notification.js';
import { html } from 'lit';
import { Notification } from '../src/vaadin-notification.js';

describe('static helpers', () => {
  it('show should show a text notification', () => {
    const notification = Notification.show('Hello world');
    const notificationDom = document.body.querySelector('vaadin-notification');
    expect(notification).to.equal(notificationDom);

    expect(notification._card.innerText.trim()).to.equal('Hello world');
  });

  it('show should show a Lit template notification', () => {
    const notification = Notification.show(html`Hello world`);

    // FIXME: This causes 'TypeError: Converting circular structure to JSON'
    // const notificationDom = document.body.querySelector('vaadin-notification');
    // expect(notification).to.equal(notificationDom);

    expect(notification._card.innerText.trim()).to.equal('Hello world');
  });

  it('show should use a default duration of 5s and bottom-start', () => {
    const notification = Notification.show('Hello world');
    expect(notification.duration).to.equal(5000);
    expect(notification.position).to.equal('bottom-start');
  });

  it('show should use the given duration and position', () => {
    const notification = Notification.show('Hello world', { duration: 123, position: 'top-center' });
    expect(notification.duration).to.equal(123);
    expect(notification.position).to.equal('top-center');
  });

  it('show should set the given theme attribute', () => {
    const notification = Notification.show('Hello world', { theme: 'error' });
    expect(notification.getAttribute('theme')).to.equal('error');
  });

  it('show should work with a duration of zero', () => {
    const notification = Notification.show('Hello world', { duration: 0 });
    expect(notification.duration).to.equal(0);
  });

  it('show remove the element from the document after closing', async () => {
    const notification = Notification.show('Hello world', { duration: 1 });
    expect(notification.parentElement).to.equal(document.body);
    await aTimeout(10);
    expect(notification.parentElement).to.be.null;
  });

  it('show should support Lit event handlers', () => {
    let clicked = 0;
    const doClose = () => {
      clicked += 1;
    };
    const notification = Notification.show(html`Click <button @click=${doClose}>this</button> to count`);
    notification._card.querySelector('button').click();

    expect(clicked).to.equal(1);
  });

  it('show should support closing through an event handler', () => {
    const notification = Notification.show(
      html`Click
        <button
          @click=${() => {
            notification.opened = false;
          }}
          >this</button
        >
        to close`,
    );
    notification._card.querySelector('button').click();

    expect(notification.opened).to.equal(false);
  });
});
