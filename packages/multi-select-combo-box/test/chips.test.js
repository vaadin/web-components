import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import './multi-select-combo-box-test-styles.js';
import '../src/vaadin-multi-select-combo-box.js';

describe('chips', () => {
  let comboBox, inputElement;

  const getChips = (combo) => combo.querySelectorAll('vaadin-multi-select-combo-box-chip');

  const getChipContent = (chip) => chip.shadowRoot.querySelector('[part="label"]').textContent;

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    comboBox.selectedItems = ['orange'];
    await nextRender();
    inputElement = comboBox.inputElement;
  });

  describe('programmatic update', () => {
    beforeEach(async () => {
      comboBox.style.width = '100%';
      await nextResize(comboBox);
    });

    it('should re-render chips when selectedItems is updated', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(3);
      expect(getChipContent(chips[1])).to.equal('apple');
      expect(getChipContent(chips[2])).to.equal('banana');
    });

    it('should re-render chips when selectedItems is cleared', async () => {
      comboBox.selectedItems = [];
      await nextRender();
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(1);
    });
  });

  describe('manual selection', () => {
    beforeEach(async () => {
      comboBox.style.width = '100%';
      await nextResize(comboBox);
      inputElement.focus();
    });

    it('should re-render chips when selecting the item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      await nextRender();
      expect(getChips(comboBox).length).to.equal(3);
    });

    it('should re-render chips when un-selecting the item', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowUp' });
      await sendKeys({ down: 'Enter' });
      await nextRender();
      expect(getChips(comboBox).length).to.equal(1);
    });

    it('should remove chip on remove button click', async () => {
      const chip = getChips(comboBox)[1];
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      await nextRender();
      expect(getChips(comboBox).length).to.equal(1);
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      comboBox.style.width = '250px';
      await nextResize(comboBox);
      comboBox.selectedItems = ['apple', 'banana'];
      comboBox.disabled = true;
      await nextRender();
    });

    it('should hide overflow chip if width permits when disabled', () => {
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(3);
      expect(chips[0].hasAttribute('hidden')).to.be.true;
    });

    it('should regenerate chips when disabled is set to false', () => {
      comboBox.disabled = false;
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(2);
      expect(chips[0].hasAttribute('hidden')).to.be.false;
    });

    it('should set disabled attribute on all chips when disabled', () => {
      const chips = getChips(comboBox);
      expect(chips[0].hasAttribute('disabled')).to.be.true;
      expect(chips[1].hasAttribute('disabled')).to.be.true;
      expect(chips[2].hasAttribute('disabled')).to.be.true;
    });

    it('should remove disabled attribute from chips when re-enabled', () => {
      comboBox.disabled = false;
      const chips = getChips(comboBox);
      expect(chips[0].hasAttribute('disabled')).to.be.false;
      expect(chips[1].hasAttribute('disabled')).to.be.false;
    });
  });

  describe('overflow', () => {
    let overflow;

    beforeEach(async () => {
      comboBox.style.width = '250px';
      await nextResize(comboBox);
      overflow = getChips(comboBox)[0];
    });

    it('should render chip for each item, plus overflow chip', () => {
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(2);
      expect(getChipContent(chips[1])).to.equal('orange');
    });

    it('should set title attribute on chips matching their label', () => {
      const chips = getChips(comboBox);
      expect(chips[1].getAttribute('title')).to.equal('orange');
    });

    it('should hide overflow chip when all chips are visible', () => {
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should show overflow chip when all chips no longer fit', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      expect(getChips(comboBox).length).to.equal(2);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should set overflow chip label as not fitting chips count', async () => {
      comboBox.selectedItems = ['apple', 'banana', 'orange'];
      await nextRender();
      expect(overflow.label).to.equal('2');
    });

    it('should set overflow chip count as not fitting chips count', async () => {
      comboBox.selectedItems = ['apple', 'banana', 'orange'];
      await nextRender();
      expect(overflow.getAttribute('count')).to.equal('2');
    });

    it('should set overflow chip title as not fitting chips labels', async () => {
      comboBox.selectedItems = ['apple', 'banana', 'orange'];
      await nextRender();
      const title = overflow.getAttribute('title');
      expect(title).to.equal('apple, banana');
    });

    describe('resize', () => {
      beforeEach(async () => {
        comboBox.style.width = '250px';
        await nextResize(comboBox);
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
      });

      it('should update overflow chip on resize when width changes', async () => {
        expect(overflow.hasAttribute('hidden')).to.be.false;

        comboBox.style.width = '350px';
        await nextResize(comboBox);
        expect(overflow.hasAttribute('hidden')).to.be.true;

        comboBox.style.width = 'auto';
        await nextResize(comboBox);
        expect(overflow.hasAttribute('hidden')).to.be.false;
      });

      it('should update overflow chip on clear button state change', async () => {
        comboBox.style.width = '340px';
        await nextResize(comboBox);

        comboBox.clearButtonVisible = true;
        await nextRender();
        expect(overflow.hasAttribute('hidden')).to.be.false;

        comboBox.clearButtonVisible = false;
        await nextRender();
        expect(overflow.hasAttribute('hidden')).to.be.true;
      });

      it('should always show at least one chip in addition to overflow if there is enough space', async () => {
        comboBox.style.width = 'auto';
        await nextResize(comboBox);

        comboBox.selectedItems = ['apple', 'orange'];
        await nextRender();

        const chips = getChips(comboBox);
        expect(chips.length).to.equal(2);
        expect(getChipContent(chips[1])).to.equal('orange');
      });

      it('should move all chips to the overflow if there is not enough space for a single chip', async () => {
        comboBox.style.width = '100px';
        await nextResize(comboBox);

        comboBox.selectedItems = ['apple', 'orange'];
        await nextRender();

        const chips = getChips(comboBox);
        expect(chips.length).to.equal(1);
        expect(overflow.hasAttribute('hidden')).to.be.false;
      });

      it('should set max width on the chip based on the remaining space', async () => {
        comboBox.style.width = 'auto';
        await nextResize(comboBox);

        comboBox.selectedItems = ['apple', 'orange'];
        await nextRender();

        const chips = getChips(comboBox);
        const minWidth = getComputedStyle(comboBox).getPropertyValue('--_chip-min-width');
        expect(minWidth).to.be.ok;
        expect(parseInt(chips[1].style.maxWidth)).to.be.greaterThan(parseInt(minWidth));
      });
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      comboBox.style.width = '250px';
      await nextResize(comboBox);
      comboBox.selectedItems = ['apple', 'banana'];
      comboBox.readonly = true;
      await nextRender();
    });

    it('should hide overflow chip if width permits when readonly', () => {
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(3);
      expect(chips[0].hasAttribute('hidden')).to.be.true;
    });

    it('should regenerate chips when readonly is set to false', () => {
      comboBox.readonly = false;
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(2);
      expect(chips[0].hasAttribute('hidden')).to.be.false;
    });

    it('should set readonly attribute on all chips when readonly', () => {
      const chips = getChips(comboBox);
      expect(chips[0].hasAttribute('readonly')).to.be.true;
      expect(chips[1].hasAttribute('readonly')).to.be.true;
      expect(chips[2].hasAttribute('readonly')).to.be.true;
    });

    it('should remove readonly attribute from chips when not readonly', async () => {
      comboBox.readonly = false;
      await nextUpdate(comboBox);
      const chips = getChips(comboBox);
      expect(chips[0].hasAttribute('readonly')).to.be.false;
      expect(chips[1].hasAttribute('readonly')).to.be.false;
    });

    it('should set readonly attribute on added chips while readonly', async () => {
      comboBox.selectedItems = ['lemon', 'orange'];
      await nextUpdate(comboBox);
      const chips = getChips(comboBox);
      expect(chips[0].hasAttribute('readonly')).to.be.true;
      expect(chips[1].hasAttribute('readonly')).to.be.true;
      expect(chips[2].hasAttribute('readonly')).to.be.true;
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      comboBox.style.width = '300px';
      await nextResize(comboBox);
      inputElement.focus();
    });

    describe('Backspace', () => {
      it('should not remove last chip on Backspace but mark it as focused', async () => {
        await sendKeys({ press: 'Backspace' });
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(3);
        expect(chips[1].hasAttribute('focused')).to.be.false;
        expect(chips[2].hasAttribute('focused')).to.be.true;
      });

      it('should remove last chip on subsequent Backspace after focusing', async () => {
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(2);
        expect(comboBox.selectedItems).to.deep.equal(['apple']);
      });

      it('should not mark last chip on Backspace as focused when input has value', async () => {
        await sendKeys({ type: 'lemon' });
        await sendKeys({ press: 'Backspace' });
        const chips = getChips(comboBox);
        expect(chips[1].hasAttribute('focused')).to.be.false;
        expect(chips[2].hasAttribute('focused')).to.be.false;
      });

      it('should mark last chip on Backspace as focused when dropdown is opened', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Backspace' });
        const chips = getChips(comboBox);
        expect(chips[1].hasAttribute('focused')).to.be.false;
        expect(chips[2].hasAttribute('focused')).to.be.true;
      });

      it('should not mark last chip on Backspace as focused when readonly', async () => {
        comboBox.readonly = true;
        // Prevent navigating to about:blank in WebKit
        inputElement.addEventListener(
          'keydown',
          (e) => {
            e.preventDefault();
          },
          { once: true },
        );
        await sendKeys({ press: 'Backspace' });
        const chips = getChips(comboBox);
        expect(chips[1].hasAttribute('focused')).to.be.false;
        expect(chips[2].hasAttribute('focused')).to.be.false;
      });

      it('should remove focused attribute from chips on input focusout ', async () => {
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Tab' });
        const chips = getChips(comboBox);
        expect(chips.length).to.equal(3);
        expect(chips[1].hasAttribute('focused')).to.be.false;
        expect(chips[2].hasAttribute('focused')).to.be.false;
      });
    });

    describe('Arrow keys', () => {
      ['ltr', 'rtl'].forEach((dir) => {
        const PREV_KEY = dir === 'ltr' ? 'ArrowLeft' : 'ArrowRight';
        const NEXT_KEY = dir === 'ltr' ? 'ArrowRight' : 'ArrowLeft';

        describe(dir, () => {
          before(() => {
            document.documentElement.setAttribute('dir', dir);
          });

          after(() => {
            document.documentElement.removeAttribute('dir');
          });

          it(`should mark last chip on ${PREV_KEY} as focused when no chip is focused`, async () => {
            await sendKeys({ press: PREV_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.true;
          });

          it(`should not mark last chip on ${PREV_KEY} as focused when caret is not in starting position`, async () => {
            await sendKeys({ type: 'lemon' });
            await sendKeys({ press: PREV_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.false;
          });

          it(`should mark last chip on ${PREV_KEY} as focused when caret is in starting position`, async () => {
            await sendKeys({ type: 'lemon' });
            inputElement.setSelectionRange(0, 0);
            await sendKeys({ press: PREV_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.true;
          });

          it(`should mark last chip on ${PREV_KEY} as focused when dropdown is opened`, async () => {
            await sendKeys({ press: 'ArrowDown' });
            await sendKeys({ press: PREV_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.true;
          });

          it(`should mark previous chip on ${PREV_KEY} as focused when a chip is focused`, async () => {
            await sendKeys({ press: PREV_KEY });
            await sendKeys({ press: PREV_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.true;
            expect(chips[2].hasAttribute('focused')).to.be.false;
          });

          it(`should not change caret position after ${PREV_KEY} when a chip is focused`, async () => {
            await sendKeys({ type: 'lemon' });
            inputElement.blur();
            const chips = getChips(comboBox);
            chips[2].toggleAttribute('focused');
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.true;
            await sendKeys({ press: PREV_KEY });
            expect(inputElement.selectionStart).to.equal(0);
          });

          it(`should mark next chip on ${NEXT_KEY} as focused when a chip is focused`, async () => {
            await sendKeys({ press: PREV_KEY });
            await sendKeys({ press: PREV_KEY });
            await sendKeys({ press: NEXT_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.true;
          });

          it(`should mark all chips as not focused on ${NEXT_KEY} when last chip is focused`, async () => {
            await sendKeys({ press: PREV_KEY });
            await sendKeys({ press: NEXT_KEY });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.false;
          });

          it(`should mark all chips as not focused after ${NEXT_KEY} followed by unrelated key`, async () => {
            await sendKeys({ press: PREV_KEY });
            await sendKeys({ press: 'ArrowDown' });
            const chips = getChips(comboBox);
            expect(chips[1].hasAttribute('focused')).to.be.false;
            expect(chips[2].hasAttribute('focused')).to.be.false;
          });

          it(`should not change caret position after ${NEXT_KEY} when a chip is focused`, async () => {
            await sendKeys({ type: 'lemon' });
            inputElement.blur();
            const chips = getChips(comboBox);
            chips[1].toggleAttribute('focused');
            expect(chips[1].hasAttribute('focused')).to.be.true;
            expect(chips[2].hasAttribute('focused')).to.be.false;
            await sendKeys({ press: NEXT_KEY });
            expect(inputElement.selectionStart).to.equal(0);
          });
        });
      });
    });
  });

  describe('autoExpandVertically', () => {
    let overflow;

    beforeEach(async () => {
      comboBox.style.width = '250px';
      await nextResize(comboBox);
      overflow = getChips(comboBox)[0];
    });

    it('should not show overflow chip when autoExpandVertically is set to true', async () => {
      comboBox.autoExpandVertically = true;
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      expect(getChips(comboBox).length).to.equal(3);
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should show overflow chip when autoExpandVertically is set to false', async () => {
      comboBox.autoExpandVertically = true;
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();

      comboBox.autoExpandVertically = false;
      await nextRender();
      expect(getChips(comboBox).length).to.equal(2);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should update chips when autoExpandVertically is set after selectedItems', async () => {
      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      expect(getChips(comboBox).length).to.equal(2);
      expect(overflow.hasAttribute('hidden')).to.be.false;

      comboBox.autoExpandVertically = true;
      await nextRender();
      expect(getChips(comboBox).length).to.equal(3);
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should wrap chips and increase input field height if chips do not fit', async () => {
      const inputField = comboBox.shadowRoot.querySelector('[part="input-field"]');
      const height = inputField.clientHeight;
      comboBox.autoExpandVertically = true;
      comboBox.selectedItems = ['apple', 'banana', 'lemon', 'orange'];
      await nextRender();
      expect(inputField.clientHeight).to.be.greaterThan(height);
    });
  });

  describe('autoExpandHorizontally', () => {
    let overflow;

    beforeEach(async () => {
      comboBox.autoExpandHorizontally = true;
      await nextResize(comboBox);
      comboBox.selectedItems = ['apple', 'banana', 'lemon', 'orange'];
      overflow = getChips(comboBox)[0];
      await nextRender();
    });

    it('should show all chips when there is enough space by default', () => {
      expect(getChips(comboBox).length).to.equal(5);
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should collapse chips to overflow when max-width is set on the host', async () => {
      comboBox.style.maxWidth = '300px';
      await nextResize(comboBox);
      expect(getChips(comboBox).length).to.equal(3);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should collapse chips to overflow when width is set on the host', async () => {
      comboBox.style.width = '300px';
      await nextResize(comboBox);
      expect(getChips(comboBox).length).to.equal(3);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should collapse chips to overflow when max-width is set on the parent', async () => {
      comboBox.parentElement.style.maxWidth = '300px';
      await nextResize(comboBox);
      expect(getChips(comboBox).length).to.equal(3);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should set max-width on the chip when the host width does not allow to fit', async () => {
      comboBox.style.maxWidth = '180px';
      await nextResize(comboBox);
      const chips = getChips(comboBox);
      expect(chips.length).to.equal(2);
      expect(getComputedStyle(chips[1]).maxWidth).to.be.ok;
    });

    it('should collapse chips when autoExpandHorizontally is set to false', async () => {
      comboBox.autoExpandHorizontally = false;
      await nextRender();
      expect(getChips(comboBox).length).to.equal(2);
      expect(overflow.hasAttribute('hidden')).to.be.false;
    });

    it('should adapt overlay width to the input field width while opened', async () => {
      comboBox.opened = true;

      const overlay = document.querySelector('vaadin-multi-select-combo-box-overlay');
      const overlayPart = overlay.$.overlay;
      const width = overlayPart.clientWidth;
      expect(width).to.equal(comboBox.clientWidth);

      comboBox.selectedItems = ['apple', 'banana'];
      await nextRender();
      expect(overlayPart.clientWidth).to.be.lessThan(width);
      expect(overlayPart.clientWidth).to.be.equal(comboBox.clientWidth);
    });
  });

  describe('itemClassNameGenerator', () => {
    beforeEach(() => {
      comboBox.autoExpandHorizontally = true;
    });

    it('should set class name on the selected item chips', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['apple', 'lemon'];
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('apple');
      expect(chips[2].className).to.equal('lemon');
    });

    it('should set class name when generator set after selecting', async () => {
      comboBox.selectedItems = ['apple', 'lemon'];
      await nextRender();

      comboBox.itemClassNameGenerator = (item) => item;
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('apple');
      expect(chips[2].className).to.equal('lemon');
    });

    it('should remove class name when generator returns empty string', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['apple', 'lemon'];
      await nextRender();

      comboBox.itemClassNameGenerator = () => '';
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('');
      expect(chips[2].className).to.equal('');
    });

    it('should remove class name when generator is set to null', async () => {
      comboBox.itemClassNameGenerator = (item) => item;
      comboBox.selectedItems = ['apple', 'lemon'];
      await nextRender();

      comboBox.itemClassNameGenerator = null;
      await nextRender();

      const chips = getChips(comboBox);
      expect(chips[1].className).to.equal('');
      expect(chips[2].className).to.equal('');
    });
  });
});
