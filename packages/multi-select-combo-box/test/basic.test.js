import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-multi-select-combo-box.js';

describe('basic', () => {
  let comboBox, internal, inputElement;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    internal = comboBox.$.comboBox;
    inputElement = comboBox.inputElement;
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = comboBox.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('properties and attributes', () => {
    it('should propagate inputElement property to combo-box', () => {
      expect(internal.inputElement).to.equal(comboBox.inputElement);
    });

    it('should propagate opened property to input', () => {
      comboBox.opened = true;
      expect(internal.opened).to.be.true;

      comboBox.opened = false;
      expect(internal.opened).to.be.false;
    });

    it('should reflect opened property to attribute', () => {
      comboBox.opened = true;
      expect(comboBox.hasAttribute('opened')).to.be.true;

      comboBox.opened = false;
      expect(comboBox.hasAttribute('opened')).to.be.false;
    });

    it('should propagate placeholder property to input', () => {
      expect(inputElement.placeholder).to.be.not.ok;
      comboBox.placeholder = 'foo';
      expect(inputElement.placeholder).to.be.equal('foo');
    });

    it('should propagate disabled property to combo-box', () => {
      expect(internal.disabled).to.be.false;
      comboBox.disabled = true;
      expect(internal.disabled).to.be.true;
    });

    it('should propagate disabled property to input', () => {
      expect(inputElement.disabled).to.be.false;
      comboBox.disabled = true;
      expect(inputElement.disabled).to.be.true;
    });

    it('should propagate readonly property to combo-box', () => {
      expect(internal.readonly).to.be.false;
      comboBox.readonly = true;
      expect(internal.readonly).to.be.true;
    });

    it('should reflect readonly property to attribute', () => {
      comboBox.readonly = true;
      expect(comboBox.hasAttribute('readonly')).to.be.true;
    });

    it('should set itemLabelPath property by default', () => {
      expect(comboBox.itemLabelPath).to.equal('label');
    });

    it('should propagate itemLabelPath property to combo-box', () => {
      comboBox.itemLabelPath = 'title';
      expect(internal.itemLabelPath).to.equal('title');
    });

    it('should set itemValuePath property by default', () => {
      expect(comboBox.itemValuePath).to.equal('value');
    });

    it('should propagate itemValuePath property to combo-box', () => {
      comboBox.itemValuePath = 'key';
      expect(internal.itemValuePath).to.equal('key');
    });

    it('should propagate size property to combo-box', () => {
      comboBox.size = 20;
      expect(internal.size).to.equal(20);
    });

    it('should update size when combo-box size changes', () => {
      internal.size = 20;
      expect(comboBox.size).to.equal(20);
    });

    it('should propagate loading property to combo-box', () => {
      comboBox.loading = true;
      expect(internal.loading).to.be.true;
    });

    it('should update size when combo-box size changes', () => {
      internal.loading = true;
      expect(comboBox.loading).to.be.true;
    });

    it('should reflect loading property to attribute', () => {
      comboBox.loading = true;
      expect(comboBox.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      expect(comboBox.hasAttribute('loading')).to.be.false;
    });

    it('should update filteredItems when combo-box filteredItems changes', () => {
      internal.filteredItems = ['apple'];
      expect(comboBox.filteredItems).to.deep.equal(['apple']);
    });

    it('should update filteredItems on combo-box filteredItems splice', () => {
      internal.splice('filteredItems', 0, 2);
      expect(comboBox.filteredItems).to.deep.equal(['lemon', 'orange']);
    });

    it('should call clearCache() method on the combo-box', () => {
      const spy = sinon.spy(internal, 'clearCache');
      comboBox.clearCache();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not throw on clearCache() if not attached', () => {
      const combo = document.createElement('vaadin-multi-select-combo-box');
      expect(() => {
        combo.clearCache();
      }).to.not.throw(Error);
    });

    it('should propagate focused attribute to combo-box', () => {
      expect(internal.hasAttribute('focused')).to.be.false;
      comboBox.focus();
      expect(internal.hasAttribute('focused')).to.be.true;
      comboBox.blur();
      expect(internal.hasAttribute('focused')).to.be.false;
    });
  });

  describe('pageSize', () => {
    beforeEach(() => {
      sinon.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should propagate pageSize property to combo-box', () => {
      comboBox.pageSize = 25;
      expect(internal.pageSize).to.equal(25);
    });

    it('should log error when incorrect pageSize is set', () => {
      comboBox.pageSize = 0;
      expect(internal.pageSize).to.equal(50);
      expect(console.error.calledOnce).to.be.true;
    });
  });

  describe('clear button', () => {
    let clearButton;

    beforeEach(() => {
      clearButton = comboBox.$.clearButton;
      comboBox.clearButtonVisible = true;
    });

    it('should not show clear button when disabled', () => {
      comboBox.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not show clear button when readonly', () => {
      comboBox.readonly = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not open the dropdown', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      clearButton.click();
      expect(internal.opened).to.be.false;
    });

    it('should clear selected items on Esc when clear button is visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal([]);
    });

    it('should not clear selected items on Esc when clear button is not visible', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.clearButtonVisible = false;
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(comboBox.selectedItems).to.deep.equal(['apple', 'orange']);
    });

    it('should prevent default for touchend event on clear button', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      const event = new CustomEvent('touchend', { cancelable: true });
      clearButton.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should clear selected items on clear button touchend', () => {
      comboBox.selectedItems = ['apple', 'orange'];
      clearButton.dispatchEvent(new CustomEvent('touchend', { cancelable: true }));
      expect(comboBox.selectedItems).to.deep.equal([]);
    });
  });

  describe('chips', () => {
    const getChips = (combo) => combo.shadowRoot.querySelectorAll('[part~="chip"]');

    const getChipContent = (chip) => chip.shadowRoot.querySelector('[part="label"]').textContent;

    const nextResize = (target) => {
      return new Promise((resolve) => {
        new ResizeObserver(() => setTimeout(resolve)).observe(target);
      });
    };

    beforeEach(async () => {
      comboBox.selectedItems = ['orange'];
      await nextRender();
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
        await nextRender();
        comboBox.disabled = true;
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
        expect(overflow.label).to.equal(2);
      });

      it('should set overflow chip title as not fitting chips labels', async () => {
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
        const title = overflow.getAttribute('title');
        expect(title).to.equal('apple, banana');
      });

      it('should set overflow chip part if only one chip does not fit', async () => {
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        const part = overflow.getAttribute('part');
        expect(part).to.contain('overflow-one');
      });

      it('should set overflow chip part if two chips do not fit', async () => {
        comboBox.selectedItems = ['apple', 'banana', 'orange'];
        await nextRender();
        const part = overflow.getAttribute('part');
        expect(part).to.contain('overflow-two');
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
          comboBox.style.width = '350px';
          await nextResize(comboBox);

          comboBox.clearButtonVisible = true;
          await nextRender();
          expect(overflow.hasAttribute('hidden')).to.be.false;

          comboBox.clearButtonVisible = false;
          await nextRender();
          expect(overflow.hasAttribute('hidden')).to.be.true;
        });
      });
    });

    describe('readonly', () => {
      beforeEach(async () => {
        comboBox.style.width = '250px';
        await nextResize(comboBox);
        comboBox.selectedItems = ['apple', 'banana'];
        await nextRender();
        comboBox.readonly = true;
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

      it('should remove readonly attribute from chips when not readonly', () => {
        comboBox.readonly = false;
        const chips = getChips(comboBox);
        expect(chips[0].hasAttribute('readonly')).to.be.false;
        expect(chips[1].hasAttribute('readonly')).to.be.false;
      });

      it('should set readonly attribute on added chips while readonly', () => {
        comboBox.selectedItems = ['lemon', 'orange'];
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

        it('should not mark last chip on Backspace as focused when dropdown is opened', async () => {
          await sendKeys({ press: 'ArrowDown' });
          await sendKeys({ press: 'Backspace' });
          const chips = getChips(comboBox);
          expect(chips[1].hasAttribute('focused')).to.be.false;
          expect(chips[2].hasAttribute('focused')).to.be.false;
        });

        it('should not mark last chip on Backspace as focused when readonly', async () => {
          comboBox.readonly = true;
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

            it(`should not mark last chip on ${PREV_KEY} as focused when input has value`, async () => {
              await sendKeys({ type: 'lemon' });
              await sendKeys({ press: PREV_KEY });
              const chips = getChips(comboBox);
              expect(chips[1].hasAttribute('focused')).to.be.false;
              expect(chips[2].hasAttribute('focused')).to.be.false;
            });

            it(`should not mark last chip on ${PREV_KEY} as focused when dropdown is opened`, async () => {
              await sendKeys({ press: 'ArrowDown' });
              await sendKeys({ press: PREV_KEY });
              const chips = getChips(comboBox);
              expect(chips[1].hasAttribute('focused')).to.be.false;
              expect(chips[2].hasAttribute('focused')).to.be.false;
            });

            it(`should mark previous chip on ${PREV_KEY} as focused when a chip is focused`, async () => {
              await sendKeys({ press: PREV_KEY });
              await sendKeys({ press: PREV_KEY });
              const chips = getChips(comboBox);
              expect(chips[1].hasAttribute('focused')).to.be.true;
              expect(chips[2].hasAttribute('focused')).to.be.false;
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
          });
        });
      });
    });
  });

  describe('change event', () => {
    let spy;

    beforeEach(async () => {
      spy = sinon.spy();
      comboBox.addEventListener('change', spy);
      comboBox.selectedItems = ['apple'];
      await nextRender();
      inputElement.focus();
    });

    it('should fire change on user arrow input commit', async () => {
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'ArrowDown' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on clear button click', () => {
      comboBox.clearButtonVisible = true;
      comboBox.$.clearButton.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change when chip is removed', () => {
      const chip = comboBox.shadowRoot.querySelector('[part="chip"]');
      chip.shadowRoot.querySelector('[part="remove-button"]').click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should stop change event on the native input', () => {
      inputElement.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      expect(spy.called).to.be.false;
    });
  });

  describe('allowCustomValue', () => {
    beforeEach(async () => {
      comboBox.allowCustomValue = true;
      comboBox.selectedItems = ['apple'];
      await nextRender();
      inputElement.focus();
    });

    it('should fire custom-value-set event when entering custom value', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should clear input element value after entering custom value', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(internal.value).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear input element value after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(internal.value).to.equal('');
      expect(inputElement.value).to.equal('');
    });

    it('should clear filter property after clicking matching value', async () => {
      await sendKeys({ type: 'ora' });
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      item.click();
      expect(comboBox.filter).to.equal('');
    });

    it('should not add custom value to selectedItems automatically', async () => {
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Enter' });
      expect(comboBox.selectedItems).to.deep.equal(['apple']);
    });
  });

  describe('helper text', () => {
    it('should set helper text content using helperText property', async () => {
      comboBox.helperText = 'foo';
      await nextRender();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });

    it('should display the helper text when slotted helper available', async () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      comboBox.appendChild(helper);
      await nextRender();
      expect(comboBox.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      comboBox.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to input container', () => {
      const inputField = comboBox.shadowRoot.querySelector('[part="input-field"]');
      expect(inputField.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to combo-box', () => {
      expect(comboBox.$.comboBox.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('required', () => {
    beforeEach(() => {
      comboBox.required = true;
    });

    it('should be invalid when selectedItems is empty', () => {
      expect(comboBox.validate()).to.be.false;
      expect(comboBox.invalid).to.be.true;
    });

    it('should be valid when selectedItems is not empty', () => {
      comboBox.selectedItems = ['apple'];
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should focus on required indicator click', () => {
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should not be invalid when empty and readonly', () => {
      comboBox.readonly = true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });
  });

  describe('renderer', () => {
    it('should propagate renderer property to combo-box', () => {
      const renderer = (root, _, model) => {
        root.textContent = model.item;
      };
      comboBox.renderer = renderer;
      expect(internal.renderer).to.equal(renderer);
    });

    it('should pass the "root", "owner", "model" arguments to the renderer', () => {
      const spy = sinon.spy();
      comboBox.renderer = spy;
      comboBox.opened = true;

      const [root, owner, model] = spy.firstCall.args;

      expect(root.localName).to.equal('vaadin-multi-select-combo-box-item');
      expect(owner).to.eql(comboBox);
      expect(model).to.deep.equal({
        item: 'apple',
        index: 0,
        focused: false,
        selected: false,
      });
    });

    it('should use renderer when it is defined', () => {
      comboBox.renderer = (root, _, model) => {
        const textNode = document.createTextNode(`${model.item} ${model.index}`);
        root.appendChild(textNode);
      };
      comboBox.opened = true;

      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      expect(item.textContent.trim()).to.equal('apple 0');
    });

    it('should run renderers when requesting content update', () => {
      comboBox.renderer = sinon.spy();
      comboBox.opened = true;

      expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length);

      comboBox.renderer.resetHistory();
      comboBox.requestContentUpdate();

      expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length);
    });

    it('should not throw if requestContentUpdate() called before opening', () => {
      expect(() => comboBox.requestContentUpdate()).not.to.throw(Error);
    });

    it('should not throw if requestContentUpdate() called before attached', () => {
      const combo = document.createElement('vaadin-multi-select-combo-box');
      expect(() => {
        combo.requestContentUpdate();
      }).to.not.throw(Error);
    });

    it('should render the item label when removing the renderer', () => {
      comboBox.renderer = (root, _, model) => {
        root.textContent = model.item.toUpperCase();
      };
      comboBox.opened = true;

      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      expect(item.textContent).to.equal('APPLE');

      comboBox.renderer = null;

      expect(item.textContent).to.equal('apple');
    });

    it('should clear the old content after assigning a new renderer', () => {
      comboBox.opened = true;
      comboBox.renderer = () => {};
      const item = document.querySelector('vaadin-multi-select-combo-box-item');
      expect(item.textContent).to.equal('');
    });
  });
});
