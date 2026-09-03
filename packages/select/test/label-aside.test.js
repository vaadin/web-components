import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-select.js';

describe('label-aside', () => {
  let select, label, valueButton;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select theme="label-aside" label="Label"></vaadin-select>');
    select.items = [{ label: 'Option', value: 'option' }];
    await nextRender();
    label = select.querySelector('[slot="label"]');
    valueButton = select.querySelector('[slot="value"]');
  });

  it('should keep label position when value is set', async () => {
    const { top } = label.getBoundingClientRect();
    select.value = 'option';
    await nextUpdate(select);
    expect(valueButton.textContent.trim()).to.equal('Option');
    expect(label.getBoundingClientRect().top).to.equal(top);
  });
});
