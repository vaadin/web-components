import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '../vaadin-chart.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'chart-series-dom-repeat',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-chart id="chart">
          <template is="dom-repeat" items="{{seriesData}}">
            <vaadin-chart-series values="{{item.data}}"></vaadin-chart-series>
          </template>
        </vaadin-chart>
      `;
    }

    static get properties() {
      return {
        seriesData: {
          type: Array,
          value: () => {
            return [
              { data: [10096761, 6990386, 9830199, 10373255, 7903685] },
              { data: [9545219, 9425618, 10835399, 8084422, 8541604] },
              { data: [8881128, 9330959, 9882444, 8594214, 9153243] },
            ];
          },
        },
      };
    }
  },
);

describe('vaadin-chart in dom-repeat', () => {
  let chart;
  let chartContainer;
  let element;

  beforeEach(async () => {
    element = fixtureSync('<chart-series-dom-repeat></chart-series-dom-repeat>');
    chart = element.$.chart;
    chartContainer = chart.$.chart;
    await oneEvent(chart, 'chart-load');
  });

  it('should have 3 series', () => {
    expect(chart.configuration.series.length).to.be.equal(3);
  });

  it('should have one line series with 5 points', () => {
    const series = chartContainer.querySelectorAll('.highcharts-series');
    expect(series).to.have.lengthOf(3);
    for (let index = 0; index < series.length; index++) {
      const currentSeries = series[index];
      expect(currentSeries.classList.contains('highcharts-line-series')).to.be.true;
      expect(chart.configuration.series[0].data).to.have.lengthOf(element.seriesData[index].data.length);
    }
  });

  it('should create new series on push in seriesData', async () => {
    element.push('seriesData', { data: [1, 2, 3, 4, 5] });
    await nextRender(chart);
    expect(chart.configuration.series.length).to.be.equal(4);
  });

  it('should update values using set in seriesData', () => {
    const newData = [6, 7, 8, 9, 10, 11, 12];
    element.set('seriesData.1', { data: newData });
    const values = chart.configuration.series[1].data.map((data) => data.y);
    expect(values).to.have.lengthOf(newData.length);
    expect(values).to.have.members(newData);
  });
});
