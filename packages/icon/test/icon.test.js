import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-icon.js';
import { unsafeSvgLiteral } from '../src/vaadin-icon-svg.js';
import { Iconset } from '../vaadin-iconset.js';

const ANGLE_DOWN = '<path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>';
const ANGLE_UP = '<path d="M3 12v-2l5-5 5 5v2l-5-5z"></path>';
const PLUS = '<path d="M3.5,7V0M0,3.5h7"></path>';
const MINUS = '<path d="M2 7h12v2h-12v-2z"></path>';

describe('vaadin-icon', () => {
  let icon, svgElement;

  function expectIcon(content) {
    expect(svgElement.innerHTML.trim().replace(/<!--[^>]*-->/gu, '')).to.equal(content);
  }

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      tagName = icon.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('svg element', () => {
    beforeEach(() => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      svgElement = icon.shadowRoot.querySelector('svg');
    });

    it('should set aria-hidden attribute on the svg', () => {
      // Semantic-dom-diff does not support SVG so we can't test this with snapshots.
      expect(svgElement.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('svg property', () => {
    beforeEach(() => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      svgElement = icon.shadowRoot.querySelector('svg');
    });

    describe('valid icon', () => {
      it('should set icon defined with SVG literal', () => {
        icon.svg = unsafeSvgLiteral(ANGLE_DOWN);
        expectIcon(ANGLE_DOWN);
      });

      it('should update icon when svg property is updated', () => {
        icon.svg = unsafeSvgLiteral(ANGLE_DOWN);
        expectIcon(ANGLE_DOWN);
        icon.svg = unsafeSvgLiteral(ANGLE_UP);
        expectIcon(ANGLE_UP);
      });
    });

    describe('empty icon', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should log error when invalid svg value is set', () => {
        icon.svg = ANGLE_DOWN;
        expect(console.error.calledOnce).to.be.true;
      });

      it('should not render DOM when invalid svg value is set', () => {
        icon.svg = ANGLE_DOWN;
        expectIcon('');
      });

      it('should not log error when svg property is set to null', () => {
        icon.svg = null;
        expect(console.error.calledOnce).to.be.false;
      });

      it('should not render DOM when svg property is set to null', () => {
        icon.svg = null;
        expectIcon('');
      });
    });
  });

  describe('size property', () => {
    beforeEach(() => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      svgElement = icon.shadowRoot.querySelector('svg');
    });

    it('should set size property to 24 by default', () => {
      expect(icon.size).to.equal(24);
    });

    it('should set viewBox attribute based on size', () => {
      expect(svgElement.getAttribute('viewBox')).to.equal('0 0 24 24');
    });

    it('should update viewBox attribute on size change', () => {
      icon.size = 16;
      expect(svgElement.getAttribute('viewBox')).to.equal('0 0 16 16');
    });
  });

  describe('icon property', () => {
    let iconset, icons;

    beforeEach(async () => {
      iconset = fixtureSync(`
        <vaadin-iconset name="vaadin">
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <g id="vaadin:angle-down">${ANGLE_DOWN}</g>
              <g id="vaadin:angle-up">${ANGLE_UP}</g>
              <g id="vaadin:plus" viewBox="0 0 7 7">${PLUS}</g>
              <svg id="vaadin:minus" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="red">${MINUS}</svg>
            </defs>
          </svg>
        </vaadin-iconset>
      `);
      icons = Array.from(iconset.querySelectorAll('[id]'));
      await nextRender();
    });

    describe('default', () => {
      beforeEach(async () => {
        icon = fixtureSync('<vaadin-icon></vaadin-icon>');
        await nextRender();
        svgElement = icon.shadowRoot.querySelector('svg');
      });

      it('should render icon from the iconset', () => {
        icons.forEach((svgIcon) => {
          icon.icon = svgIcon.getAttribute('id');
          expectIcon(svgIcon.outerHTML.replace(/ id="[^\s]+"/u, ''));
        });
      });

      it('should clear icon when the value is set to null', () => {
        icon.icon = 'vaadin:angle-up';
        expectIcon(`<g>${ANGLE_UP}</g>`);
        icon.icon = null;
        expectIcon('');
      });

      it('should clear icon when the value is set to undefined', () => {
        icon.icon = 'vaadin:angle-up';
        expectIcon(`<g>${ANGLE_UP}</g>`);
        icon.icon = undefined;
        expectIcon('');
      });

      it('should inherit currentColor as fill color', () => {
        icon.style.color = 'rgb(0, 0, 255)';
        expect(getComputedStyle(icon).fill).to.equal('rgb(0, 0, 255)');
      });

      it('should override fill color', () => {
        icon.style.color = 'rgb(0, 0, 255)';
        icon.style.fill = 'rgb(0, 255, 0)';
        expect(getComputedStyle(icon).fill).to.equal('rgb(0, 255, 0)');
      });

      it('should support rendering custom svg element inside the icon', () => {
        icon.icon = 'vaadin:minus';
        const child = svgElement.firstElementChild;
        expect(child.getAttribute('fill')).to.equal('red');
      });

      it('should preserve the viewBox attribute set on the icon', () => {
        icon.icon = 'vaadin:plus';
        expect(svgElement.getAttribute('viewBox')).to.equal('0 0 7 7');
      });

      it('should apply the icon once the set is added to DOM', () => {
        icon.icon = 'foo:angle-up';

        fixtureSync(`
          <vaadin-iconset name="foo">
            <svg xmlns="http://www.w3.org/2000/svg">
              <defs>
                <g id="foo:angle-up">${ANGLE_UP}</g>
              </defs>
            </svg>
          </vaadin-iconset>
        `);

        expectIcon(`<g>${ANGLE_UP}</g>`);
      });

      it('should apply the icon once the set is registered', () => {
        icon.icon = 'bar:angle-up';

        const template = document.createElement('template');
        template.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <g id="bar:angle-up">${ANGLE_UP}</g>
            </defs>
          </svg>
        `;

        Iconset.register('bar', 16, template);

        expectIcon(`<g>${ANGLE_UP}</g>`);
      });
    });

    describe('set before attach', () => {
      beforeEach(() => {
        icon = document.createElement('vaadin-icon');
      });

      afterEach(() => {
        document.body.removeChild(icon);
      });

      it('should set icon when the value is set before attach', () => {
        icon.icon = 'vaadin:angle-up';
        document.body.appendChild(icon);
        svgElement = icon.shadowRoot.querySelector('svg');
        expectIcon(`<g>${ANGLE_UP}</g>`);
      });
    });
  });
});
