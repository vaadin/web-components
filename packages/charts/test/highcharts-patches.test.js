import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

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
});
