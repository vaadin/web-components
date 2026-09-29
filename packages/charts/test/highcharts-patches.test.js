import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import { getHighchartsPolicy } from '../src/highcharts-policy.js';

// eslint-disable-next-line no-script-url
const UNSUPPORTED_URL = 'javascript:void(0)';

describe('vaadin-chart option values', () => {
  let chart, chartContainer;

  beforeEach(async () => {
    chart = fixtureSync(`
      <vaadin-chart>
        <vaadin-chart-series values="[10, 20, 30]"></vaadin-chart-series>
      </vaadin-chart>
    `);
    await oneEvent(chart, 'chart-load');
    chartContainer = chart.$.chart;
  });

  describe('point keys', () => {
    afterEach(() => {
      delete Object.prototype.custom;
    });

    it('should set nested point keys', () => {
      const series = chart.configuration.addSeries({ keys: ['y', 'custom.value'], data: [[1, 'a']] });
      expect(series.points[0].custom.value).to.equal('a');
    });

    it('should ignore reserved segments in point keys', () => {
      const series = chart.configuration.addSeries({
        keys: ['y', '__proto__.custom', 'constructor.prototype.custom'],
        data: [[1, 'a', 'b']],
      });
      expect({}.custom).to.be.undefined;
      expect(series.points[0].y).to.equal(1);
    });
  });

  describe('point options', () => {
    it('should ignore reserved option names in point objects', () => {
      const series = chart.configuration.series[0];
      series.setData(JSON.parse('[{ "y": 1, "__proto__": { "custom": "a" }, "constructor": { "custom": "b" } }]'));
      const point = series.points[0];
      expect(point).to.be.instanceOf(Highcharts.Point);
      expect(point.y).to.equal(1);
      expect(point.custom).to.be.undefined;
      expect(point.options).to.not.have.own.property('constructor');
    });
  });

  describe('credits', () => {
    async function setCreditsHref(href) {
      chart.updateConfiguration({ credits: { enabled: true, href } });
      await oneEvent(chart, 'chart-redraw');
    }

    [
      'https://vaadin.com',
      'HTTPS://VAADIN.COM',
      'about.html',
      '/about',
      '#about',
      'tel:+123',
      'ftp://vaadin.com',
    ].forEach((href) => {
      it(`should keep supported credits links: ${href}`, async () => {
        await setCreditsHref(href);
        expect(chart.configuration.options.credits.href).to.equal(href);
      });
    });

    [UNSUPPORTED_URL, ` JAVASCRIPT:void(0)`, `java\tscript:void(0)`, 'data:text/html,Text', 'vbscript:Text'].forEach(
      (href) => {
        it(`should ignore credits links that use an unsupported URL scheme: ${JSON.stringify(href)}`, async () => {
          await setCreditsHref(href);
          expect(chartContainer.querySelector('.highcharts-credits')).to.be.ok;
          expect(chart.configuration.options.credits.href).to.be.undefined;
        });
      },
    );

    it('should ignore credits links that use an unsupported URL scheme on update', async () => {
      chart.updateConfiguration({ credits: { enabled: true } });
      await oneEvent(chart, 'chart-redraw');
      chart.configuration.credits.update({ href: UNSUPPORTED_URL });
      expect(chart.configuration.options.credits.href).to.be.undefined;
    });
  });

  describe('style options', () => {
    it('should not apply event attribute names to SVG elements', () => {
      const rect = chart.configuration.renderer.rect(0, 0, 10, 10).attr({ onmouseover: 'void(0)', fill: 'red' }).add();
      expect(rect.element.hasAttribute('onmouseover')).to.be.false;
      expect(rect.element.getAttribute('fill')).to.equal('red');
    });

    it('should not apply event attribute names from breadcrumbs style options', async () => {
      chart.updateConfiguration(
        {
          chart: { styledMode: false },
          series: [
            {
              type: 'treemap',
              allowTraversingTree: true,
              breadcrumbs: { style: { onmouseover: 'void(0)' } },
              data: [
                { id: 'a', name: 'A' },
                { id: 'b', name: 'B', parent: 'a', value: 1 },
              ],
            },
          ],
        },
        true,
      );
      await nextRender();
      chart.configuration.series[0].setRootNode('a');
      const buttons = chartContainer.querySelectorAll('.highcharts-breadcrumbs-button');
      expect(buttons.length).to.be.above(0);
      buttons.forEach((button) => {
        expect(button.hasAttribute('onmouseover')).to.be.false;
      });
    });
  });

  describe('text markup', () => {
    afterEach(() => {
      delete window.chartMarkupSpy;
    });

    it('should parse markup', () => {
      const ast = new Highcharts.AST('<b style="color: red">Text</b>');
      expect(ast.nodes).to.have.lengthOf(1);
      expect(ast.nodes[0].tagName).to.equal('b');
      expect(ast.nodes[0].style).to.eql({ color: 'red' });
      expect(ast.nodes[0].children[0].textContent).to.equal('Text');
    });

    it('should lowercase tag names', () => {
      const ast = new Highcharts.AST('<svg><clipPath></clipPath></svg>');
      expect(ast.nodes[0].children[0].tagName).to.equal('clippath');
    });

    describe('parser failure', () => {
      beforeEach(() => {
        sinon.stub(DOMParser.prototype, 'parseFromString').throws(new Error('Unavailable'));
      });

      afterEach(() => {
        DOMParser.prototype.parseFromString.restore();
      });

      it('should parse markup when the default parser fails', () => {
        const ast = new Highcharts.AST('<b>Text</b>');
        expect(ast.nodes).to.have.lengthOf(1);
        expect(ast.nodes[0].tagName).to.equal('b');
        expect(ast.nodes[0].children[0].textContent).to.equal('Text');
      });

      it('should parse markup in an inert document when the default parser fails', async () => {
        window.chartMarkupSpy = sinon.spy();
        // eslint-disable-next-line no-new
        new Highcharts.AST('<img src="data:image/png;base64,0" onerror="window.chartMarkupSpy()">');
        await aTimeout(50);
        expect(window.chartMarkupSpy).to.be.not.called;
      });
    });
  });

  describe('link attributes', () => {
    function getTitleLink() {
      return chartContainer.querySelector('.highcharts-title a');
    }

    it('should keep supported xlink:href values', async () => {
      chart.updateConfiguration({ title: { text: '<a xlink:href="https://vaadin.com">Title</a>' } });
      await oneEvent(chart, 'chart-redraw');
      expect(getTitleLink().getAttribute('xlink:href')).to.equal('https://vaadin.com');
    });

    it('should drop unsupported xlink:href values', async () => {
      chart.updateConfiguration({ title: { text: `<a xlink:href="${UNSUPPORTED_URL}">Title</a>` } });
      await oneEvent(chart, 'chart-redraw');
      expect(getTitleLink().hasAttribute('xlink:href')).to.be.false;
    });

    it('should drop unsupported xlink:href values with HTML rendering', async () => {
      chart.updateConfiguration({ title: { useHTML: true, text: `<a xlink:href="${UNSUPPORTED_URL}">Title</a>` } });
      await oneEvent(chart, 'chart-redraw');
      expect(getTitleLink().hasAttribute('xlink:href')).to.be.false;
    });
  });
});

describe('vaadin-chart trusted types policy', () => {
  (window.trustedTypes ? describe : describe.skip)('native policy factory', () => {
    it('should keep the policy created by Highcharts', () => {
      expect(getHighchartsPolicy()).to.be.ok;
      expect(getHighchartsPolicy().name).to.equal('highcharts');
    });

    it('should restore the inherited createPolicy method', () => {
      expect(Object.hasOwn(window.trustedTypes, 'createPolicy')).to.be.false;
    });
  });

  describe('policy factory with own createPolicy method', () => {
    let descriptor, createPolicy;

    beforeEach(() => {
      descriptor = Object.getOwnPropertyDescriptor(window, 'trustedTypes');
      createPolicy = sinon.spy((name) => ({ name }));
      Object.defineProperty(window, 'trustedTypes', { value: { createPolicy }, configurable: true });
    });

    afterEach(() => {
      if (descriptor) {
        Object.defineProperty(window, 'trustedTypes', descriptor);
      } else {
        delete window.trustedTypes;
      }
    });

    it('should restore the own createPolicy method', async () => {
      // Load a separate instance of the module, so that it wraps the factory defined above
      const policyModule = await import('../src/highcharts-policy.js?own-factory');
      const factory = window.trustedTypes;
      factory.createPolicy('highcharts', {});
      policyModule.releasePolicyFactory();
      expect(factory.createPolicy).to.equal(createPolicy);
      expect(createPolicy).to.be.calledOnceWith('highcharts');
      expect(policyModule.getHighchartsPolicy()).to.eql({ name: 'highcharts' });
    });
  });
});
