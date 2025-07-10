import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './multi-select-combo-box-test-styles.js';
import '../src/vaadin-multi-select-combo-box.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

describe('basic', () => {
  let comboBox, internal, inputElement;

  beforeEach(async () => {
    comboBox = fixtureSync(`<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>`);
    comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
    await nextRender();
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

    it('should propagate owner property to combo-box', () => {
      expect(internal.owner).to.equal(comboBox);
      expect(internal.$.overlay.owner).to.equal(comboBox);
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

    it('should update loading when combo-box loading changes', () => {
      internal.loading = true;
      expect(comboBox.loading).to.be.true;
    });

    it('should reflect loading property to attribute', () => {
      comboBox.loading = true;
      expect(comboBox.hasAttribute('loading')).to.be.true;

      comboBox.loading = false;
      expect(comboBox.hasAttribute('loading')).to.be.false;
    });

    it('should propagate itemClassNameGenerator property to combo-box', () => {
      const generator = (item) => item;
      comboBox.itemClassNameGenerator = generator;
      expect(internal.itemClassNameGenerator).to.equal(generator);
    });

    it('should update filteredItems when combo-box filteredItems changes', () => {
      internal.filteredItems = ['apple'];
      expect(comboBox.filteredItems).to.deep.equal(['apple']);
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

    it('should not clear selected items on Esc when readonly', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      comboBox.readonly = true;
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

    it('should not clear filter on clear button touchend', async () => {
      comboBox.selectedItems = ['apple', 'orange'];
      inputElement.focus();
      await sendKeys({ type: 'app' });

      clearButton.dispatchEvent(new CustomEvent('touchend', { cancelable: true, bubbles: true }));
      expect(inputElement.value).to.equal('app');
      expect(comboBox.filter).to.equal('app');
      expect(comboBox.filteredItems).to.deep.equal(['apple']);
    });
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = comboBox.$.toggleButton;
    });

    // WebKit returns true for isTouch in the test envirnoment. This test fails when isTouch == true, which is a correct behavior
    (isTouch ? it.skip : it)('should focus input element on toggle button click', () => {
      toggleButton.click();
      expect(internal.opened).to.be.true;
      expect(document.activeElement).to.equal(inputElement);
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
      const chip = comboBox.querySelector('[slot="chip"]');
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

    it('should not fire custom-value-set event when pressing Tab', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'pear' });
      await sendKeys({ down: 'Tab' });
      expect(spy.called).to.be.false;
    });

    it('should not fire custom-value-set event on outside click', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      await sendKeys({ type: 'ap' });
      await sendMouse({ type: 'click', position: [200, 200] });
      await resetMouse();
      expect(spy.called).to.be.false;
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
    beforeEach(async () => {
      comboBox.setAttribute('theme', 'foo');
      await nextFrame();
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

    it('should focus on required indicator click', () => {
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(comboBox.hasAttribute('focused')).to.be.true;
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
