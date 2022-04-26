import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-chart.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { chartBaseTheme } from '../theme/vaadin-chart-base-theme.js';

registerStyles('vaadin-chart', [
  chartBaseTheme,
  css`
    :host([theme='custom']) .highcharts-column-series rect.highcharts-point {
      stroke: rgb(255, 0, 0);
    }
  `,
]);

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
      const rects = chart.$.chart.querySelectorAll('.highcharts-series > rect');
      expect(rects).to.have.lengthOf(12);
      expect(getComputedStyle(rects[0]).stroke).to.equal('rgb(255, 0, 0)');
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

      // As there's no --vaadin-charts-color-1 this should pick default styling
      configuration.addSeries({
        type: 'column',
        data: [19.9, 61.5, 96.4, 119.2, 134.0, 166.0, 125.6, 138.5, 206.4, 184.1, 85.6, 44.4],
      });

      const rects = chart.$.chart.querySelectorAll('.highcharts-legend-item > rect');
      expect(rects).to.have.lengthOf(2);
      expect(getComputedStyle(rects[0]).fill).to.equal('rgb(0, 255, 0)');
      expect(getComputedStyle(rects[1]).fill).to.equal('rgb(22, 118, 243)');
    });
  });
});
