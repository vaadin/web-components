import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-select.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('focus', () => {
  let select, overlay, listBox, valueButton, firstGlobalFocusable, lastGlobalFocusable;

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <input id="first-global-focusable" />
        <vaadin-select label="Label"></vaadin-select>
        <input id="last-global-focusable" />
      </div>
    `);
    [firstGlobalFocusable, select, lastGlobalFocusable] = wrapper.children;
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    await nextRender();
    valueButton = select.focusElement;
    listBox = select._menuElement;
    overlay = select._overlayElement;
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('focused', () => {
    it('should focus the value button on Tab', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(valueButton);
    });

    it('should set focused attribute on both host and value button', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });
      expect(select.hasAttribute('focused')).to.be.true;
      expect(valueButton.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute on both host and value button', async () => {
      firstGlobalFocusable.focus();
      await sendKeys({ press: 'Tab' });
      expect(select.hasAttribute('focus-ring')).to.be.true;
      expect(valueButton.hasAttribute('focus-ring')).to.be.true;
    });

    it('should set focused attribute when calling focus()', () => {
      select.focus();
      expect(select.hasAttribute('focused')).to.be.true;
    });

    it('should focus on required indicator click', () => {
      select.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(select.hasAttribute('focused')).to.be.true;
    });
  });

  describe('opening', () => {
    it('should keep focused state after opening overlay when focused', async () => {
      select.focus();
      select.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(select.hasAttribute('focused')).to.be.true;
    });

    it('should not set focused state after opening overlay if not focused', async () => {
      select.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(select.hasAttribute('focused')).to.be.false;
    });

    it('should focus the first item when opening the overlay', async () => {
      select.focus();
      select.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const item = listBox.items[0];
      expect(getDeepActiveElement()).to.equal(item);
      expect(item.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring on the item when opened with keyboard', async () => {
      select.focus();
      await sendKeys({ press: 'Enter' });
      await nextRender();

      const item = listBox.items[0];
      expect(item.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring on the item when opened with mouse', async () => {
      mousedown(select);
      select.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const item = listBox.items[0];
      expect(item.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('focus-ring', () => {
    describe('set before opening', () => {
      beforeEach(async () => {
        select.focus();
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should restore focus-ring attribute on item click', async () => {
        await sendMouseToElement({ type: 'click', element: listBox.items[0] });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.true;
      });

      it('should restore focus-ring attribute on outside click', async () => {
        await sendMouse({ type: 'click', position: [100, 100] });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.true;
      });

      it('should restore focus-ring attribute on item Escape', async () => {
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.true;
        expect(valueButton.hasAttribute('focus-ring')).to.be.true;
      });
    });

    describe('not set before opening', () => {
      beforeEach(async () => {
        // Reset keyboard-active state left by previous tests so that focus() adds no focus-ring
        mousedown(document.body);
        select.focus({ focusVisible: false });
        select.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should not set focus-ring attribute on item click', async () => {
        await sendMouseToElement({ type: 'click', element: listBox.items[0] });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.false;
      });

      it('should set focus-ring attribute on item Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.true;
      });

      it('should set focus-ring attribute on item Escape', async () => {
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(select.hasAttribute('focus-ring')).to.be.true;
      });
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      select.focus();
      select.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should restore focus to the value button on item Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(valueButton);
    });

    it('should restore focus to the value button on item Escape', async () => {
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(valueButton);
    });

    it('should restore focus to the value button on item click', async () => {
      await sendMouseToElement({ type: 'click', element: listBox.items[0] });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(valueButton);
    });

    it('should restore focus to the value button on outside click', async () => {
      await sendMouse({ type: 'click', position: [100, 100] });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(valueButton);
    });

    it('should focus next focusable on menu item Tab', async () => {
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(lastGlobalFocusable);
    });

    it('should focus previous focusable on menu item Shift + Tab', async () => {
      await sendKeys({ press: 'Shift+Tab' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(firstGlobalFocusable);
    });
  });
});
