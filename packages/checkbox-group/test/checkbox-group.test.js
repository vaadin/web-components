import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-checkbox-group.js';

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
      await nextFrame();
      checkboxes[0].checked = false;
      await nextFrame();
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

    it('should propagate disabled property to checkboxes', async () => {
      checkboxes.forEach((checkbox) => {
        expect(checkbox.disabled).to.be.true;
      });

      group.disabled = false;
      await nextFrame();
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

  describe('readonly', () => {
    beforeEach(async () => {
      group = fixtureSync(`
        <vaadin-checkbox-group readonly>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      await nextFrame();
      checkboxes = [...group.querySelectorAll('vaadin-checkbox')];
    });

    it('should propagate readonly property to checkboxes', async () => {
      checkboxes.forEach((checkbox) => {
        expect(checkbox.readonly).to.be.true;
      });

      group.readonly = false;
      await nextFrame();
      checkboxes.forEach((checkbox) => {
        expect(checkbox.readonly).to.be.false;
      });
    });

    it('should set readonly property to dynamically added checkboxes', async () => {
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = '3';
      group.appendChild(checkbox);
      await nextFrame();
      expect(checkbox.readonly).to.be.true;
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

    it('should add dynamically added checked checkbox value when group value is null', async () => {
      group.value = null;
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      checkbox.checked = true;
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.eql(['new']);
    });

    it('should ignore dynamically added unchecked checkbox value when group value is null', async () => {
      group.value = null;
      const checkbox = document.createElement('vaadin-checkbox');
      checkbox.value = 'new';
      group.appendChild(checkbox);
      await nextFrame();
      expect(group.value).to.be.null;
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

    it('should set proper value to checkbox-group when a checkbox is checked', async () => {
      checkboxes[0].checked = true;
      await nextFrame();
      expect(group.value).to.deep.equal(['1']);
      checkboxes[1].checked = true;
      await nextFrame();
      expect(group.value).to.deep.equal(['1', '2']);
    });

    it('should set proper value to checkbox-group when a checkbox is unchecked', async () => {
      checkboxes[0].checked = true;
      await nextFrame();
      checkboxes[1].checked = true;
      await nextFrame();
      expect(group.value).to.deep.equal(['1', '2']);
      checkboxes[1].checked = false;
      await nextFrame();
      expect(group.value).to.deep.equal(['1']);
    });

    it('should check proper checkbox when value is set', async () => {
      group.value = ['2'];
      await nextFrame();
      expect(checkboxes[1].checked).to.be.true;
      group.value = ['1', '3'];
      await nextFrame();
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
    });

    it('should uncheck proper checkbox when value is removed', async () => {
      group.value = ['1', '3'];
      await nextFrame();
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.true;
      group.value = ['1'];
      await nextFrame();
      expect(checkboxes[0].checked).to.be.true;
      expect(checkboxes[2].checked).to.be.false;
    });
  });

  describe('focused attribute', () => {
    let firstGlobalFocusable;

    beforeEach(async () => {
      [firstGlobalFocusable, group] = fixtureSync(
        `<div>
          <input id="first-global-focusable" />
          <vaadin-checkbox-group>
            <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          </vaadin-checkbox-group>
        </div>`,
      ).children;
      firstGlobalFocusable.focus();
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
      await sendKeys({ press: 'Shift+Tab' });

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

    it('should toggle the attribute on value change', async () => {
      group.value = ['2'];
      await nextFrame();
      expect(group.hasAttribute('has-value')).to.be.true;
      group.value = [];
      await nextFrame();
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
});
