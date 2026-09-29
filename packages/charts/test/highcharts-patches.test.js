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
    it('should keep supported credits links', async () => {
      chart.updateConfiguration({ credits: { enabled: true, href: 'https://vaadin.com' } });
      await oneEvent(chart, 'chart-redraw');
      expect(chart.configuration.options.credits.href).to.equal('https://vaadin.com');
    });

    it('should ignore credits links that do not use a supported URL scheme', async () => {
      chart.updateConfiguration({ credits: { enabled: true, href: UNSUPPORTED_URL } });
      await oneEvent(chart, 'chart-redraw');
      expect(chartContainer.querySelector('.highcharts-credits')).to.be.ok;
      expect(chart.configuration.options.credits.href).to.be.undefined;
    });

    it('should ignore credits links that do not use a supported URL scheme on update', async () => {
      chart.updateConfiguration({ credits: { enabled: true } });
      await oneEvent(chart, 'chart-redraw');
      chart.configuration.credits.update({ href: UNSUPPORTED_URL });
      expect(chart.configuration.options.credits.href).to.be.undefined;
    });
  });
});
