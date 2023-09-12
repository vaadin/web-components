import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-icon.js';
import { unsafeSvgLiteral } from '../src/vaadin-icon-svg.js';
import { Iconset } from '../vaadin-iconset.js';

const ANGLE_DOWN = '<path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>';
const ANGLE_UP = '<path d="M3 12v-2l5-5 5 5v2l-5-5z"></path>';
const ANGLE_RIGHT = '<path d="M4 13h2l5-5-5-5h-2l5 5z"></path>';
const PLUS = '<path d="M3.5,7V0M0,3.5h7"></path>';
const MINUS = '<path d="M2 7h12v2h-12v-2z"></path>';

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

  describe('src property', () => {
    beforeEach(() => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      svgElement = icon.shadowRoot.querySelector('svg');
    });

    it('should render svg when path is provided', async () => {
      const svgSrc = `<svg>${ANGLE_DOWN}</svg>`;
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve(svgSrc) });

      icon.src = `data:image/svg+xml,${encodeURIComponent(svgSrc)}`;
      await nextRender();

      expectIcon(ANGLE_DOWN);

      icon.__fetch.restore();
    });

    it('should add icon attribute when src is defined', () => {
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve('<svg></svg>') });

      icon.src = 'icon.svg';

      expect(icon.hasAttribute('icon')).to.be.ok;

      icon.__fetch.restore();
    });

    it('should use cors mode on fecth', () => {
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve('<svg></svg>') });

      icon.src = `data:image/svg+xml,${encodeURIComponent('<svg></svg')}`;

      expect(icon.__fetch.firstCall.args[1]).to.be.deep.equal({ mode: 'cors' });

      icon.__fetch.restore();
    });

    it('should remove SVG content if src is set to null', async () => {
      const svgSrc = `<svg>${ANGLE_DOWN}</svg>`;
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve(svgSrc) });

      icon.src = `data:image/svg+xml,${encodeURIComponent(svgSrc)}`;
      await nextRender();

      icon.src = null;
      expectIcon('');

      icon.__fetch.restore();
    });

    it('should set viewBox attribute if one is returned from SVG', async () => {
      const svgSrc = `<svg viewBox="0 0 100 100">${ANGLE_DOWN}</svg>`;
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve(svgSrc) });

      icon.src = `data:image/svg+xml,${encodeURIComponent(svgSrc)}`;
      await nextRender();

      expect(svgElement.getAttribute('viewBox')).to.be.equal('0 0 100 100');

      icon.__fetch.restore();
    });

    it('should append value from symbol property to src', () => {
      icon.src = './icon.svg';
      icon.symbol = 'symbol-id';

      expect(svgElement.querySelector(`use[href="${icon.src}#${icon.symbol}"]`)).to.exist;
    });

    it('should use value from symbol when src path has a hash value', () => {
      icon.src = './icon.svg#id-0';
      icon.symbol = 'id-1';

      expect(svgElement.querySelector(`use[href="${icon.src.split('#')[0]}#${icon.symbol}"]`));
    });

    it('should render SVG content and <use> if src is given in data format with symbol prop defined', async () => {
      icon.src = `data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgc3R5bGU9InBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IDA7IGhlaWdodDogMDsgb3ZlcmZsb3c6IGhpZGRlbjsiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQo8ZGVmcz4NCjxzeW1ib2wgaWQ9Imljb24taG9tZSIgdmlld2JveD0iMCAwIDMyIDMyIj4NCjxwYXRoIGQ9Im0zMiAxOWwtNi02di05aC00djVsLTYtNi0xNiAxNnYxaDR2MTBoMTB2LTZoNHY2aDEwdi0xMGg0eiI+PC9wYXRoPg0KPC9zeW1ib2w+DQo8c3ltYm9sIGlkPSJpY29uLXVzZXIiIHZpZXdib3g9IjAgMCAzMiAzMiI+DQo8cGF0aCBkPSJtMTggMjIuMDgydi0xLjY0OWMyLjIwMy0xLjI0MSA0LTQuMzM3IDQtNy40MzIgMC00Ljk3MSAwLTktNi05cy02IDQuMDI5LTYgOWMwIDMuMDk2IDEuNzk3IDYuMTkxIDQgNy40MzJ2MS42NDljLTYuNzg0IDAuNTU1LTEyIDMuODg4LTEyIDcuOTE4aDI4YzAtNC4wMzAtNS4yMTYtNy4zNjQtMTItNy45MTh6Ij48L3BhdGg+DQo8L3N5bWJvbD4NCjxzeW1ib2wgaWQ9Imljb24tY29nIiB2aWV3Ym94PSIwIDAgMzIgMzIiPg0KPHBhdGggZD0ibTI5LjE4MSAxOS4wNzBjLTEuNjc5LTIuOTA4LTAuNjY5LTYuNjM0IDIuMjU1LTguMzI4bC0zLjE0NS01LjQ0N2MtMC44OTggMC41MjctMS45NDMgMC44MjktMy4wNTggMC44MjktMy4zNjEgMC02LjA4NS0yLjc0Mi02LjA4NS02LjEyNWgtNi4yODljMC4wMDggMS4wNDQtMC4yNTIgMi4xMDMtMC44MTEgMy4wNzAtMS42NzkgMi45MDgtNS40MTEgMy44OTctOC4zMzkgMi4yMTFsLTMuMTQ0IDUuNDQ3YzAuOTA1IDAuNTE1IDEuNjg5IDEuMjY4IDIuMjQ2IDIuMjM0IDEuNjc2IDIuOTAzIDAuNjcyIDYuNjIzLTIuMjQxIDguMzE5bDMuMTQ1IDUuNDQ3YzAuODk1LTAuNTIyIDEuOTM1LTAuODIgMy4wNDQtMC44MiAzLjM1IDAgNi4wNjcgMi43MjUgNi4wODQgNi4wOTJoNi4yODljLTAuMDAzLTEuMDM0IDAuMjU5LTIuMDgwIDAuODExLTMuMDM4IDEuNjc2LTIuOTAzIDUuMzk5LTMuODk0IDguMzI1LTIuMjE5bDMuMTQ1LTUuNDQ3Yy0wLjg5OS0wLjUxNS0xLjY3OC0xLjI2Ni0yLjIzMi0yLjIyNnptMTYgMjIuNDc5Yy0zLjU3OCAwLTYuNDc5LTIuOTAxLTYuNDc5LTYuNDc5czIuOTAxLTYuNDc5IDYuNDc5LTYuNDc5YzMuNTc4IDAgNi40NzkgMi45MDEgNi40NzkgNi40NzlzLTIuOTAxIDYuNDc5LTYuNDc5IDYuNDc5eiI+PC9wYXRoPg0KPC9zeW1ib2w+DQo8L2RlZnM+DQo8L3N2Zz4=`;
      icon.symbol = 'icon-cog';

      await nextRender();

      expect(svgElement.querySelectorAll('symbol')).to.have.lengthOf(3);
      expect(svgElement.querySelectorAll('#icon-cog')).to.exist;
      expect(svgElement.querySelector('use[href="#icon-cog"]')).to.exist;
    });

    it('should fail if SVG is not found', async () => {
      sinon.stub(console, 'error');
      sinon.stub(icon, '__fetch').resolves({ ok: false });

      icon.src = 'not-found.svg';
      await nextRender();

      expect(console.error.called).to.be.true;
      expect(console.error.firstCall.firstArg.message).to.contain('Error loading icon');
      expect(icon.svg).to.be.null;

      icon.__fetch.restore();
      console.error.restore();
    });

    it('shoud fail if data returned does not contain valid SVG', async () => {
      sinon.stub(console, 'error');
      const svgSrc = '<div>not valid SVG</div>';
      sinon.stub(icon, '__fetch').resolves({ ok: true, text: () => Promise.resolve(svgSrc) });

      icon.src = `data:image/svg+xml,${encodeURIComponent(svgSrc)}`;
      await nextRender();

      expect(console.error.called).to.be.true;
      expect(console.error.firstCall.firstArg.message).to.contain('SVG element not found');

      icon.__fetch.restore();
      console.error.restore();
    });

    it('should render <use> tag when path with id selector is given', () => {
      icon.src = 'icon.svg#symbol-id';
      // We expect a 404 error log from this test, but the test is simply to check
      // that the <use> element is added when the source provided has the file#id pattern
      expect(svgElement.querySelector(`use[href="${icon.src}"]`)).to.exist;
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

      it('should set icon when the value is set before attach', () => {
        icon.icon = 'vaadin:angle-up';
        document.body.appendChild(icon);
        svgElement = icon.shadowRoot.querySelector('svg');
        expectIcon(`<g>${ANGLE_UP}</g>`);
      });
    });
  });
});
