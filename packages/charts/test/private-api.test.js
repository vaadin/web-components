import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-chart.js';

describe('vaadin-chart private API', () => {
  describe('__inflateFunctions', () => {
    let chart;

    beforeEach(() => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
    });

    it('should inflate whole function strings', () => {
      // eslint-disable-next-line camelcase
      const config = { tooltip: { _fn_formatter: 'function() {return "awesome chart"}' } };
      chart.__inflateFunctions(config);
      expect(config.tooltip.formatter).to.be.a('function');
      expect(config.tooltip).to.not.have.property('_fn_formatter');
    });

    it('should inflate function body strings', () => {
      // eslint-disable-next-line camelcase
      const config = { tooltip: { _fn_formatter: 'return "awesome chart"' } };
      chart.__inflateFunctions(config);
      expect(config.tooltip.formatter).to.be.a('function');
      expect(config.tooltip).to.not.have.property('_fn_formatter');
    });

    it('should inflate empty function strings', () => {
      // eslint-disable-next-line camelcase
      const config = { tooltip: { _fn_formatter: '' } };
      chart.__inflateFunctions(config);
      expect(config.tooltip.formatter).to.be.a('function');
      expect(config.tooltip).to.not.have.property('_fn_formatter');
    });
  });

  describe('__callChartFunction', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should be possible to modify a chart', () => {
      const series = chart.configuration.series;
      expect(series).to.have.lengthOf(1);
      chart.__callChartFunction('addSeries', { data: [30, 1, 3, 5, 2] });
      expect(series).to.have.lengthOf(2);
    });
  });

  describe('__callSeriesFunction', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should be possible to modify a series', () => {
      const data = chart.configuration.series[0].data;
      expect(data).to.have.lengthOf(5);
      chart.__callSeriesFunction('addPoint', 0, 30);
      expect(data).to.have.lengthOf(6);
      expect(data[5].y).to.equal(30);
    });
  });

  describe('__callAxisFunction', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should be possible to modify an axis', () => {
      const yAxis = chart.configuration.yAxis;
      expect(yAxis).to.have.lengthOf(1);
      expect(yAxis[0].min).not.to.equal(5);
      chart.__callAxisFunction('setExtremes', 1, 0, 5);
      expect(yAxis[0].min).to.equal(5);
    });
  });

  describe('__callPointFunction', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should be possible to modify a point', () => {
      const data = chart.configuration.series[0].data;
      expect(data[4].y).to.equal(5);
      chart.__callPointFunction('update', 0, 4, 1);
      expect(data[4].y).to.equal(1);
    });
  });

  describe('__callHighchartsFunction', () => {
    let chart, chartContainer;

    function getLabels() {
      return Array.from(chartContainer.querySelectorAll('.highcharts-xaxis-labels > text')).map(
        (node) => node.textContent,
      );
    }

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart additional-options='{ "xAxis": { "type": "datetime", "labels": { "format": "{value:%a}" } } }'>
          <vaadin-chart-series values="[5, 6, 4, 7, 6, 2, 1]" additional-options='{ "pointIntervalUnit": "day" }'>
          </vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chartContainer = chart.$.chart;
    });

    it('should be possible to modify all charts', () => {
      expect(getLabels()).to.be.deep.equal(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']);

      chart.constructor.__callHighchartsFunction('setOptions', true, {
        lang: {
          shortWeekdays: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
        },
      });
      expect(getLabels()).to.be.deep.equal(['to', 'pe', 'la', 'su', 'ma', 'ti', 'ke']);
    });
  });
});
