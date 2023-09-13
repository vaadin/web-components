import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';

describe('accessibility', () => {
  let select, valueButton;

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select label="Label"></vaadin-select>`);
    await nextRender();
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    await nextUpdate(select);
    valueButton = select.querySelector('vaadin-select-value-button');
  });

  it('should toggle aria-expanded attribute on the value button on open', async () => {
    select.opened = true;
    await nextUpdate(select);
    expect(valueButton.getAttribute('aria-expanded')).to.equal('true');

    select.opened = false;
    await nextUpdate(select);
    expect(valueButton.getAttribute('aria-expanded')).to.equal('false');
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

  it('should append item id to `aria-labelledby` when an item is selected', async () => {
    select.value = 'Option 1';
    await nextUpdate(select);
    const labelId = select.querySelector('[slot=label]').id;
    expect(valueButton.getAttribute('aria-labelledby').split(' ')).to.have.members([select._itemId, labelId]);
  });

  it('should append item id to `aria-labelledby` when placeholder is set', async () => {
    select.placeholder = 'placeholder';
    await nextUpdate(select);
    const labelId = select.querySelector('[slot=label]').id;
    expect(valueButton.getAttribute('aria-labelledby').split(' ')).to.have.members([select._itemId, labelId]);
  });

  describe('accessible-name', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select label="label"></vaadin-select>');
      await nextRender();
      select.items = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ];
      await nextUpdate(select);
      valueButton = select.querySelector('vaadin-select-value-button');
    });

    it('should be null by default', () => {
      expect(select.accessibleName).to.not.exist;
    });

    it('should create slotted element on value change', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      expect(select.querySelector('[slot=sr-label]')).to.exist;
    });

    it('should set property value as text content to slotted element', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      expect(select.querySelector('[slot=sr-label]').textContent).to.equal('accessible name');
    });

    it('should replace `aria-labelledby` with slotted element unique id', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      const srLabel = select.querySelector('[slot=sr-label]');
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(srLabel.id);
    });

    it('should restore `aria-labelledby` when value is removed', async () => {
      const initialLabelledByValue = valueButton.getAttribute('aria-labelledby');
      expect(initialLabelledByValue).to.exist;
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.accessibleName = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(initialLabelledByValue);
    });

    it('should keep `aria-labelledby` if value is changed', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.value = 'Option 0';
      await nextUpdate(select);
      const srLabel = select.querySelector('[slot=sr-label]');
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(srLabel.id);
    });

    it('should add item id to `aria-labelledby` when placeholder is defined', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });

    it('should remove item id from `aria-labelledby` when placeholder is removed', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      select.placeholder = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    it('should add item id to `aria-labelledby` when selected item is set', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });

    it('should remove item id from `aria-labelledby` when selected item is removed', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      select.value = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    describe('accessible-name is set initially', () => {
      beforeEach(async () => {
        select = fixtureSync('<vaadin-select label="label" accessible-name="accessible name"></vaadin-select>');
        await nextRender();
        select.items = [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
        ];
        await nextUpdate(select);
        valueButton = select.querySelector('vaadin-select-value-button');
      });

      it('should have accessible-name value as slotted element text content', () => {
        const srLabel = select.querySelector('[slot=sr-label]');
        expect(srLabel.textContent).to.equal(select.accessibleName);
      });

      it('should have slotted element id value in aria-labelledby', () => {
        const srLabel = select.querySelector('[slot=sr-label]');
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(srLabel.id);
      });

      it('should use the default label id as the `aria-labelledby` value when accessible-name is removed', async () => {
        const label = select.querySelector('[slot=label]');
        select.accessibleName = null;
        await nextUpdate(select);
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(label.id);
      });

      describe('no items added initially', () => {
        beforeEach(async () => {
          select = fixtureSync('<vaadin-select label="label" accessible-name="accessible name"></vaadin-select>');
          await nextRender();
          valueButton = select.querySelector('vaadin-select-value-button');
        });

        it('should have slotted element id value in aria-labelledby', () => {
          const srLabel = select.querySelector('[slot=sr-label]');
          expect(valueButton.getAttribute('aria-labelledby')).to.equal(srLabel.id);
        });
      });
    });
  });

  describe('accessible-name-ref', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select label="label"></vaadin-select>');
      await nextRender();
      select.items = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ];
      await nextUpdate(select);
      valueButton = select.querySelector('vaadin-select-value-button');
    });

    it('should be null by default', () => {
      expect(select.accessibleNameRef).to.not.exist;
    });

    it('should replace `aria-labelledby` with value given to the property', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
    });

    it('should restore `aria-labelledby` when value is removed', async () => {
      const initialLabelledByValue = valueButton.getAttribute('aria-labelledby');
      expect(initialLabelledByValue).to.exist;
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.accessibleNameRef = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(initialLabelledByValue);
    });

    it('should keep `aria-labelledby` if select value is changed', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.value = 'Option 0';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.contain('accessible-name-ref');
    });

    it('should add item id to `aria-labelledby` when placeholder is defined', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });

    it('should remove item id from `aria-labelledby` when placeholder is removed', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      select.placeholder = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    it('should add item id to `aria-labelledby` when selected item is set', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.contain(select._itemId);
    });

    it('should remove item id from `aria-labelledby` when selected item is removed', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      select.value = null;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.not.contain(select._itemId);
    });

    describe('accessible-name-ref is set initially', () => {
      beforeEach(async () => {
        select = fixtureSync('<vaadin-select label="label" accessible-name-ref="accessible-name-ref"></vaadin-select>');
        await nextRender();
        select.items = [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
        ];
        await nextUpdate(select);
        valueButton = select.querySelector('vaadin-select-value-button');
      });

      it('should have property value in aria-labelledby', () => {
        expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
      });

      it('should use the default label id as the `aria-labelledby` value when accessible-name is removed', async () => {
        const label = select.querySelector('[slot=label]');
        select.accessibleNameRef = null;
        await nextUpdate(select);
        expect(valueButton.getAttribute('aria-labelledby')).to.equal(label.id);
      });

      describe('no items added initially', () => {
        beforeEach(async () => {
          select = fixtureSync(
            '<vaadin-select label="label" accessible-name-ref="accessible-name-ref"></vaadin-select>',
          );
          await nextRender();
          valueButton = select.querySelector('vaadin-select-value-button');
        });

        it('should have property value in aria-labelledby', () => {
          expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
        });
      });
    });
  });
});
