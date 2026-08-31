import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextResize, oneEvent } from '@vaadin/testing-helpers';
import './theme-styles.js';
import '../src/vaadin-chart.js';

describe('vaadin-chart styling', () => {
  describe('default theme', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series type="pie" title="Tokyo" values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      await nextResize(chart);
      chartContainer = chart.$.chart;
    });

    it('should not fill data label connectors', () => {
      const connectors = Array.from(chartContainer.querySelectorAll('.highcharts-data-label-connector'));
      expect(connectors).to.have.lengthOf(5);
      connectors.forEach((connector) => expect(getComputedStyle(connector).fill).to.equal('none'));
    });

    it('should hide charts by adding hidden attribute', () => {
      const visibleRect = chartContainer.getBoundingClientRect();
      expect(visibleRect.width).to.be.above(0);
      expect(visibleRect.height).to.be.above(0);

      chart.hidden = true;
      const hiddenRect = chartContainer.getBoundingClientRect();
      expect(hiddenRect.width).to.be.equal(0);
      expect(hiddenRect.height).to.be.equal(0);
    });
  });

  describe('custom theme', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart theme="custom"></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should set series stroke applied with custom styles', () => {
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chart.configuration.xAxis[0].setCategories(MONTHS);
      chart.configuration.addSeries({
        type: 'column',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      });
      const point = chart.$.chart.querySelectorAll('.highcharts-series > .highcharts-point');
      expect(point).to.have.lengthOf(12);
      expect(getComputedStyle(point[0]).stroke).to.equal('rgb(255, 0, 0)');
    });
  });

  describe('CSS custom properties', () => {
    let chart, configuration;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
      chart.style.setProperty('--vaadin-charts-color-0', 'rgb(0, 255, 0)');
      await oneEvent(chart, 'chart-load');
      configuration = chart.configuration;
    });

    it('should set axis color based on CSS custom property', () => {
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      configuration.xAxis[0].setCategories(MONTHS);

      // As the first series, this should pick the --vaadin-charts-color-0 css configuration
      configuration.addSeries({
        type: 'column',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      });

      const rects = chart.$.chart.querySelectorAll('.highcharts-legend-item > rect');
      expect(rects).to.have.lengthOf(1);
      expect(getComputedStyle(rects[0]).fill).to.equal('rgb(0, 255, 0)');
    });
  });

  describe('solid gauge', () => {
    let chart;

    function points() {
      return [...chart.$.chart.querySelectorAll('.highcharts-solidgauge-series .highcharts-point')];
    }

    async function createChart(yAxis) {
      chart = fixtureSync('<vaadin-chart type="solidgauge"></vaadin-chart>');
      chart.additionalOptions = { yAxis: { min: 0, max: 100, ...yAxis } };
      await oneEvent(chart, 'chart-load');
      chart.configuration.addSeries({
        data: [
          { y: 20, colorIndex: 1 },
          { y: 50, colorIndex: 3 },
        ],
      });
    }

    it('should keep color classes on points when no stops are defined', async () => {
      await createChart();
      expect(points().map((point) => point.getAttribute('class'))).to.eql([
        'highcharts-point highcharts-color-1',
        'highcharts-point highcharts-color-3',
      ]);
    });

    it('should update color classes on points when colorIndex changes', async () => {
      await createChart();
      chart.configuration.series[0].points[0].update({ colorIndex: 5 });
      expect(points()[0].getAttribute('class')).to.equal('highcharts-point highcharts-color-5');
    });

    it('should remove color classes from points when stops are defined', async () => {
      await createChart({
        stops: [
          [0, '#ff0000'],
          [1, '#0000ff'],
        ],
      });
      points().forEach((point) => {
        expect(point.getAttribute('class')).to.equal('highcharts-point');
        expect(point.getAttribute('fill')).to.not.equal('none');
      });
    });

    it('should remove color classes from points when minColor and maxColor are defined', async () => {
      await createChart({ minColor: '#ff0000', maxColor: '#0000ff' });
      points().forEach((point) => {
        expect(point.getAttribute('class')).to.equal('highcharts-point');
        expect(point.getAttribute('fill')).to.not.equal('none');
      });
    });
  });
});
