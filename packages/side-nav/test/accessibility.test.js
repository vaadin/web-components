import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-side-nav-item.js';
import '../src/vaadin-side-nav.js';

describe('accessibility', () => {
  describe('ARIA roles', () => {
    let sideNav;

    beforeEach(async () => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
      await nextRender();
    });

    it('should set "navigation" role by default on side-nav', () => {
      expect(sideNav.getAttribute('role')).to.equal('navigation');
    });

    it('should have custom role effective', async () => {
      const sideNavWithCustomRole = fixtureSync('<vaadin-side-nav role="custom role"></vaadin-side-nav>');
      await nextRender();
      expect(sideNavWithCustomRole.getAttribute('role')).to.equal('custom role');
    });
  });

  describe('label', () => {
    let sideNav;

    beforeEach(async () => {
      sideNav = fixtureSync('<vaadin-side-nav></vaadin-side-nav>');
      await nextRender();
    });

    it('should not have aria-labelledby attribute by default', () => {
      expect(sideNav.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should set id on the lazily added label element', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      const ID_REGEX = /^side-nav-label-\d+$/u;
      expect(label.getAttribute('id')).to.match(ID_REGEX);
    });

    it('should not override custom id on the lazily added label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');
      label.id = 'custom-label';

      sideNav.appendChild(label);
      await nextFrame();

      expect(label.getAttribute('id')).to.equal('custom-label');
    });

    it('should set aria-labelledby attribute when adding a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      const ID_REGEX = /^side-nav-label-\d+$/u;
      expect(sideNav.getAttribute('aria-labelledby')).to.match(ID_REGEX);
      expect(sideNav.getAttribute('aria-labelledby')).to.be.equal(label.id);
    });

    it('should remove aria-labelledby attribute when removing a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      sideNav.appendChild(label);
      await nextFrame();

      sideNav.removeChild(label);
      await nextFrame();

      expect(sideNav.hasAttribute('aria-labelledby')).to.be.false;
    });
  });

  describe('focus', () => {
    let wrapper, sideNav, input;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <input />
          <vaadin-side-nav collapsible>
            <span slot="label">Label</span>
            <vaadin-side-nav-item path="/foo">Foo</vaadin-side-nav-item>
            <vaadin-side-nav-item path="/bar">Bar</vaadin-side-nav-item>
          </vaadin-side-nav>
        </div>
      `);
      await nextRender();
      [input, sideNav] = wrapper.children;
    });

    it('should delegate focus to the native button element in shadow root', async () => {
      input.focus();
      await sendKeys({ press: 'Tab' });
      const button = sideNav.shadowRoot.querySelector('button');
      expect(sideNav.shadowRoot.activeElement).to.be.equal(button);
    });

    it('should set focused and focus-ring attributes when keyboard focused', async () => {
      input.focus();
      await sendKeys({ press: 'Tab' });
      expect(sideNav.hasAttribute('focused')).to.be.true;
      expect(sideNav.hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove focused and and focus-ring attributes when losing focus', async () => {
      input.focus();
      await sendKeys({ press: 'Tab' });
      // Move focus to the side nav item
      await sendKeys({ press: 'Tab' });
      expect(sideNav.hasAttribute('focused')).to.be.false;
      expect(sideNav.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('i18n', () => {
    let sideNav, items;

    beforeEach(async () => {
      sideNav = fixtureSync(`
        <vaadin-side-nav>
          <vaadin-side-nav-item path="/foo">Foo</vaadin-side-nav-item>
          <vaadin-side-nav-item path="/bar">
            Bar
            <vaadin-side-nav-item path="/bar/baz" slot="children">Baz</vaadin-side-nav-item>
            <vaadin-side-nav-item path="/bar/qux" slot="children">Qux</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
      `);
      await nextRender();
      items = [...sideNav.querySelectorAll('vaadin-side-nav-item')];
    });

    it('should set i18n on child items of the side-nav item', async () => {
      const i18n = { toggle: 'Toggle' };
      items[1].i18n = i18n;
      await nextRender();
      expect(items[2].i18n).to.deep.equal(i18n);
      expect(items[3].i18n).to.deep.equal(i18n);
    });

    it('should set i18n on all the child items of the side-nav', async () => {
      const i18n = { toggle: 'Toggle' };
      sideNav.i18n = i18n;
      await nextRender();
      items.forEach((item) => {
        expect(item.i18n).to.deep.equal(i18n);
      });
    });
  });

  describe('disabled', () => {
    let sideNav, items;

    beforeEach(async () => {
      sideNav = fixtureSync(`
        <vaadin-side-nav>
          <vaadin-side-nav-item path="/foo">Foo</vaadin-side-nav-item>
          <vaadin-side-nav-item path="/bar">
            Bar
            <vaadin-side-nav-item path="/bar/baz" slot="children">Baz</vaadin-side-nav-item>
            <vaadin-side-nav-item path="/bar/qux" slot="children">Qux</vaadin-side-nav-item>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
      `);
      await nextRender();
      items = [...sideNav.querySelectorAll('vaadin-side-nav-item')];
    });

    it('should propagate disabled to child items of the side-nav item', async () => {
      items[1].disabled = true;
      await nextRender();
      expect(items[2].disabled).to.be.true;
      expect(items[3].disabled).to.be.true;

      items[1].disabled = false;
      await nextRender();
      expect(items[2].disabled).to.be.false;
      expect(items[3].disabled).to.be.false;
    });

    it('should remove href attribute from the link when disabled is set to true', async () => {
      const link = items[0].shadowRoot.querySelector('[part="link"]');

      items[0].disabled = true;
      await nextRender();

      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should restore href attribute on the link when disabled is set to false', async () => {
      const link = items[0].shadowRoot.querySelector('[part="link"]');

      items[0].disabled = true;
      await nextRender();

      items[0].disabled = false;
      await nextRender();

      expect(link.getAttribute('href')).to.equal('/foo');
    });
  });
});
