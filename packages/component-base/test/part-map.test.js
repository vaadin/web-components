import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, render } from 'lit';
import { partMap } from '../src/directives/part-map.js';

describe('partMap', () => {
  let container;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('dynamic parts', () => {
    let element;

    function renderPart(partNameInfo) {
      render(html`<div part=${partMap(partNameInfo)}></div>`, container);
      return container.firstElementChild;
    }

    it('should add part names with truthy values', () => {
      element = renderPart({ foo: true, bar: 1, baz: 'yes' });
      expect([...element.part]).to.have.members(['foo', 'bar', 'baz']);
    });

    it('should not add part names with falsy values', () => {
      element = renderPart({ foo: false, bar: 0, baz: '', qux: null, quux: undefined });
      expect([...element.part]).to.be.empty;
    });

    it('should remove part names whose values become falsy', () => {
      element = renderPart({ foo: true, bar: true });
      renderPart({ foo: false, bar: true });
      expect([...element.part]).to.have.members(['bar']);
    });

    it('should remove part names omitted on re-render', () => {
      element = renderPart({ foo: true, bar: true });
      renderPart({ bar: true });
      expect([...element.part]).to.have.members(['bar']);
    });

    it('should add part names whose values become truthy', () => {
      element = renderPart({ foo: false });
      renderPart({ foo: true });
      expect([...element.part]).to.have.members(['foo']);
    });

    it('should keep part names added outside the directive', () => {
      element = renderPart({ foo: true });
      element.part.add('external');
      renderPart({ foo: false });
      expect([...element.part]).to.have.members(['external']);
    });
  });

  describe('static parts', () => {
    let element;

    function renderPart(partNameInfo) {
      render(html`<div part="static ${partMap(partNameInfo)}"></div>`, container);
      return container.firstElementChild;
    }

    it('should keep static part names on the first render', () => {
      element = renderPart({ foo: true });
      expect([...element.part]).to.have.members(['static', 'foo']);
    });

    it('should keep static part names on re-render', () => {
      element = renderPart({ foo: true });
      renderPart({ foo: false });
      expect([...element.part]).to.have.members(['static']);
    });

    it('should keep static part names with falsy values in the map', () => {
      element = renderPart({ static: true });
      renderPart({ static: false });
      expect([...element.part]).to.have.members(['static']);
    });
  });

  describe('errors', () => {
    it('should throw when used in an attribute other than part', () => {
      expect(() => {
        render(html`<div class=${partMap({ foo: true })}></div>`, container);
      }).to.throw(/can only be used in the `part` attribute/u);
    });

    it('should throw when combined with another binding in the attribute', () => {
      expect(() => {
        render(html`<div part="${partMap({ foo: true })} ${'bar'}"></div>`, container);
      }).to.throw(/must be the only binding/u);
    });
  });
});
