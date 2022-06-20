import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-select.js';

describe('accessibility', () => {
  let select, valueButton;

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select label="Label"></vaadin-select>`);
    select.items = [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ];
    valueButton = select._valueButton;
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
});
