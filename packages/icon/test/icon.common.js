import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { unsafeSvgLiteral } from '../src/vaadin-icon-svg.js';

const ANGLE_DOWN = '<path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>';
const ANGLE_UP = '<path d="M3 12v-2l5-5 5 5v2l-5-5z"></path>';
const ANGLE_RIGHT = '<path d="M4 13h2l5-5-5-5h-2l5 5z"></path>';
const PLUS = '<path d="M3.5,7V0M0,3.5h7"></path>';
const MINUS = '<path d="M2 7h12v2h-12v-2z"></path>';

const Iconset = customElements.get('vaadin-iconset');

describe('vaadin-icon', () => {
  let icon, svgElement;

  function expectIcon(content) {
    expect(
      svgElement
        .querySelector('#svg-group')
        .innerHTML.trim()
        .replace(/<!--[^>]*-->/gu, ''),
    ).to.equal(content);
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
    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      svgElement = icon.shadowRoot.querySelector('svg');
    });

    it('should set aria-hidden attribute on the svg', () => {
      // Semantic-dom-diff does not support SVG so we can't test this with snapshots.
      expect(svgElement.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('svg property', () => {
    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
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

  describe('src property', () => {
    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      svgElement = icon.shadowRoot.querySelector('svg');
      sinon.stub(icon, '__fetch');
    });

    afterEach(() => {
      sinon.restore();
    });

    function respondWith(text) {
      icon.__fetch.resolves({ ok: true, text: () => Promise.resolve(text) });
    }

    it('should render svg when path is provided', async () => {
      respondWith(`<svg>${ANGLE_DOWN}</svg>`);
      icon.src = 'angle-down.svg';
      await nextRender();
      expectIcon(ANGLE_DOWN);
    });

    it('should add icon attribute when src is defined', () => {
      respondWith('<svg></svg>');
      icon.src = 'icon-attribute.svg';
      expect(icon.hasAttribute('icon')).to.be.ok;
    });

    it('should use cors mode on fetch', () => {
      respondWith('<svg></svg>');
      icon.src = 'cors.svg';
      expect(icon.__fetch.firstCall.args[1]).to.be.deep.equal({ mode: 'cors' });
    });

    it('should remove SVG content if src is set to null', async () => {
      respondWith(`<svg>${ANGLE_DOWN}</svg>`);
      icon.src = 'remove.svg';
      await nextRender();

      icon.src = null;
      expectIcon('');
    });

    it('should set viewBox attribute if one is returned from SVG', async () => {
      respondWith(`<svg viewBox="0 0 100 100">${ANGLE_DOWN}</svg>`);
      icon.src = 'view-box.svg';
      await nextRender();
      expect(svgElement.getAttribute('viewBox')).to.be.equal('0 0 100 100');
    });

    it('should set fill and stroke attributes if they are defined source SVG', async () => {
      respondWith(
        `<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="bevel">${ANGLE_DOWN}</svg>`,
      );
      icon.src = 'fill-stroke.svg';
      await nextRender();

      expect(svgElement.getAttribute('fill')).to.be.equal('none');
      expect(svgElement.getAttribute('stroke')).to.be.equal('currentColor');
      expect(svgElement.getAttribute('stroke-width')).to.be.equal('2');
      expect(svgElement.getAttribute('stroke-linecap')).to.be.equal('round');
      expect(svgElement.getAttribute('stroke-linejoin')).to.be.equal('bevel');
    });

    it('should not set fill, stroke and stroke-color attributes if they are not defined in the source SVG', async () => {
      respondWith(`<svg>${ANGLE_DOWN}</svg>`);
      icon.src = 'no-fill-stroke.svg';
      await nextRender();

      expect(svgElement.hasAttribute('fill')).to.be.false;
      expect(svgElement.hasAttribute('stroke')).to.be.false;
      expect(svgElement.hasAttribute('stroke-width')).to.be.false;
      expect(svgElement.hasAttribute('stroke-linecap')).to.be.false;
      expect(svgElement.hasAttribute('stroke-linejoin')).to.be.false;
    });

    it('should append value from symbol property to src', async () => {
      respondWith('<svg></svg>');
      icon.src = './icon.svg';
      icon.symbol = 'symbol-id';
      await nextRender();

      expect(svgElement.querySelector('use[href="./icon.svg#symbol-id"]')).to.exist;
    });

    it('should use value from symbol when src path has a hash value', async () => {
      icon.src = './icon.svg#id-0';
      icon.symbol = 'id-1';
      await nextFrame();

      expect(svgElement.querySelector('use[href="./icon.svg#id-1"]')).to.exist;
    });

    it('should render SVG content and <use> if src is given in data format with symbol prop defined', async () => {
      const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <symbol id="icon-cog" viewBox="0 0 32 32">
              <path
                d="m29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zm16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"
              ></path>
            </symbol>
            <symbol id="icon-user" viewbox="0 0 32 32">
              <path d="m18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
            </symbol>
          </defs>
        </svg>`;
      respondWith(svgSprite);
      icon.src = `data:image/svg+xml;base64,${btoa(svgSprite)}`;
      icon.symbol = 'icon-cog';
      await nextRender();

      expect(svgElement.querySelectorAll('symbol')).to.have.lengthOf(2);
      expect(svgElement.querySelector('use[href="#icon-cog"]')).to.exist;
    });

    it('should fail if SVG is not found', async () => {
      sinon.stub(console, 'error');
      icon.__fetch.resolves({ ok: false });
      icon.src = 'not-found.svg';
      await nextRender();

      expect(console.error.called).to.be.true;
      expect(console.error.firstCall.firstArg.message).to.contain('Error loading icon');
      expect(icon.svg).to.be.null;
    });

    it('shoud fail if data returned does not contain valid SVG', async () => {
      sinon.stub(console, 'error');
      respondWith('<div>not valid SVG</div>');
      icon.src = 'invalid.svg';
      await nextRender();

      expect(console.error.called).to.be.true;
      expect(console.error.firstCall.firstArg.message).to.contain('SVG element not found');
    });

    it('should render <use> tag when path with id selector is given', async () => {
      icon.src = 'icon.svg#symbol-id';
      await nextFrame();

      expect(icon.__fetch.called).to.be.false;
      expect(svgElement.querySelector('use[href="icon.svg#symbol-id"]')).to.exist;
      expect(svgElement.querySelector('#use-group').getAttribute('visibility')).to.be.equal('visible');
    });

    it('should load data URL with uppercase scheme and hash', async () => {
      respondWith(`<svg>${ANGLE_DOWN}</svg>`);
      icon.src = `DATA:image/svg+xml,${encodeURIComponent(`<svg>${ANGLE_DOWN}</svg>`)}#id`;
      await nextRender();

      expect(icon.__fetch.called).to.be.true;
      expect(svgElement.querySelector('use').hasAttribute('href')).to.be.false;
      expectIcon(ANGLE_DOWN);
    });

    it('should remove the reference if src is set to null', async () => {
      icon.src = 'sprite-null.svg#first';
      await nextRender();

      icon.src = null;
      await nextRender();
      expect(svgElement.querySelector('use').hasAttribute('href')).to.be.false;
    });

    it('should set use group visibility to hidden when src is a standalone SVG', () => {
      respondWith('<svg></svg>');
      icon.src = 'standalone.svg';
      expect(svgElement.querySelector('#use-group').getAttribute('visibility')).to.be.equal('hidden');
    });

    it('should fetch the same src only once', async () => {
      respondWith('<svg></svg>');
      icon.src = 'fetch-once.svg';

      const icon2 = fixtureSync('<vaadin-icon></vaadin-icon>');
      sinon.stub(icon2, '__fetch');
      icon2.src = icon.src;
      await nextFrame();

      expect(icon2.__fetch.called).to.be.false;
    });

    describe('SVG content', () => {
      let svgGroup;

      async function loadSvg(content) {
        const svgSrc = `<svg>${content}</svg>`;
        respondWith(svgSrc);
        icon.src = `data:image/svg+xml,${encodeURIComponent(svgSrc)}`;
        await nextRender();
        svgGroup = svgElement.querySelector('#svg-group');
      }

      it('should only render supported SVG elements', async () => {
        await loadSvg(`
          <path d="M0 0h1"></path>
          <style>.st0 { fill: red; }</style>
          <image href="photo.png"></image>
          <foreignObject><span>Text</span></foreignObject>
          <desc><span>Text</span></desc>
          <a href="https://example.com"><rect width="1" height="1"></rect></a>
          <animate attributeName="href" to="#other"></animate>
        `);
        expect(svgGroup.querySelector('path')).to.exist;
        expect(svgGroup.querySelector('desc')).to.exist;
        expect(svgGroup.querySelector('style, image, foreignObject, span, a, rect, animate')).to.be.null;
      });

      it('should drop unsupported attributes', async () => {
        await loadSvg(`
          <path id="path" d="M0 0h1" fill="url(#gradient)" onclick="onIconClick()"></path>
          <use id="local" href="#path"></use>
          <use id="file" href="icons.svg#path"></use>
          <rect id="paint" fill="url(icons.svg#gradient)" style="mask-image: image-set('mask.png' 1x)"></rect>
        `);
        const path = svgGroup.querySelector('#path');
        expect(path.getAttribute('fill')).to.equal('url(#gradient)');
        expect(path.hasAttribute('onclick')).to.be.false;
        expect(svgGroup.querySelector('#local').getAttribute('href')).to.equal('#path');
        expect(svgGroup.querySelector('#file').hasAttribute('href')).to.be.false;
        expect(svgGroup.querySelector('#paint').hasAttribute('fill')).to.be.false;
        expect(svgGroup.querySelector('#paint').hasAttribute('style')).to.be.false;
      });

      it('should render the same parsed content in multiple icons', async () => {
        await loadSvg(ANGLE_DOWN);
        const icon2 = fixtureSync('<vaadin-icon></vaadin-icon>');
        icon2.src = icon.src;
        await nextRender();
        expectIcon(ANGLE_DOWN);
        expect(icon2.shadowRoot.querySelector('#svg-group path')).to.be.ok;
      });
    });
  });

  describe('size property', () => {
    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
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
              <g id="vaadin:angle-right" preserveAspectRatio="xMidYMin slice">${ANGLE_RIGHT}</g>
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

      it('should reflect the icon as an attribute', () => {
        icons.forEach((svgIcon) => {
          icon.icon = svgIcon.getAttribute('id');
          expect(icon.getAttribute('icon')).to.equal(icon.icon);
        });
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
        const child = svgElement.querySelector('#svg-group').firstElementChild;
        expect(child.getAttribute('fill')).to.equal('red');
      });

      it('should preserve the preserveAspectRatio attribute set on the icon', () => {
        icon.icon = 'vaadin:angle-right';
        expect(svgElement.getAttribute('preserveAspectRatio')).to.equal('xMidYMin slice');
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

      it('should set icon when the value is set before attach', async () => {
        icon.icon = 'vaadin:angle-up';
        document.body.appendChild(icon);
        await nextFrame();
        svgElement = icon.shadowRoot.querySelector('svg');
        expectIcon(`<g>${ANGLE_UP}</g>`);
      });
    });
  });
});
