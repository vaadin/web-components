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

  describe('contrast colours with a transparent background', () => {
    const TRANSPARENT = 'rgba(0, 0, 0, 0)';
    let chart;

    // `beforeEach`, not `before`: `fixtureSync` removes the element after each test.
    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart type="treemap" timeline style="--vaadin-charts-background: transparent">
          <vaadin-chart-series values='[{ "name": "A", "value": 5 }, { "name": "B", "value": 3 }]'></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should leave the chart canvas transparent', () => {
      const background = chart.shadowRoot.querySelector('.highcharts-background');
      expect(getComputedStyle(background).fill).to.equal(TRANSPARENT);
    });

    it('should paint a visible border around treemap points', () => {
      const point = chart.shadowRoot.querySelector('.highcharts-treemap-series .highcharts-point');
      expect(getComputedStyle(point).stroke).to.not.equal(TRANSPARENT);
    });

    it('should paint a visible label on the pressed range selector button', () => {
      const button = chart.shadowRoot.querySelector('.highcharts-button-pressed');
      const label = button.querySelector('text');
      // The pressed button inverts, so its label reads against the box, not the page.
      expect(getComputedStyle(label).fill).to.not.equal(TRANSPARENT);
      expect(getComputedStyle(label).fill).to.not.equal(getComputedStyle(button).fill);
    });

    // No screenshot covers the navigator handle, loading overlay, export menu
    // or crosshair label, which the same defect reached.
    it('should paint a visible navigator handle', () => {
      const handle = chart.shadowRoot.querySelector('.highcharts-navigator-handle');
      expect(getComputedStyle(handle).fill).to.not.equal(TRANSPARENT);
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
});
