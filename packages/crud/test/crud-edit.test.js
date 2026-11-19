import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-crud-edit.js';

describe('crud edit', () => {
  let edit;

  it('should set the default aria-label', () => {
    edit = fixtureSync('<vaadin-crud-edit></vaadin-crud-edit>');
    expect(edit.getAttribute('aria-label')).to.equal('Edit');
  });

  it('should not override an aria-label set before ready()', () => {
    edit = fixtureSync('<vaadin-crud-edit aria-label="Edit item"></vaadin-crud-edit>');
    expect(edit.getAttribute('aria-label')).to.equal('Edit item');
  });
});
