import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-select.js';

describe('accessibility', () => {
  /**  @type {HTMLElement} */
  let select;
  /**  @type {HTMLElement} */
  let valueButton;

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select label="Label"></vaadin-select>`);
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    valueButton = select.querySelector('vaadin-select-value-button');
    await nextFrame();
  });

  it('should toggle aria-expanded attribute on the value button on open', () => {
    select.opened = true;
    expect(valueButton.getAttribute('aria-expanded')).to.equal('true');
    select.opened = false;
    expect(valueButton.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should add aria-live attribute on first-letter shortcut selection', async () => {
    select.focus();
    await sendKeys({ press: 'o' });
    expect(valueButton.getAttribute('aria-live')).to.equal('polite');
  });

  it('should remove aria-live attribute on dropdown open', async () => {
    select.focus();
    await sendKeys({ press: 'o' });
    select.opened = true;
    expect(valueButton.hasAttribute('aria-live')).to.be.false;
  });

  it('should append item id to `aria-labelledby` when an item is selected', () => {
    select.value = 'Option 1';
    const labelId = select.querySelector('[slot=label]').id;
    expect(valueButton.getAttribute('aria-labelledby').split(' ')).to.have.members([select._itemId, labelId]);
  });

  it('should append item id to `aria-labelledby` when placeholder is set', () => {
    select.placeholder = 'placeholder';
    const labelId = select.querySelector('[slot=label]').id;
    expect(valueButton.getAttribute('aria-labelledby').split(' ')).to.have.members([select._itemId, labelId]);
  });

  describe('accessible-name', async () => {
    beforeEach(async () => {
      select = /** @type {HTMLElement} */ fixtureSync('<vaadin-select label="label"></vaadin-select>');
      select.items = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ];
      valueButton = select.querySelector('vaadin-select-value-button');
      await nextRender();
    });

    it('should be null by default', () => {
      expect(select.accessibleName).to.not.exist;
    });
    it('should create slotted element on value change', () => {
      select.accessibleName = 'accessible name';
      expect(select.querySelector('[slot=sr-label]')).to.exist;
    });
    it('should set property value as text content to slotted element', () => {
      select.accessibleName = 'accessible name';
      expect(select.querySelector('[slot=sr-label]').textContent).to.equal('accessible name');
    });
    it('should replace `aria-labelledby` with slotted element unique id', () => {
      select.accessibleName = 'accessible name';
      const srLabel = select.querySelector('[slot=sr-label]');
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(srLabel.id);
    });
    it('should restore `aria-labelledby` when value is removed', () => {
      const initialLabelledByValue = valueButton.getAttribute('aria-labelledby');
      expect(initialLabelledByValue).to.exist;
      select.accessibleName = 'accessible name';
      select.accessibleName = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(initialLabelledByValue);
    });
    it('should keep `aria-labelledby` if value is changed', () => {
      select.accessibleName = 'accessible name';
      select.value = 'Option 0';
      const srLabel = select.querySelector('[slot=sr-label]');
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(srLabel.id);
    });
    it('should add item id to `aria-labelledby` when placeholder is defined', () => {
      select.accessibleName = 'accessible name';
      select.placeholder = 'placeholder';
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });
    it('should remove item id from `aria-labelledby` when placeholder is removed', () => {
      select.accessibleName = 'accessible name';
      select.placeholder = 'placeholder';
      select.placeholder = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });
    it('should add item id to `aria-labelledby` when selected item is set', () => {
      select.accessibleName = 'accessible name';
      select.value = 'Option 1';
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });
    it('should remove item id from `aria-labelledby` when selected item is removed', () => {
      select.accessibleName = 'accessible name';
      select.value = 'Option 1';
      select.value = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    describe('accessible-name is set initially', () => {
      beforeEach(async () => {
        select = fixtureSync('<vaadin-select label="label" accessible-name="accessible name"></vaadin-select>');
        select.items = [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
        ];
        valueButton = select.querySelector('vaadin-select-value-button');
        await nextRender();
      });

      it('should have accessible-name value as slotted element text content', () => {
        const srLabel = select.querySelector('[slot=sr-label]');
        expect(srLabel.textContent).to.equal(select.accessibleName);
      });

      it('should have slotted element id value in aria-labelledby', () => {
        const srLabel = select.querySelector('[slot=sr-label]');
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(srLabel.id);
      });

      it('should use the default label id as the `aria-labelledby` value when accessible-name is removed', () => {
        const label = select.querySelector('[slot=label]');
        select.accessibleName = null;
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(label.id);
      });
    });
  });

  describe('accessible-name-ref', async () => {
    beforeEach(async () => {
      select = /** @type {HTMLElement} */ fixtureSync('<vaadin-select label="label"></vaadin-select>');
      select.items = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ];
      valueButton = select.querySelector('vaadin-select-value-button');
      await nextRender();
    });

    it('should be null by default', () => {
      expect(select.accessibleNameRef).to.not.exist;
    });
    it('should replace `aria-labelledby` with value given to the property', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
    });
    it('should restore `aria-labelledby` when value is removed', () => {
      const initialLabelledByValue = valueButton.getAttribute('aria-labelledby');
      expect(initialLabelledByValue).to.exist;
      select.accessibleNameRef = 'accessible-name-ref';
      select.accessibleNameRef = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(initialLabelledByValue);
    });
    it('should keep `aria-labelledby` if select value is changed', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      select.value = 'Option 0';
      expect(valueButton.getAttribute('aria-labelledby')).to.contain('accessible-name-ref');
    });
    it('should add item id to `aria-labelledby` when placeholder is defined', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      select.placeholder = 'placeholder';
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });
    it('should remove item id from `aria-labelledby` when placeholder is removed', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      select.placeholder = 'placeholder';
      select.placeholder = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });
    it('should add item id to `aria-labelledby` when selected item is set', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      select.value = 'Option 1';
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });
    it('should remove item id from `aria-labelledby` when selected item is removed', () => {
      select.accessibleNameRef = 'accessible-name-ref';
      select.value = 'Option 1';
      select.value = null;
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    describe('accessible-name-ref is set initially', () => {
      beforeEach(async () => {
        select = fixtureSync('<vaadin-select label="label" accessible-name-ref="accessible-name-ref"></vaadin-select>');
        select.items = [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
        ];
        valueButton = select.querySelector('vaadin-select-value-button');
        await nextRender();
      });

      it('should have property value in aria-labelledby', () => {
        expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
      });

      it('should use the default label id as the `aria-labelledby` value when accessible-name is removed', () => {
        const label = select.querySelector('[slot=label]');
        select.accessibleNameRef = null;
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(label.id);
      });
    });
  });
});
