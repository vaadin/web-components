import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

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

  // Highcharts reports a link that fails its allow list as an invalid attribute and leaves it out
  describe('credits', () => {
    let invalidAttributes, removeListener;

    beforeEach(() => {
      invalidAttributes = [];
      removeListener = Highcharts.addEvent(Highcharts, 'displayError', (e) => {
        if (e.code === 33) {
          invalidAttributes.push(e.params['Invalid attribute in config']);
        }
      });
    });

    afterEach(() => {
      removeListener();
    });

    async function setCreditsHref(href) {
      chart.updateConfiguration({ credits: { enabled: true, href } });
      await oneEvent(chart, 'chart-redraw');
    }

    ['https://vaadin.com', '/about', './about', '#about', 'mailto:info@vaadin.com'].forEach((href) => {
      it(`should keep supported credits links: ${href}`, async () => {
        await setCreditsHref(href);
        expect(chartContainer.querySelector('.highcharts-credits')).to.be.ok;
        expect(invalidAttributes).to.be.empty;
      });
    });

    [
      UNSUPPORTED_URL,
      ` JAVASCRIPT:void(0)`,
      `java\tscript:void(0)`,
      'data:text/html,Text',
      'vbscript:Text',
      'about.html',
      'tel:+123',
    ].forEach((href) => {
      it(`should ignore unsupported credits links: ${JSON.stringify(href)}`, async () => {
        await setCreditsHref(href);
        expect(chartContainer.querySelector('.highcharts-credits')).to.be.ok;
        expect(invalidAttributes).to.include('href');
      });
    });

    it('should ignore unsupported credits links on update', async () => {
      chart.updateConfiguration({ credits: { enabled: true } });
      await oneEvent(chart, 'chart-redraw');
      chart.configuration.credits.update({ href: UNSUPPORTED_URL });
      expect(invalidAttributes).to.include('href');
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
