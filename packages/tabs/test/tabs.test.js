import { expect } from '@vaadin/chai-plugins';
import { arrowRight, aTimeout, enter, fixtureSync, nextRender, space } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './tabs-test-styles.js';
import '../src/vaadin-tabs.js';

describe('tabs', () => {
  let tabs;

  beforeEach(async () => {
    tabs = fixtureSync(`
      <vaadin-tabs>
        <vaadin-tab>Foo</vaadin-tab>
        <vaadin-tab>Bar</vaadin-tab>
        <vaadin-tab>Some</vaadin-tab>
        <span></span>
        <vaadin-tab disabled>Baz</vaadin-tab>
        <vaadin-tab>
          <a>Baz</a>
        </vaadin-tab>
      </vaadin-tabs>
    `);
    await nextRender();
    tabs._observer.flush();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tabs.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('items', () => {
    it('should only add vaadin-tab components to items', () => {
      expect(tabs.items.length).to.equal(5);
      tabs.items.forEach((item) => {
        expect(item.tagName.toLowerCase()).to.equal('vaadin-tab');
      });
    });

    it('should not resize on detached item resize', async () => {
      // Remove a tab
      const item = tabs.items[0];
      document.body.append(item);
      await aTimeout(100);

      // Resize the removed tab
      const stub = sinon.stub(tabs, '_updateOverflow');
      item.style.width = '100px';
      await aTimeout(100);

      item.remove();
      // Expect the resizeobserver not to have been invoked on the
      // removed tab resize
      expect(stub.called).to.be.false;
    });
  });

  describe('slotted anchor', () => {
    let anchor, tab, spy;

    beforeEach(() => {
      anchor = tabs.querySelector('a');
      tab = anchor.parentElement;
      spy = sinon.spy();
      anchor.addEventListener('click', spy);
    });

    it('should propagate click to the anchor element when Enter key pressed', () => {
      enter(tab);
      expect(spy.calledOnce).to.be.true;
    });

    it('should propagate click to the anchor element when Space key pressed', () => {
      space(tab);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not propagate click to the anchor when other key pressed', () => {
      arrowRight(tab);
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('ARIA roles', () => {
    it('should set "tablist" role on the tabs container', () => {
      expect(tabs.getAttribute('role')).to.equal('tablist');
    });
  });
});

describe('flex child tabs', () => {
  let wrapper, tabs;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div style="display: flex; width: 400px;">
        <vaadin-tabs>
          <vaadin-tab>Foo</vaadin-tab>
          <vaadin-tab>Bar</vaadin-tab>
        </vaadin-tabs>
      </div>
    `);
    await nextRender();
    tabs = wrapper.querySelector('vaadin-tabs');
  });

  it('should have width above zero', () => {
    expect(tabs.offsetWidth).to.be.above(0);
  });

  it('should not scroll', () => {
    expect(tabs.$.scroll.scrollWidth).to.be.equal(tabs.$.scroll.offsetWidth);
  });
});
