import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { html, render } from 'lit';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '../vaadin-select.js';

describe('accessibility', () => {
  let select, button;

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select label="Label"></vaadin-select>`);
    select.renderer = (root) => {
      if (root.firstElementChild) {
        return;
      }
      render(
        html`
          <vaadin-list-box>
            <vaadin-item>Option 1</vaadin-item>
            <vaadin-item>Option 2</vaadin-item>
          </vaadin-list-box>
        `,
        root
      );
    };
    await nextFrame();
    button = select._valueButton;
  });

  it('should have aria-required attribute set to true when required', () => {
    select.required = true;
    expect(button.getAttribute('aria-required')).to.be.equal('true');
  });

  it('should have aria-disabled attribute set to true when disabled', () => {
    select.disabled = true;
    expect(select.getAttribute('aria-disabled')).to.be.equal('true');
  });

  it('should have aria-haspopup="listbox" the toggle button', () => {
    expect(button.getAttribute('aria-haspopup')).to.be.equal('listbox');
  });

  it('should set aria-expanded attribute on the toggle button', () => {
    expect(button.getAttribute('aria-expanded')).to.be.equal('false');
    select.opened = true;
    expect(button.getAttribute('aria-expanded')).to.be.equal('true');
  });

  it('should have role listbox on menu element', () => {
    expect(select._menuElement.getAttribute('role')).to.equal('listbox');
  });

  it('should have role option on items', async () => {
    // Wait for items
    await nextFrame();
    expect(select._items[0].getAttribute('role')).to.equal('option');
    expect(select._items[1].getAttribute('role')).to.equal('option');
  });

  it('should have aria-labelledby on focus element', () => {
    expect(button.getAttribute('aria-labelledby')).to.not.be.empty;
  });

  it('should have aria-describedby on focus element when invalid', () => {
    select.errorMessage = 'invalid';
    select.invalid = true;
    expect(button.getAttribute('aria-describedby')).to.not.be.empty;
  });
});
