import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import type { ComboBox } from '../src/vaadin-combo-box.js';

interface Day {
  label: string;
  value: string;
  disabled?: boolean;
  availability?: { disabled: boolean };
}

describe('disabled items', () => {
  let comboBox: ComboBox<Day>;
  let days: Day[];

  function getOption(label: string) {
    return Array.from(comboBox.querySelectorAll('vaadin-combo-box-item')).find(
      (option) => !option.hidden && option.label === label,
    )!;
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    days = [
      { label: 'Monday', value: 'mon' },
      { label: 'Tuesday', value: 'tue', disabled: true, availability: { disabled: true } },
      { label: 'Wednesday', value: 'wed', availability: { disabled: false } },
    ];
    comboBox.items = days;
    await nextRender();
    comboBox.inputElement.focus();
  });

  it('should allow every item to be selected when no disabled path is set', () => {
    comboBox.open();

    getOption('Tuesday').click();

    expect(comboBox.selectedItem).to.equal(days[1]);
  });

  it('should preserve disabled attributes set by a renderer when no path is set', () => {
    comboBox.renderer = (root, _comboBox, { item }) => {
      root.toggleAttribute('disabled', item.disabled === true);
      root.setAttribute('aria-disabled', String(item.disabled === true));
      root.textContent = item.label;
    };

    comboBox.open();

    const option = getOption('Tuesday');
    expect(option.hasAttribute('disabled')).to.be.true;
    expect(option.getAttribute('aria-disabled')).to.equal('true');
    expect(getOption('Monday').getAttribute('aria-disabled')).to.equal('false');
  });

  describe('with an item disabled path', () => {
    beforeEach(() => {
      comboBox.setAttribute('item-disabled-path', 'availability.disabled');
      comboBox.open();
    });

    it('should expose the unavailable option as disabled and keep it in the list', () => {
      expect(getOption('Tuesday').getAttribute('aria-disabled')).to.equal('true');
      expect(getOption('Monday').getAttribute('aria-disabled')).not.to.equal('true');
      expect(getOption('Wednesday').getAttribute('aria-disabled')).not.to.equal('true');
    });

    it('should leave the selection unchanged when a disabled item is clicked', () => {
      comboBox.value = 'mon';
      const changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);

      getOption('Tuesday').click();

      expect(comboBox.value).to.equal('mon');
      expect(changeSpy.called).to.be.false;
    });

    it('should highlight a disabled item without selecting it on Enter', async () => {
      comboBox.value = 'mon';
      const changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });

      const option = getOption('Tuesday');
      expect(comboBox.inputElement.getAttribute('aria-activedescendant')).to.equal(option.id);
      expect(option.getAttribute('aria-disabled')).to.equal('true');
      expect(document.activeElement).to.equal(comboBox.inputElement);

      await sendKeys({ press: 'Enter' });

      expect(comboBox.opened).to.be.true;
      expect(comboBox.selectedItem).to.equal(days[0]);
      expect(changeSpy.called).to.be.false;

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });

      expect(comboBox.selectedItem).to.equal(days[2]);
    });

    it('should highlight a disabled item when navigating backward', async () => {
      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ press: 'ArrowUp' });

      expect(comboBox.inputElement.getAttribute('aria-activedescendant')).to.equal(getOption('Tuesday').id);
    });

    it('should reveal an offscreen disabled option and let Tab leave without selecting it', async () => {
      const nextField = fixtureSync<HTMLInputElement>('<input>');
      comboBox.items = Array.from({ length: 100 }, (_, index) => ({
        label: `Row ${index}`,
        value: String(index),
        availability: { disabled: index === 99 },
      }));

      await sendKeys({ press: 'ArrowUp' });
      await nextRender();

      const activeId = comboBox.inputElement.getAttribute('aria-activedescendant');
      const activeOption = comboBox.querySelector(`[id="${activeId}"]`);
      expect(activeOption?.textContent).to.equal('Row 99');
      expect(activeOption?.getAttribute('aria-disabled')).to.equal('true');
      expect(document.activeElement).to.equal(comboBox.inputElement);

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(nextField);
      expect(comboBox.value).to.equal('');
    });

    it('should expose an active option without a selection when all items are disabled', async () => {
      comboBox.items = [days[1]];

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Enter' });

      expect(comboBox.inputElement.getAttribute('aria-activedescendant')).to.equal(getOption('Tuesday').id);
      expect(comboBox.value).to.equal('');
    });

    it('should restore an option when its disabled path is removed', async () => {
      comboBox.removeAttribute('item-disabled-path');
      await nextRender();
      const option = getOption('Tuesday');

      option.click();

      expect(option.getAttribute('aria-disabled')).not.to.equal('true');
      expect(comboBox.selectedItem).to.equal(days[1]);
    });

    it('should clear the disabled state when filtering reuses an option element', async () => {
      await sendKeys({ type: 'Tuesday' });
      const option = getOption('Tuesday');

      comboBox.filter = 'Wednesday';
      await nextRender();

      expect(getOption('Wednesday')).to.equal(option);
      expect(option.getAttribute('aria-disabled')).not.to.equal('true');
    });

    it('should allow the application to provide an unavailable selection', () => {
      comboBox.value = 'tue';

      expect(comboBox.selectedItem).to.equal(days[1]);
    });

    it('should keep the selected disabled item on Tab when another item has the same label', async () => {
      comboBox.close();
      comboBox.items = [
        { label: 'Tuesday', value: 'full', availability: { disabled: true } },
        { label: 'Tuesday', value: 'available' },
      ];
      comboBox.value = 'full';
      const changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'Tab' });

      expect(comboBox.value).to.equal('full');
      expect(changeSpy.called).to.be.false;
    });

    it('should keep the highlight when an item becomes disabled on refresh', async () => {
      comboBox.value = 'mon';
      days[1].availability = { disabled: false };
      comboBox.requestContentUpdate();
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowDown' });

      days[1].availability.disabled = true;
      comboBox.requestContentUpdate();
      await nextRender();

      const option = getOption('Tuesday');
      expect(comboBox.inputElement.getAttribute('aria-activedescendant')).to.equal(option.id);
      expect(option.getAttribute('aria-disabled')).to.equal('true');

      await sendKeys({ press: 'Enter' });
      expect(comboBox.value).to.equal('mon');
    });

    it('should not commit the exact label of a disabled item on blur', async () => {
      await sendKeys({ type: 'Tuesday' });

      outsideClick();

      expect(comboBox.value).to.equal('');
    });

    it('should select the enabled match for a duplicate label when typing with the dropdown closed', async () => {
      comboBox.close();
      comboBox.autoOpenDisabled = true;
      comboBox.items = [
        { label: 'Tuesday', value: 'full', availability: { disabled: true } },
        { label: 'Tuesday', value: 'available' },
      ];

      await sendKeys({ type: 'Tuesday' });
      await sendKeys({ press: 'Tab' });

      expect(comboBox.value).to.equal('available');
    });

    it('should not treat a disabled item as a custom value', async () => {
      comboBox.allowCustomValue = true;
      const customValueSpy = sinon.spy();
      comboBox.addEventListener('custom-value-set', customValueSpy);

      await sendKeys({ type: 'Tuesday' });
      await sendKeys({ press: 'Enter' });

      expect(comboBox.value).to.equal('');
      expect(customValueSpy.called).to.be.false;
    });

    it('should highlight the first enabled partial match', async () => {
      comboBox.partialMatchMode = 'first-match';
      comboBox.items = [
        { label: 'Early morning', value: 'early', availability: { disabled: true } },
        { label: 'Late morning', value: 'late' },
      ];

      await sendKeys({ type: 'morning' });

      expect(comboBox.inputElement.getAttribute('aria-activedescendant')).to.equal(getOption('Late morning').id);
    });
  });
});
