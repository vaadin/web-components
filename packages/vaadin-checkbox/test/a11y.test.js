import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-checkbox.js';

describe('a11y', () => {
  let checkbox;

  beforeEach(() => {
    checkbox = fixtureSync('<vaadin-checkbox>Vaadin <i>Checkbox</i></vaadin-checkbox>');
  });

  it('should set aria-checked to "false" when indeterminate is first set to false, then checked is set to false', () => {
    checkbox.checked = false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should set aria-checked to "false" when checked is first set to false, then indeterminate is set to false', () => {
    checkbox.checked = false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should set aria-checked to "true" when indeterminate is first set to false, then checked is set to true', () => {
    checkbox.checked = true;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should set aria-checked to "true" when checked is first set to true, then indeterminate is set to false', () => {
    checkbox.checked = true;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should set aria-checked to "mixed" when indeterminate is first set to true, then checked is set to false', () => {
    checkbox.indeterminate = true;
    checkbox.checked = false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('mixed');
  });

  it('should set aria-checked to "mixed" when checked is first set to false, then indeterminate is set to true', () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('mixed');
  });

  it('should set aria-checked to "mixed" when indeterminate is first set to true, then checked is set to true', () => {
    checkbox.indeterminate = true;
    checkbox.checked = true;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('mixed');
  });

  it('should set aria-checked to "mixed" when checked is first set to true, then indeterminate is set to true', () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('mixed');
  });

  it('should set aria-checked to "false" when checked is set to null', () => {
    checkbox.checked = null;
    expect(checkbox.getAttribute('aria-checked')).to.eql('false');
  });
});
