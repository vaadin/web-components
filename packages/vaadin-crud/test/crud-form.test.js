import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { nextRender } from './helpers.js';
import '../src/vaadin-crud-form.js';

describe('crud form', () => {
  let crudForm;

  beforeEach(() => {
    crudForm = fixtureSync('<vaadin-crud-form style="width: 500px;"></vaadin-crud-form>');
  });

  it('should not expose class name globally', function () {
    expect(window.CrudFormElement).not.to.be.ok;
  });

  it('should have a version number', () => {
    expect(customElements.get('vaadin-crud-form').version).to.be.ok;
  });

  describe('without valid item', () => {
    it('should not have any field if item is not set', () => {
      expect(crudForm._fields).to.be.undefined;
    });

    it('should not have any field if item has no fields', () => {
      crudForm.item = {};
      expect(crudForm._fields).to.be.undefined;
    });

    it('should set fields only once', () => {
      crudForm.item = {};
      crudForm.item = { foo: 'bar' };
      crudForm.item = { foo: 'bar', lorem: 'ipsum' };
      expect(crudForm._fields.length).to.be.equal(1);
    });
  });

  describe('include and exclude', () => {
    it('should not add private fields', () => {
      crudForm.item = { a: 1, _b: 2, c: 3 };
      expect(crudForm._fields.length).to.be.equal(2);
    });

    it('should not add excluded fields', () => {
      crudForm.exclude = 'a, c';
      crudForm.item = { a: 1, _b: 2, c: 3 };
      expect(crudForm._fields.length).to.be.equal(1);
    });

    it('should add included fields when item is not provided', () => {
      crudForm.include = 'a.b, a.c.d, a.c.e, f';
      expect(crudForm._fields.length).to.be.equal(4);
    });

    it('should add included fields when item is provided ignoring exclude property', () => {
      crudForm.include = '_b';
      crudForm.item = { a: 1, _b: 2, c: 3 };
      expect(crudForm._fields.length).to.be.equal(1);
    });

    it('should ignore `exclude` parameter when `include` is set', () => {
      crudForm.exclude = 'a, _b, c';
      crudForm.include = 'c, a';
      crudForm.item = { a: 1, _b: 2, c: 3 };
      expect(crudForm.querySelectorAll('vaadin-text-field')[0].label).to.be.equal('C');
      expect(crudForm.querySelectorAll('vaadin-text-field')[1].label).to.be.equal('A');
    });
  });

  describe('with valid item', () => {
    const item = {
      _id: 1,
      name: {
        first: 'Grant',
        last: 'Andrews'
      },
      role: 'operator'
    };

    beforeEach(async () => {
      crudForm.item = item;
      await nextRender(crudForm);
    });

    it('should automatically generate fields when item is set', () => {
      expect(crudForm._fields.length).to.be.above(0);
    });

    it('should not generate fields for protected attributes', () => {
      expect(crudForm._fields.length).to.be.equal(3);
    });

    it('should append fields to form light dom', () => {
      expect(crudForm.querySelectorAll('vaadin-text-field').length).to.be.equal(3);
    });

    it('should generate valid labels', () => {
      expect(crudForm.querySelectorAll('vaadin-text-field')[0].label).to.be.equal('Name first');
      expect(crudForm.querySelectorAll('vaadin-text-field')[1].label).to.be.equal('Name last');
      expect(crudForm.querySelectorAll('vaadin-text-field')[2].label).to.be.equal('Role');
    });

    it('should set labels appropriately', () => {
      expect(crudForm.querySelectorAll('vaadin-text-field')[0].label).to.be.equal('Name first');
      expect(crudForm.querySelectorAll('vaadin-text-field')[1].label).to.be.equal('Name last');
      expect(crudForm.querySelectorAll('vaadin-text-field')[2].label).to.be.equal('Role');
    });

    it('should capitalize correctly', () => {
      expect(crudForm.__capitalize('-aa.bb cc-dd FF')).to.be.equal('Aa bb cc dd ff');
    });
  });
});
