import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-checkbox-group.js';

describe('vaadin-checkbox-group', () => {
  let group, checkboxes;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
      tagName = group.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('default', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2" disabled></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      checkboxes = group.querySelectorAll('vaadin-checkbox');
      await nextFrame();
    });

    it('should keep initial disabled property for checkboxes', () => {
      expect(checkboxes[0].disabled).to.be.false;
      expect(checkboxes[1].disabled).to.be.true;
    });

    it('should be possible to uncheck the checkbox on reattaching of the group', async () => {
      const container = group.parentElement;
      container.removeChild(group);
      container.appendChild(group);
      await nextFrame();
      checkboxes[0].checked = true;
      checkboxes[0].checked = false;
      expect(checkboxes[0].checked).to.be.false;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group disabled>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should propagate disabled property to checkboxes', () => {
      checkboxes.forEach((checkbox) => {
        expect(checkbox.disabled).to.be.true;
      });

      group.disabled = false;
      checkboxes.forEach((checkbox) => {
        expect(checkbox.disabled).to.be.false;
      });
    });

    it('should set disabled property to dynamically added checkboxes', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = '3';
      group.appendChild(checkbox);
      await nextFrame();
      expect(checkbox.disabled).to.be.true;
    });
  });

  describe('value', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="3" label="Checkbox 3"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should add dynamically added checked checkbox value to checkbox group value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.include('new');
    });

    it('should not add duplicate values when added checked checkbox already included in value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.value = ['new'];
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.eql(['new']);
    });

    it('should check dynamically added checkbox if included in value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      group.value = ['new'];
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.eql(['new']);
      expect(checkbox.checked).to.be.true;
    });

    it('should remove checked checkbox value from checkbox group value, when checkbox is dynamically removed', async () => {
      const checkbox = checkboxes[0];
      checkbox.checked = true;
      group.removeChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.include('1');
    });

    it('should create new array instance for checkbox group value when checkbox dynamically added', async () => {
      const value = group.value;
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.equal(value);
    });

    it('should create new array instance for checkbox group value when checkbox dynamically removed', async () => {
      const value = group.value;
      const checkbox = checkboxes[0];
      checkbox.checked = true;
      group.removeChild(checkbox);
      await nextFrame();
      expect(group.value).to.not.equal(value);
    });

    it('should not change checkbox group value if a removed checkbox is checked', async () => {
      const checkbox = checkboxes[0];
      group.removeChild(checkbox);
      await nextFrame();
      checkbox.checked = true;
      expect(group.value).to.not.include('1');
    });

    it('should set proper value to checkbox-group when a checkbox is checked', () => {
      checkboxes[0].checked = true;
      expect(group.value).to.deep.equal(['1']);
      checkboxes[1].checked = true;
      expect(group.value).to.deep.equal(['1', '2']);
    });

    it('should set proper value to checkbox-group when a checkbox is unchecked', () => {
      checkboxes[0].checked = true;
      checkboxes[1].checked = true;
      expect(group.value).to.deep.equal(['1', '2']);
      checkboxes[1].checked = false;
      expect(group.value).to.deep.equal(['1']);
    });

    it('should check proper checkbox when value is set', () => {
      group.value = ['2'];
      expect(checkboxes[1].checked).to.be.true;
      group.value = ['1', '3'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
    });

    it('should uncheck proper checkbox when value is removed', () => {
      group.value = ['1', '3'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
      group.value = ['1'];
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.false;
    });
  });

  describe('focused attribute', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should set focused attribute on Tab', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.true;
      expect(group.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on Shift+Tab', async () => {
      // Focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      // Move focus out of the checkbox group.
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.false;
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on Tab when disabled', async () => {
      group.disabled = true;
      // Try to focus on the first checkbox.
      await sendKeys({ press: 'Tab' });

      expect(checkboxes[0].hasAttribute('focused')).to.be.false;
      expect(group.hasAttribute('focused')).to.be.false;
    });

    it('should not steal focus from currently focused element', () => {
      const focusInput = document.createElement('input');
      document.body.appendChild(focusInput);
      focusInput.focus();
      group.value = '1';
      expect(document.activeElement).to.be.equal(focusInput);
      document.body.removeChild(focusInput);
    });
  });

  describe('has-value attribute', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should toggle the attribute on value change', () => {
      group.value = ['2'];
      expect(group.hasAttribute('has-value')).to.be.true;
      group.value = [];
      expect(group.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('warnings', () => {
    beforeEach(async () => {
      group = fixtureSync(`<vaadin-checkbox-group></vaadin-checkbox-group>`);
      await nextFrame();
    });

    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when adding checkbox without value', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.calledOnce).to.be.true;
    });

    it('should not warn when adding checkbox with value attribute', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.setAttribute('value', 'something');
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.called).to.be.false;
    });

    it('should not warn when adding checkbox with value property', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'something';
      group.appendChild(checkbox);
      await nextFrame();
      expect(console.warn.called).to.be.false;
    });
  });

  describe('wrapping', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="c_1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="c_2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="c_3" label="Checkbox 3"></vaadin-checkbox>
          <vaadin-checkbox value="c_4" label="Checkbox 4"></vaadin-checkbox>
          <vaadin-checkbox value="c_5" label="Checkbox 5"></vaadin-checkbox>
          <vaadin-checkbox value="c_6" label="Checkbox 6"></vaadin-checkbox>
          <vaadin-checkbox value="c_7" label="Checkbox 7"></vaadin-checkbox>
          <vaadin-checkbox value="c_8" label="Checkbox 8"></vaadin-checkbox>
          <vaadin-checkbox value="c_9" label="Checkbox 9"></vaadin-checkbox>
          <vaadin-checkbox value="c_10" label="Checkbox 10"></vaadin-checkbox>
          <vaadin-checkbox value="c_11" label="Checkbox 11"></vaadin-checkbox>
          <vaadin-checkbox value="c_12" label="Checkbox 12"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
    });

    it('should not overflow horizontally', () => {
      const parentWidth = group.parentElement.offsetWidth;

      expect(group.offsetWidth).to.be.lte(parentWidth);
      expect(group.shadowRoot.querySelector('[part~="group-field"]').offsetWidth).to.be.lte(parentWidth);
    });

    it('should wrap checkboxes', () => {
      const checkboxes = Array.from(group.children);
      const { top: firstTop, left: firstLeft } = checkboxes[0].getBoundingClientRect();

      const wrapped = Array.from(checkboxes)
        .slice(1)
        .filter((checkbox) => checkbox.getBoundingClientRect().top > firstTop);

      expect(wrapped).to.not.be.empty;
      expect(wrapped[0].getBoundingClientRect().left).to.equal(firstLeft);
    });
  });
});
