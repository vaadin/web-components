import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

class XFoo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div id="wrapper">
        <div id="content"></div>
      </div>
    `;
  }
}

customElements.define('x-foo', XFoo);

describe('context', () => {
  let menu, overlayContent, foo, fooContent, target, another;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <div id="target">
          Foo
          <x-foo></x-foo>
        </div>
        <div id="another">Bar</div>
      </vaadin-context-menu>
    `);
    menu.renderer = (root, _, context) => {
      root.innerHTML = `
        <vaadin-list-box id="menu">
          <vaadin-item>The menu target: ${context.target.textContent}</vaadin-item>
        </vaadin-list-box>
      `;
    };
    await nextRender();
    overlayContent = menu._overlayElement._contentRoot;
    foo = document.querySelector('x-foo');
    fooContent = foo.shadowRoot.querySelector('#content');
    target = document.querySelector('#target');
    another = document.querySelector('#another');
  });

  it('should use target as default context', async () => {
    fire(target, 'vaadin-contextmenu');
    await nextRender();

    expect(menu._context.target).to.eql(target);
    expect(overlayContent.textContent).to.contain(target.textContent);

    menu.close();

    fire(another, 'vaadin-contextmenu');
    await nextRender();

    expect(menu._context.target).to.eql(another);
    expect(overlayContent.textContent).to.contain(another.textContent);
  });

  it('should use details as context details', () => {
    const detail = {};
    fire(menu, 'vaadin-contextmenu', detail);

    expect(menu._context.detail).to.eql(detail);
  });

  it('should use local target when targeting inside shadow root', () => {
    fire(fooContent, 'contextmenu');

    expect(menu._context.target).to.eql(foo);
  });

  it('should not penetrate shadow root to change context', () => {
    menu.selector = '#content';
    fire(fooContent, 'contextmenu');

    expect(menu._context.target).to.be.undefined;
  });

  it('should use selector outside shadow root to change context', () => {
    menu.selector = '#target';
    fire(foo, 'contextmenu');

    expect(menu._context.target).to.eql(target);
  });

  it('should use listenOn element as target if no selector set and position is set', () => {
    menu.selector = null;
    menu.position = 'top-end';
    menu.listenOn = target;
    fire(foo, 'contextmenu');

    expect(menu._context.target).to.eql(target);
  });

  it('should not open if no context available', () => {
    menu.selector = 'foobar';
    fire(fooContent, 'contextmenu');

    expect(menu.opened).to.eql(false);
  });

  it('should not prevent default if no context available', () => {
    menu.selector = 'foobar';
    const evt = fire(fooContent, 'contextmenu');

    expect(evt.defaultPrevented).to.eql(false);
  });

  it('should target multiple elements', () => {
    menu.selector = 'div';

    fire(another, 'contextmenu');

    expect(menu.opened).to.be.true;
  });

  it('should be closed after detached', () => {
    fire(target, 'contextmenu');
    expect(menu.opened).to.be.true;

    const spy = sinon.spy(menu, 'close');

    menu.parentNode.removeChild(menu);
    expect(spy.calledOnce).to.be.true;
    expect(menu.opened).to.be.false;
  });

  it('should not close when moved within the DOM', () => {
    fire(target, 'contextmenu');
    expect(menu.opened).to.be.true;

    const newParent = document.createElement('div');
    document.body.appendChild(newParent);

    newParent.appendChild(menu);
    expect(menu.opened).to.be.true;
  });
});
