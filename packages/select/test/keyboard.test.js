import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-select.js';

describe('keyboard', () => {
  let select, overlay, menu, valueButton;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select></vaadin-select>');
    select.items = [
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ];
    await nextRender();
    valueButton = select.focusElement;
    menu = select._menuElement;
    overlay = select._overlayElement;
  });

  describe('focus', () => {
    it('should focus the value button on Tab', async () => {
      await sendKeys({ press: 'Tab' });

      expect(document.activeElement).to.equal(valueButton);
    });

    it('should set focused attribute on both host and value button', async () => {
      await sendKeys({ press: 'Tab' });

      expect(select.hasAttribute('focused')).to.be.true;
      expect(valueButton.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute on both host and value button', async () => {
      await sendKeys({ press: 'Tab' });

      expect(select.hasAttribute('focus-ring')).to.be.true;
      expect(valueButton.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('overlay', () => {
    [('ArrowDown', 'ArrowUp', 'Enter', 'Space')].forEach((key) => {
      it(`should open overlay on ${key} key`, async () => {
        await sendKeys({ press: 'Tab' });

        await sendKeys({ press: key });
        await nextRender();

        expect(overlay.opened).to.be.true;
      });
    });

    ['Enter', 'Escape'].forEach((key) => {
      it(`should close the overlay on ${key} key`, async () => {
        await sendKeys({ press: 'Tab' });

        await sendKeys({ press: 'Enter' });
        await nextRender();

        await sendKeys({ press: key });
        await nextUpdate(select);

        expect(select.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });
    });

    it('should focus value button element on overlay closing with Esc', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      const focusedSpy = sinon.spy(valueButton, 'focus');

      await sendKeys({ press: 'Escape' });
      await nextUpdate(select);

      expect(focusedSpy.calledOnce).to.be.true;
    });

    it('should focus value button element on overlay closing with outside click', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      const focusedSpy = sinon.spy(valueButton, 'focus');

      await sendMouseToElement({ type: 'click', element: document.body });
      await nextUpdate(select);
      await aTimeout(0);
      await resetMouse();

      expect(focusedSpy.calledOnce).to.be.true;
    });

    it('should restore focus-ring attribute on overlay closing', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      await sendKeys({ press: 'Escape' });
      await nextRender();

      expect(select.hasAttribute('focus-ring')).to.be.true;
      expect(valueButton.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('selection', () => {
    it('should focus the first item on open', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      const item = menu.items[0];
      expect(document.activeElement).to.equal(item);
      expect(item.hasAttribute('focused')).to.be.true;
      expect(item.hasAttribute('focus-ring')).to.be.true;
    });

    it('should select the item on Enter', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);

      expect(select.value).to.equal('option-1');
    });

    it('should append clone of the selected item to the button', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'Enter' });
      await nextRender();

      await sendKeys({ press: 'Enter' });
      await nextUpdate(select);

      const item = menu.items[0];
      const clone = valueButton.firstChild;
      expect(clone).not.to.be.equal(item);
      expect(clone.localName).to.be.equal(item.localName);
      expect(clone.textContent).to.be.equal(item.textContent);
    });

    ['active', 'focused', 'focus-ring', 'role', 'tabindex', 'aria-selected'].forEach((attr) => {
      it(`should remove ${attr} attribute from the item clone`, async () => {
        await sendKeys({ press: 'Tab' });

        // Open overlay and wait
        await sendKeys({ press: 'Enter' });
        await nextRender();

        await sendKeys({ press: 'Enter' });
        await nextUpdate(select);

        const clone = valueButton.firstChild;
        expect(clone.hasAttribute(attr)).to.be.false;
      });
    });
  });
});
