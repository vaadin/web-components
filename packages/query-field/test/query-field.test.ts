import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-query-field.js';
import type { QueryField } from '../src/vaadin-query-field.js';

window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.queryFieldComponent = true;

const FILTERS = [
  {
    name: 'label',
    label: 'Record label',
    options: ['Warp Records', 'Ninja Tune', { value: 'xl', label: 'XL Recordings' }],
  },
  { name: 'artist', label: 'Artist', options: ['Aphex Twin'], allowCustomValue: true },
  { name: 'year', label: 'Release year', type: 'number' as const },
];

describe('vaadin-query-field', () => {
  let field: QueryField;
  let input: HTMLInputElement;

  beforeEach(async () => {
    field = fixtureSync('<vaadin-query-field></vaadin-query-field>');
    field.filters = FILTERS;
    await nextRender();
    input = field.inputElement as HTMLInputElement;
  });

  function getOverlay() {
    return field.shadowRoot!.querySelector('vaadin-query-field-overlay')!;
  }

  function getItems() {
    return [...field.querySelectorAll<HTMLElement>('[slot="overlay"] vaadin-item')];
  }

  function getToken(index = 0) {
    return field.shadowRoot!.querySelectorAll<HTMLElement>('[part~="token"]')[index];
  }

  async function type(text: string) {
    await sendKeys({ type: text });
    await nextUpdate(field);
  }

  async function press(key: string) {
    await sendKeys({ press: key });
    await nextUpdate(field);
  }

  describe('query', () => {
    it('should have an empty query by default', () => {
      expect(field.query).to.eql({ text: '', filters: [] });
    });

    it('should parse free text and valid filters from the value', async () => {
      field.value = 'foo label:"Warp Records" year:2001 bar';
      await nextUpdate(field);
      expect(field.query).to.eql({
        text: 'foo bar',
        filters: [
          { name: 'label', value: 'Warp Records' },
          { name: 'year', value: '2001' },
        ],
      });
    });

    it('should use the canonical option value', async () => {
      field.value = 'label:XL';
      await nextUpdate(field);
      expect(field.query.filters).to.eql([{ name: 'label', value: 'xl' }]);
    });

    it('should accept custom values when allowed', async () => {
      field.value = 'artist:Autechre';
      await nextUpdate(field);
      expect(field.query.filters).to.eql([{ name: 'artist', value: 'Autechre' }]);
    });

    ['label:Unknown', 'year:twenty', 'colour:red', 'label:"Warp', 'year:'].forEach((value) => {
      it(`should not include invalid filter ${value}`, async () => {
        field.value = value;
        await nextUpdate(field);
        expect(field.query.filters).to.eql([]);
      });
    });

    it('should fire query-changed when the user types', async () => {
      const spy = sinon.spy();
      field.addEventListener('query-changed', spy);
      input.focus();
      await type('foo');
      expect(spy.called).to.be.true;
      expect(spy.lastCall.args[0].detail.value).to.eql({ text: 'foo', filters: [] });
    });
  });

  describe('validation', () => {
    it('should be invalid when a filter is invalid', async () => {
      field.value = 'year:twenty';
      await nextUpdate(field);
      expect(field.validate()).to.be.false;
    });

    it('should be valid when all filters are valid', async () => {
      field.value = 'year:2001 label:"ninja tune" foo';
      await nextUpdate(field);
      expect(field.validate()).to.be.true;
    });

    it('should become valid once an invalid filter is fixed', async () => {
      field.value = 'year:twenty';
      await nextUpdate(field);
      field.validate();
      field.value = 'year:2020';
      await nextUpdate(field);
      expect(field.invalid).to.be.false;
    });
  });

  describe('highlighting', () => {
    it('should mark invalid tokens when the caret is outside of them', async () => {
      field.value = 'colour:red foo';
      await nextUpdate(field);
      expect(getToken().part.contains('invalid-token')).to.be.true;
    });

    it('should not mark the invalid token containing the caret', async () => {
      input.focus();
      await type('colour:red');
      expect(getToken().part.contains('invalid-token')).to.be.false;
    });

    it('should mark the invalid token once the caret leaves it', async () => {
      input.focus();
      await type('colour:red foo');
      expect(getToken().part.contains('invalid-token')).to.be.true;
    });

    it('should add a part with the filter name to known filters', async () => {
      field.value = 'year:2001';
      await nextUpdate(field);
      expect(getToken().part.contains('filter-year')).to.be.true;
    });
  });

  describe('suggestions', () => {
    beforeEach(() => {
      input.focus();
    });

    it('should not open the overlay when the value is set programmatically', async () => {
      field.value = 'l';
      await nextUpdate(field);
      expect(getOverlay().opened).to.be.false;
    });

    describe('filter names', () => {
      beforeEach(async () => {
        await type('l');
      });

      it('should suggest filters matching the typed word', () => {
        expect(getOverlay().opened).to.be.true;
        expect(getItems().map((item) => item.textContent!.trim())).to.eql([
          'label: Record label',
          'year: Release year',
        ]);
      });

      it('should insert the filter name on Tab', async () => {
        await press('Tab');
        expect(field.value).to.equal('label:');
      });

      it('should keep focus in the input on Tab', async () => {
        await press('Tab');
        expect(document.activeElement).to.equal(input);
      });

      it('should insert the focused filter name on Enter', async () => {
        await press('ArrowDown');
        await press('ArrowDown');
        await press('Enter');
        expect(field.value).to.equal('year:');
      });

      it('should focus the last suggestion on ArrowUp', async () => {
        await press('ArrowUp');
        await press('Enter');
        expect(field.value).to.equal('year:');
      });

      it('should not pick a suggestion on Enter when none is focused', async () => {
        await press('Enter');
        expect(field.value).to.equal('l');
      });

      it('should insert the filter name on item click', async () => {
        getItems()[1].click();
        await nextUpdate(field);
        expect(field.value).to.equal('year:');
      });

      it('should close the overlay on Escape', async () => {
        await press('Escape');
        expect(getOverlay().opened).to.be.false;
      });

      it('should clear the value on second Escape with clear button visible', async () => {
        field.clearButtonVisible = true;
        await press('Escape');
        await press('Escape');
        expect(field.value).to.equal('');
      });

      it('should close the overlay when no filter matches', async () => {
        await type('x');
        expect(getOverlay().opened).to.be.false;
      });

      it('should close the overlay on blur', async () => {
        input.blur();
        await nextUpdate(field);
        expect(getOverlay().opened).to.be.false;
      });
    });

    describe('filter values', () => {
      beforeEach(async () => {
        await type('label:');
      });

      it('should suggest all options of the filter', () => {
        expect(getItems().map((item) => item.textContent!.trim())).to.eql([
          'Warp Records',
          'Ninja Tune',
          'XL Recordings xl',
        ]);
      });

      it('should filter options by the typed value', async () => {
        await type('"w');
        expect(getItems().map((item) => item.textContent!.trim())).to.eql(['Warp Records']);
      });

      it('should replace the whole token with the quoted value', async () => {
        await type('"w');
        await press('Tab');
        expect(field.value).to.equal('label:"Warp Records" ');
      });

      it('should move the caret after the inserted value', async () => {
        await type('"w');
        await press('Tab');
        expect(input.selectionStart).to.equal(field.value.length);
      });

      it('should close the overlay after picking a value', async () => {
        await press('Tab');
        expect(getOverlay().opened).to.be.false;
      });

      it('should continue with value suggestions after picking a filter name', async () => {
        field.value = '';
        await nextUpdate(field);
        await type('ye');
        await press('Tab');
        await type('2');
        expect(field.value).to.equal('year:2');
      });

      it('should not add whitespace when editing a token followed by whitespace', async () => {
        await type(' foo');
        input.setSelectionRange(6, 6);
        await press('ArrowDown');
        await press('Enter');
        expect(field.value).to.equal('label:"Warp Records" foo');
      });

      it('should allow undoing the picked value', async () => {
        await press('Tab');
        await press('ControlOrMeta+z');
        expect(field.value).to.equal('label:');
      });
    });

    describe('all filters', () => {
      it('should show all filters on ArrowDown in an empty field', async () => {
        await press('ArrowDown');
        expect(getItems().length).to.equal(FILTERS.length);
      });

      it('should not open the overlay when readonly', async () => {
        field.readonly = true;
        await nextUpdate(field);
        await press('ArrowDown');
        expect(getOverlay().opened).to.be.false;
      });
    });

    describe('aria', () => {
      it('should set combobox role on the input', () => {
        expect(input.getAttribute('role')).to.equal('combobox');
      });

      it('should set aria-expanded when suggestions are shown', async () => {
        await type('l');
        expect(input.getAttribute('aria-expanded')).to.equal('true');
      });

      it('should reference the listbox with aria-controls', async () => {
        await type('l');
        const listBox = field.querySelector('[slot="overlay"]')!;
        expect(input.getAttribute('aria-controls')).to.equal(listBox.id);
      });

      it('should reference the focused suggestion with aria-activedescendant', async () => {
        await type('l');
        await press('ArrowDown');
        expect(input.getAttribute('aria-activedescendant')).to.equal(getItems()[0].id);
      });
    });
  });
});
