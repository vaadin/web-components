import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-select.js';

describe('accessibility', () => {
  let select, valueButton;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select label="Label"></vaadin-select>');
    await nextRender();
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    await nextUpdate(select);
    valueButton = select.querySelector('vaadin-select-value-button');
  });

  describe('ARIA attributes', () => {
    it('should toggle aria-expanded attribute on the value button on open', async () => {
      select.opened = true;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-expanded')).to.equal('true');

      select.opened = false;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should toggle aria-controls attribute on the value button on open', async () => {
      const listBox = select.querySelector('vaadin-select-list-box');

      select.opened = true;
      await nextUpdate(select);
      expect(listBox.id).to.be.ok;
      expect(valueButton.getAttribute('aria-controls')).to.equal(listBox.id);

      select.opened = false;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-controls')).to.be.false;
    });

    it('should toggle aria-readonly attribute on the value button on readonly change', async () => {
      expect(valueButton.hasAttribute('aria-readonly')).to.be.false;

      select.readonly = true;
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-readonly')).to.equal('true');

      select.readonly = false;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-readonly')).to.be.false;
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

    it('should set `aria-labelledby` to the label id', () => {
      const labelId = select.querySelector('[slot=label]').id;
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(labelId);
    });

    it('should not add the selected item to `aria-labelledby` when an item is selected', async () => {
      select.value = 'Option 1';
      await nextUpdate(select);
      const labelId = select.querySelector('[slot=label]').id;
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(labelId);
    });

    it('should not add the placeholder to `aria-labelledby` when placeholder is set', async () => {
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      const labelId = select.querySelector('[slot=label]').id;
      expect(valueButton.getAttribute('aria-labelledby')).to.equal(labelId);
    });
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

    it('should set `aria-label` when the property is set', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-label')).to.equal('accessible name');
    });

    it('should remove `aria-labelledby` when the property is set', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should remove `aria-label` when the property is removed', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.accessibleName = null;
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-label')).to.be.false;
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

    it('should keep `aria-label` if select value is changed', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-label')).to.equal('accessible name');
    });

    it('should not add the placeholder to `aria-labelledby` when placeholder is defined', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should not add the selected item to `aria-labelledby` when selected item is set', async () => {
      select.accessibleName = 'accessible name';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      expect(valueButton.hasAttribute('aria-labelledby')).to.be.false;
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

      it('should have property value in aria-label', () => {
        expect(valueButton.getAttribute('aria-label')).to.equal('accessible name');
      });

      it('should not set aria-labelledby', () => {
        expect(valueButton.hasAttribute('aria-labelledby')).to.be.false;
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

        it('should have property value in aria-label', () => {
          expect(valueButton.getAttribute('aria-label')).to.equal('accessible name');
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

    it('should not add the placeholder to `aria-labelledby` when placeholder is defined', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.placeholder = 'placeholder';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
    });

    it('should not add the selected item to `aria-labelledby` when selected item is set', async () => {
      select.accessibleNameRef = 'accessible-name-ref';
      await nextUpdate(select);
      select.value = 'Option 1';
      await nextUpdate(select);
      expect(valueButton.getAttribute('aria-labelledby')).to.equal('accessible-name-ref');
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

  describe('slotted list box', () => {
    it('should use the existing slotted list box id for `aria-controls`', async () => {
      select = fixtureSync(`
        <vaadin-select label="Label">
          <vaadin-select-list-box slot="overlay" id="custom-id">
            <vaadin-select-item value="foo">Foo</vaadin-select-item>
          </vaadin-select-list-box>
        </vaadin-select>
      `);
      await nextRender();
      select.opened = true;
      await nextUpdate(select);
      expect(select.focusElement.getAttribute('aria-controls')).to.equal('custom-id');
    });
  });
});
