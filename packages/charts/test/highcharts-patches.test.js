import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
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
});
