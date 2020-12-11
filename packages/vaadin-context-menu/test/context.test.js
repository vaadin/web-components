import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import { fire } from './common.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

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
        <template>
          <vaadin-list-box id="menu">
            <vaadin-item>The menu target: [[target.textContent]]</vaadin-item>
          </vaadin-list-box>
        </template>
        <div id="target">
          Foo
          <x-foo></x-foo>
        </div>
        <div id="another">Bar</div>
      </vaadin-context-menu>
    `);
    foo = document.querySelector('x-foo');
    target = document.querySelector('#target');
    another = document.querySelector('#another');
  });

  afterEach(() => {
    menu.close();
  });

  it('should use target as default context', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu._context.target).to.eql(target);
    expect(menu.$.overlay.content.textContent).to.contain(target.textContent);

    menu.close();
    fire(another, 'vaadin-contextmenu');

    expect(menu._context.target).to.eql(another);
    expect(menu.$.overlay.content.textContent).to.contain(another.textContent);
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
