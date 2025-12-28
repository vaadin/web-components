import { expect } from '@vaadin/chai-plugins';
import { aTimeout, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-notification.js';
import { html } from 'lit';

const Notification = customElements.get('vaadin-notification');

describe('static helpers', () => {
  it('show should show a text notification', async () => {
    const notification = Notification.show('Hello world');
    await nextFrame();
    const notificationDom = document.body.querySelector('vaadin-notification');
    expect(notification).to.equal(notificationDom);

    expect(notification._card.innerText.trim()).to.equal('Hello world');
  });

  it('show should show a Lit template notification', async () => {
    const notification = Notification.show(html`Hello world`);
    await nextFrame();

    // FIXME: This causes 'TypeError: Converting circular structure to JSON'
    // const notificationDom = document.body.querySelector('vaadin-notification');
    // expect(notification).to.equal(notificationDom);

    expect(notification._card.innerText.trim()).to.equal('Hello world');
  });

  it('show should use a default duration of 5s and bottom-start', async () => {
    const notification = Notification.show('Hello world');
    await nextFrame();
    expect(notification.duration).to.equal(5000);
    expect(notification.position).to.equal('bottom-start');
  });

  it('show should use the given duration and position', async () => {
    const notification = Notification.show('Hello world', { duration: 123, position: 'top-center' });
    await nextFrame();
    expect(notification.duration).to.equal(123);
    expect(notification.position).to.equal('top-center');
  });

  it('show should use assertive property when set to true', async () => {
    const notification = Notification.show('Hello world', { assertive: true });
    await nextFrame();
    expect(notification.assertive).to.be.true;
  });

  it('show should set the given theme attribute', async () => {
    const notification = Notification.show('Hello world', { theme: 'error' });
    await nextFrame();
    expect(notification.getAttribute('theme')).to.equal('error');
  });

  it('show should set the overlayClass from className option', async () => {
    const notification = Notification.show('Hello world', { className: 'my-custom-class' });
    await nextFrame();
    expect(notification.overlayClass).to.equal('my-custom-class');
    expect(notification._card.classList.contains('my-custom-class')).to.be.true;
  });

  it('show should work with a duration of zero', async () => {
    const notification = Notification.show('Hello world', { duration: 0 });
    await nextFrame();
    expect(notification.duration).to.equal(0);
  });

  it('show remove the element from the document after closing', async () => {
    const notification = Notification.show('Hello world', { duration: 1 });
    await aTimeout(0);
    expect(notification.parentElement).to.equal(document.body);
    await aTimeout(10);
    expect(notification.parentElement).to.be.null;
  });

  it('show should support Lit event handlers', async () => {
    let clicked = 0;
    const doClose = () => {
      clicked += 1;
    };
    const notification = Notification.show(html`Click <button @click=${doClose}>this</button> to count`);
    await nextFrame();
    notification._card.querySelector('button').click();

    expect(clicked).to.equal(1);
  });

  it('show should support closing through an event handler', async () => {
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
    await nextFrame();
    notification._card.querySelector('button').click();

    expect(notification.opened).to.equal(false);
  });
});
