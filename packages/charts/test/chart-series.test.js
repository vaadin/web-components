import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-chart.js';

describe('vaadin-chart-series', () => {
  describe('properties', () => {
    let chart, series;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series
            values="[10, 20, 10, 30, 50]"
            neck-width="20%"
            neck-position="20%"
          ></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      series = chart.querySelector('vaadin-chart-series');
    });

    it('should set series values with attribute', () => {
      const changedValues = chart.configuration.series[0].data.map((data) => data.y);
      expect(changedValues).to.have.members([10, 20, 10, 30, 50]);
    });

    it('should update series on values change', () => {
      const VALUES = [10, 30, 50, 10, 20];
      series.values = VALUES;
      const changedValues = chart.configuration.series[0].data.map((data) => data.y);
      expect(changedValues).to.have.members(VALUES);
    });

    it('should set type on the chart series', () => {
      const TYPE = 'line';
      series.type = TYPE;
      expect(chart.configuration.series[0].type).to.be.equal(TYPE);
    });

    it('should set name on the chart series', () => {
      const TITLE = 'title';
      series.title = TITLE;
      expect(chart.configuration.series[0].name).to.be.equal(TITLE);
    });

    it('should set unit on the chart series', () => {
      const UNIT = 'unit';
      series.unit = UNIT;
      expect(chart.configuration.yAxis[0].options.id).to.be.equal(UNIT);
    });

    it('should set neck-width on the series with attribute', () => {
      expect(series._series.options.neckWidth).to.be.equal('20%');
    });

    it('should update neck-width when property is set', () => {
      const WIDTH = 100;
      series.neckWidth = WIDTH;
      expect(series._series.options.neckWidth).to.be.equal(WIDTH);
    });

    it('should set neck-height on the series with attribute', () => {
      expect(series._series.options.neckHeight).to.be.equal('20%');
    });

    it('should update neck-height when property is set', () => {
      const HEIGHT = 100;
      series.neckPosition = HEIGHT;
      expect(series._series.options.neckHeight).to.be.equal(HEIGHT);
    });
  });

  describe('markers', () => {
    function markersVisible(container) {
      return Array.from(container.querySelectorAll('.highcharts-markers')).every((g) => {
        return Boolean(g.firstChild && getComputedStyle(g.firstChild).opacity !== '0');
      });
    }

    describe('valid values', () => {
      let chart, chartContainer, series;

      beforeEach(async () => {
        chart = fixtureSync(`
          <vaadin-chart>
            <vaadin-chart-series type="line"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
        chartContainer = chart.$.chart;
        series = chart.querySelector('vaadin-chart-series');
      });

      it('should have markers by default for widespread data', async () => {
        series.values = [10, 20, 10, 30, 50];
        await nextRender();
        expect(markersVisible(chartContainer)).to.be.true;
      });

      it('should not have markers by default for dense data', async () => {
        series.values = new Array(400).fill(10);
        await nextRender();
        expect(markersVisible(chartContainer)).to.be.false;
      });

      it('should have markers when set to shown', async () => {
        series.markers = 'shown';
        series.values = new Array(400).fill(10);
        await nextRender();
        expect(markersVisible(chartContainer)).to.be.true;
      });

      it('should not have markers when set to hidden', async () => {
        series.markers = 'hidden';
        series.values = [10, 20, 10, 30, 50];
        await nextRender();
        expect(markersVisible(chartContainer)).to.be.false;
      });

      it('should not have markers when options are set', async () => {
        series.values = [10, 20, 10, 30, 50];
        await nextRender();
        chart.additionalOptions = { plotOptions: { series: { marker: { enabled: false } } } };
        await aTimeout(50);
        expect(markersVisible(chartContainer)).to.be.false;
      });
    });

    describe('invalid value', () => {
      let chart, series;

      beforeEach(async () => {
        sinon.stub(console, 'warn');

        chart = fixtureSync(`
          <vaadin-chart>
            <vaadin-chart-series markers="visible"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
        series = chart.querySelector('vaadin-chart-series');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn when invalid markers attribute is set', () => {
        expect(console.warn.calledOnce).to.be.true;
      });

      it('should set invalid markers attribute value to auto', () => {
        expect(series.markers).to.equal('auto');
      });
    });
  });

  describe('warning', () => {
    let chart, series;

    beforeEach(async () => {
      sinon.stub(console, 'warn');

      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      series = chart.querySelector('vaadin-chart-series');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when invalid markers is set', () => {
      series.markers = 'visible';
      expect(console.warn.calledOnce).to.be.true;
    });

    it('should warn when invalid value-min is set', () => {
      series.valueMin = NaN;
      expect(console.warn.calledOnce).to.be.true;
    });

    it('should warn when invalid value-max is set', () => {
      series.valueMax = NaN;
      expect(console.warn.calledOnce).to.be.true;
    });
  });

  describe('stack', () => {
    let chart, series;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart stacking="normal">
          <vaadin-chart-series title="First" values="[1, 2, 8, 10]" stack="0"></vaadin-chart-series>
          <vaadin-chart-series title="Second" values="[0, 0, 2, 10]" stack="0"></vaadin-chart-series>
          <vaadin-chart-series title="Third" values="[0, 1, 2, 10]" stack="1" ></vaadin-chart-series>
          <vaadin-chart-series title="4th" values="[1, 0, 1, 10]" stack="1" ></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      series = chart.configuration.series;
    });

    it('should set initial stack on the series', () => {
      expect(series[0].data[3].stackY).to.be.equal(20);
      expect(series[1].data[3].stackY).to.be.equal(10);
      expect(series[2].data[3].stackY).to.be.equal(20);
      expect(series[3].data[3].stackY).to.be.equal(10);
    });

    it('should update stack on the series', () => {
      chart.children[2].stack = '0';
      chart.children[3].stack = '0';
      expect(series[0].data[3].stackY).to.be.equal(40);
      expect(series[1].data[3].stackY).to.be.equal(30);
      expect(series[2].data[3].stackY).to.be.equal(20);
      expect(series[3].data[3].stackY).to.be.equal(10);
    });
  });

  describe('additionalOptions', () => {
    let chart, series;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series
            values="[10, 20, 30]"
            title="series-title"
            additional-options='{"name": "Awe", "type": "column"}'
          ></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      series = chart.querySelector('vaadin-chart-series');
    });

    it('should set series type using additional options', () => {
      expect(chart.configuration.series[0].type).to.be.equal('column');
    });

    it('should not overwrite top-level series properties', () => {
      expect(chart.configuration.series[0].name).to.be.equal('series-title');
    });

    it('should react to additionalOptions object change', () => {
      series.additionalOptions = { type: 'line' };
      expect(chart.configuration.series[0].type).to.be.equal('line');
    });

    it('should react to additionalOptions sub property change', () => {
      series.additionalOptions.type = 'line';
      series.additionalOptions = { ...series.additionalOptions };
      expect(chart.configuration.series[0].type).to.be.equal('line');
    });
  });

  describe('valueMin and valueMax', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series title="First" values="[1,2,8,4]" unit="first"></vaadin-chart-series>
          <vaadin-chart-series title="Second" values="[-4,0,2,16]" unit="second" value-max="40"></vaadin-chart-series>
          <vaadin-chart-series title="Third" values="[0,-1,2,-16]" unit="first" value-min="0"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should work with value-min set with attribute', () => {
      expect(chart.configuration.yAxis).to.have.length(2);
      expect(chart.configuration.yAxis[0].paddedTicks[0]).to.be.closeTo(0, 5);
    });

    it('should update series when changing valueMin property', () => {
      chart.children[2].valueMin = -20;
      expect(chart.configuration.yAxis[0].paddedTicks[0]).to.be.closeTo(-20, 5);
    });

    it('should work with value-max set with attribute', () => {
      expect(chart.configuration.yAxis[1].paddedTicks.slice(-1)[0]).to.be.closeTo(40, 5);
    });

    it('should update series when changing valueMax property', () => {
      chart.children[1].valueMax = 10;
      expect(chart.configuration.yAxis[1].paddedTicks.slice(-1)[0]).to.be.closeTo(10, 5);
    });
  });

  describe('unit', () => {
    let chart;

    const UNIT_1 = 'unit 1';
    const UNIT_2 = 'unit 2';

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[10, 20, 10, 30, 50]" unit="${UNIT_1}"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should accept different unit for different series', async () => {
      const newSeries = document.createElement('vaadin-chart-series');
      newSeries.setAttribute('values', '[20, 30, 40, 50]');
      newSeries.setAttribute('unit', UNIT_2);
      chart.appendChild(newSeries);
      await oneEvent(chart, 'chart-add-series');
      expect(chart.configuration.yAxis).to.have.length(2);
      expect(chart.configuration.yAxis[1].options.id).to.be.equal(UNIT_2);
    });

    it('should add series to first y axis if no unit is defined', async () => {
      const newSeries = document.createElement('vaadin-chart-series');
      newSeries.values = [20, 30, 40, 50, 60];
      chart.appendChild(newSeries);
      await oneEvent(chart, 'chart-add-series');
      expect(chart.configuration.yAxis).to.have.length(1);
      expect(chart.configuration.yAxis[0].options.id).to.be.equal(UNIT_1);
    });

    it('should add series to first y axis if unit is removed', async () => {
      const newSeries = document.createElement('vaadin-chart-series');
      newSeries.values = [20, 30, 40, 50, 60];
      newSeries.setAttribute('unit', UNIT_2);
      chart.appendChild(newSeries);
      await oneEvent(chart, 'chart-add-series');
      expect(chart.configuration.yAxis).to.have.length(2);
      newSeries.removeAttribute('unit');
      expect(chart.configuration.yAxis).to.have.length(1);
      expect(chart.configuration.yAxis[0].options.id).to.be.equal(UNIT_1);
    });
  });

  describe('multiple axis', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart additional-options='{"yAxis": [{"id": "additional-unit-1"}, {"id": "additional-unit-2"}]}'>
          <vaadin-chart-series values="[10, 20, 30]" title="series-title" unit="additional-unit-1"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should not remove user generated axis', () => {
      expect(chart.configuration.yAxis).to.have.length(2);
      expect(chart.configuration.yAxis[0].series).to.have.length(1);
      expect(chart.configuration.yAxis[1].series).to.have.length(0);
    });
  });

  describe('visibility toggling', () => {
    let chart, legend;

    const HIDDEN = 'highcharts-legend-item-hidden';

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[10, 20, 10, 30, 50]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-add-series');
      legend = chart.$.chart.querySelector('.highcharts-legend-item');
    });

    it('should toggle visibility on click by default', () => {
      legend.dispatchEvent(new MouseEvent('click'));
      expect(legend.classList.contains(HIDDEN)).to.be.true;

      legend.dispatchEvent(new MouseEvent('click'));
      expect(legend.classList.contains(HIDDEN)).to.be.false;
    });

    it('should not hide on click when toggling is disabled', () => {
      chart._visibilityTogglingDisabled = true;
      legend.dispatchEvent(new MouseEvent('click'));
      expect(legend.classList.contains(HIDDEN)).to.be.false;
    });

    it('should not show on click when toggling is disabled', () => {
      legend.dispatchEvent(new MouseEvent('click'));

      chart._visibilityTogglingDisabled = true;
      legend.dispatchEvent(new MouseEvent('click'));
      expect(legend.classList.contains(HIDDEN)).to.be.true;
    });
  });
});
