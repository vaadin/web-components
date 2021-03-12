import { expect } from '@esm-bundle/chai';
import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import { render } from 'lit-html';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '../vaadin-select.js';

describe('vaadin-select accessibility', () => {
  let select;

  beforeEach(async () => {
    select = await fixture(html`<vaadin-select label="Label"></vaadin-select>`);
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
  });

  it('should have aria-required attribute set to true when required', () => {
    select.setAttribute('required', '');
    expect(select.getAttribute('aria-required')).to.be.equal('true');
  });

  it('should have aria-disabled attribute set to true when disabled', () => {
    select.setAttribute('disabled', '');
    expect(select.getAttribute('aria-disabled')).to.be.equal('true');
  });

  it('should have aria-hidden attribute to the native input', () => {
    expect(select._nativeInput.getAttribute('aria-hidden')).to.be.equal('true');
  });

  it('should have role button on the toggle button', () => {
    expect(select._toggleElement.getAttribute('role')).to.be.equal('button');
  });

  it('should have aria-haspopup="listbox" the toggle button', () => {
    expect(select._toggleElement.getAttribute('aria-haspopup')).to.be.equal('listbox');
  });

  it('should have aria-label attribute on the toggle button', () => {
    expect(select._toggleElement.getAttribute('aria-label')).to.equal('Toggle');
  });

  it('should set aria-expanded attribute on the toggle button', () => {
    expect(select._toggleElement.getAttribute('aria-expanded')).to.be.equal('false');
    select.opened = true;
    expect(select._toggleElement.getAttribute('aria-expanded')).to.be.equal('true');
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
    expect(select._inputElement.focusElement.getAttribute('aria-labelledby')).to.not.be.empty;
  });

  it('should have aria-describedby on focus element when invalid', () => {
    select.errorMessage = 'invalid';
    select.invalid = true;
    expect(select._inputElement.focusElement.getAttribute('aria-describedby')).to.not.be.empty;
  });
});
