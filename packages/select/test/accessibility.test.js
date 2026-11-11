import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-select.js';

describe('accessibility', () => {
  let select, valueButton;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select label="Label"></vaadin-select>');
    await nextRender();
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    await nextUpdate(select);
    valueButton = select.querySelector('vaadin-select-value-button');
  });

  describe('ARIA attributes', () => {
    it('should toggle aria-expanded attribute on the value button on open', async () => {
      select.opened = true;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-expanded')).to.equal('true');

      select.opened = false;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should toggle aria-controls attribute on the value button on open', async () => {
      const listBox = select.querySelector('vaadin-select-list-box');

      select.opened = true;
      await nextUpdate(select);
      expect(listBox.id).to.be.ok;
      expect(valueButton.getAttribute('aria-controls')).to.equal(listBox.id);

      select.opened = false;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-controls')).to.be.false;
    });

    it('should toggle aria-readonly attribute on the value button on readonly change', async () => {
      expect(valueButton.hasAttribute('aria-readonly')).to.be.false;

      select.readonly = true;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-readonly')).to.equal('true');

      select.readonly = false;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-readonly')).to.be.false;
    });

    it('should add aria-live attribute on first-letter shortcut selection', async () => {
      select.focus();
      await sendKeys({ press: 'o' });
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-live')).to.equal('polite');
    });

    it('should remove aria-live attribute on dropdown open', async () => {
      select.focus();
      await sendKeys({ press: 'o' });
      select.opened = true;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-live')).to.be.false;
    });
  });

  describe('set before attach', () => {
    let container;

    beforeEach(() => {
      container = fixtureSync('<div></div>');
      select = document.createElement('vaadin-select');
      select.items = [{ label: 'Option 1', value: 'Option 1' }];
    });

    it('should set aria-readonly attribute when readonly and disabled are set', async () => {
      select.readonly = true;
      select.disabled = true;
      container.appendChild(select);
      await nextRender();
      expect(select.focusElement.getAttribute('aria-readonly')).to.equal('true');
    });

    it('should set aria-expanded and aria-controls attributes when opened is set', async () => {
      select.opened = true;
      container.appendChild(select);
      await nextRender();
      const listBox = select.querySelector('vaadin-select-list-box');
      expect(select.focusElement.getAttribute('aria-expanded')).to.equal('true');
      expect(select.focusElement.getAttribute('aria-controls')).to.equal(listBox.id);
    });

    it('should not set aria-controls attribute when opened and disabled are set', async () => {
      select.opened = true;
      select.disabled = true;
      container.appendChild(select);
      await nextRender();
      expect(select.focusElement.getAttribute('aria-expanded')).to.equal('false');
      expect(select.focusElement.hasAttribute('aria-controls')).to.be.false;
    });
  });

  describe('slotted list box', () => {
    it('should use the existing slotted list box id for `aria-controls`', async () => {
      select = fixtureSync(`
        <vaadin-select label="Label">
          <vaadin-select-list-box slot="overlay" id="custom-id">
            <vaadin-select-item value="foo">Foo</vaadin-select-item>
          </vaadin-select-list-box>
        </vaadin-select>
      `);
      await nextRender();
      select.opened = true;
      await nextUpdate(select);
      expect(select.focusElement.getAttribute('aria-controls')).to.equal('custom-id');
    });
  });
});
