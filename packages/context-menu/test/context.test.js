import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class XFoo extends PolymerElement {
  static get template() {
    return html`
      <div id="wrapper">
        <div id="content"></div>
      </div>
    `;
  }
}

customElements.define('x-foo', XFoo);

describe('context', () => {
  let menu, foo, target, another;

  beforeEach(() => {
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
    foo = document.querySelector('x-foo');
    target = document.querySelector('#target');
    another = document.querySelector('#another');
  });

  it('should use target as default context', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu._context.target).to.eql(target);
    expect(menu.$.overlay.textContent).to.contain(target.textContent);

    menu.close();
    fire(another, 'vaadin-contextmenu');

    expect(menu._context.target).to.eql(another);
    expect(menu.$.overlay.textContent).to.contain(another.textContent);
  });

  it('should use details as context details', () => {
    const detail = {};
    fire(menu, 'vaadin-contextmenu', detail);

    expect(menu._context.detail).to.eql(detail);
  });

  it('should use local target when targeting inside shadow root', () => {
    fire(foo.$.content, 'contextmenu');

    expect(menu._context.target).to.eql(foo);
  });

  it('should not penetrate shadow root to change context', () => {
    menu.selector = '#content';
    fire(foo.$.content, 'contextmenu');

    expect(menu._context.target).to.be.undefined;
  });

  it('should use selector outside shadow root to change context', () => {
    menu.selector = '#target';
    fire(foo, 'contextmenu');

    expect(menu._context.target).to.eql(target);
  });

  it('should not open if no context available', () => {
    menu.selector = 'foobar';
    fire(foo.$.content, 'contextmenu');

    expect(menu.opened).to.eql(false);
  });

  it('should not prevent default if no context available', () => {
    menu.selector = 'foobar';
    const evt = fire(foo.$.content, 'contextmenu');

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
});
