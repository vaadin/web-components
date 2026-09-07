import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { click, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart events', () => {
  let chart;

  describe('default', () => {
    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[10, 20]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should trigger chart-redraw event on redraw', () => {
      const spy = sinon.spy();
      chart.addEventListener('chart-redraw', spy);
      chart.configuration.redraw();
      expect(spy.calledOnce).to.be.true;
    });

    it('should trigger chart-redraw event on update', async () => {
      const spy = sinon.spy();
      chart.addEventListener('chart-redraw', spy);
      chart.updateConfiguration({
        chart: {
          type: 'column',
        },
      });
      await oneEvent(chart, 'chart-redraw');
      const event = spy.firstCall.args[0];
      expect(event.detail.chart).to.be.deep.equal(event.detail.originalEvent.target);
    });

    it('should trigger series-show event on series show', () => {
      const spy = sinon.spy();
      chart.addEventListener('series-show', spy);
      chart.configuration.series[0].show();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.detail.series).to.be.deep.equal(event.detail.originalEvent.target);
    });

    it('should trigger point-click event on point click', () => {
      const spy = sinon.spy();
      chart.addEventListener('point-click', spy);
      chart.configuration.series[0].points[0].firePointEvent('click');
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.detail.point).to.be.deep.equal(event.detail.originalEvent.target);
    });

    it('should trigger point-update event on point update', () => {
      const spy = sinon.spy();
      chart.addEventListener('point-update', spy);
      chart.configuration.series[0].points[0].update({ y: 20 });
      expect(spy.calledOnce).to.be.true;
    });
  });

  // `xAxisMin`/`xAxisMax`/`yAxisMin`/`yAxisMax` on `chart-selection` and
  // `xValue`/`yValue` on `chart-click` are public API, read by Flow through
  // `@EventData` in ChartSelectionEvent.java and ChartClickEvent.java.
  describe('axis detail fields', () => {
    let bounds;

    beforeEach(async () => {
      // Sized and zoomable so that a real drag produces a selection.
      chart = fixtureSync(`
        <vaadin-chart style="width: 600px; height: 400px"
          additional-options='{ "chart": { "zooming": { "type": "xy" } } }'>
          <vaadin-chart-series values="[10, 20, 30, 40, 50]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      const { left, top } = chart.getBoundingClientRect();
      bounds = (x, y) => [Math.round(left + x), Math.round(top + y)];
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should expose axis extremes on chart-selection', async () => {
      const spy = sinon.spy();
      chart.addEventListener('chart-selection', spy);

      await sendMouse({ type: 'move', position: bounds(150, 150) });
      await sendMouse({ type: 'down' });
      await sendMouse({ type: 'move', position: bounds(350, 300) });
      await sendMouse({ type: 'up' });

      expect(spy).to.be.calledOnce;
      const { xAxisMin, xAxisMax, yAxisMin, yAxisMax } = spy.firstCall.args[0].detail;
      expect(xAxisMin).to.be.within(0, 4);
      expect(xAxisMax).to.be.within(xAxisMin, 4);
      expect(yAxisMin).to.be.a('number');
      expect(yAxisMax).to.be.above(yAxisMin);
    });

    it('should expose axis values on chart-click', async () => {
      const spy = sinon.spy();
      chart.addEventListener('chart-click', spy);

      await sendMouse({ type: 'click', position: bounds(300, 200) });

      expect(spy).to.be.calledOnce;
      const { xValue, yValue } = spy.firstCall.args[0].detail;
      expect(xValue).to.be.within(0, 4);
      expect(yValue).to.be.a('number');
    });

    // A real interaction always carries both axes, so only a synthetic payload can
    // cover this branch. The keys must stay absent rather than be set to `undefined`.
    it('should omit the axis fields the event does not carry', () => {
      function detailOf(type, payload) {
        const spy = sinon.spy();
        chart.addEventListener(`chart-${type}`, spy);
        Highcharts.fireEvent(chart.configuration, type, payload);
        expect(spy).to.be.calledOnce;
        return spy.firstCall.args[0].detail;
      }

      expect(detailOf('selection', {})).to.not.have.any.keys('xAxisMin', 'xAxisMax', 'yAxisMin', 'yAxisMax');
      expect(detailOf('click', {})).to.not.have.any.keys('xValue', 'yValue');
      expect(detailOf('selection', { xAxis: [{ min: 0, max: 5 }] })).to.not.have.any.keys('yAxisMin', 'yAxisMax');
    });
  });

  describe('draggable', () => {
    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart type="line" additional-options='{"plotOptions": {"series": {"dragDrop": {"draggableX": true}}}}'>
             <vaadin-chart-series values="[10, 20]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should emit dragStart when point clicked', () => {
      const spy = sinon.spy();
      chart.addEventListener('point-drag-start', spy);
      chart.configuration.hoverPoint = chart.configuration.series[0].points[0];
      chart.$.chart.querySelector('.highcharts-container').dispatchEvent(new MouseEvent('mousedown'));
      expect(spy.calledOnce).to.be.true;
    });

    it('should resolve point object on dragStart', () => {
      const spy = sinon.spy();
      chart.addEventListener('point-drag-start', spy);
      chart.configuration.hoverPoint = chart.configuration.series[0].points[0];
      chart.$.chart.querySelector('.highcharts-container').dispatchEvent(new MouseEvent('mousedown'));
      const event = spy.firstCall.args[0];
      expect(event.detail.point).to.be.deep.equal(chart.configuration.series[0].points[0]);
    });
  });

  describe('timeline', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart timeline>
          <vaadin-chart-series type="candlestick" values="[10,20]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should trigger setExtremes event for xAxis', () => {
      const MIN = 10;
      const MAX = 20;

      const spy = sinon.spy();
      chart.addEventListener('xaxes-extremes-set', spy);
      chart.configuration.xAxis[0].setExtremes(MIN, MAX);

      const e = spy.firstCall.args[0];
      const { min, max } = e.detail.originalEvent;
      expect(min).to.be.equal(MIN);
      expect(max).to.be.equal(MAX);
    });

    it('should trigger setExtremes event for yAxis', () => {
      const MIN = 10;
      const MAX = 20;

      const spy = sinon.spy();
      chart.addEventListener('yaxes-extremes-set', spy);
      chart.configuration.yAxis[0].setExtremes(MIN, MAX);

      const e = spy.firstCall.args[0];
      const { min, max } = e.detail.originalEvent;
      expect(min).to.be.equal(MIN);
      expect(max).to.be.equal(MAX);
    });
  });

  describe('legend click', () => {
    beforeEach(async () => {
      chart = fixtureSync(`<vaadin-chart></vaadin-chart>`);
      await oneEvent(chart, 'chart-load');
    });

    it('should dispatch `series-legend-item-click` event', async () => {
      chart.updateConfiguration(
        {
          series: [
            {
              type: 'line',
              name: 'Series 0',
              data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
            },
          ],
          plotOptions: {
            series: {
              animation: false,
            },
          },
          legend: {
            enabled: true,
          },
        },
        true,
      );
      await oneEvent(chart, 'chart-load');

      const spy = sinon.spy();
      chart.addEventListener('series-legend-item-click', spy);
      const legendItem = chart.$.chart.querySelector('.highcharts-legend-item');
      click(legendItem);

      expect(spy.called).to.be.ok;
      const e = spy.firstCall.args[0];
      expect(e.detail.series).to.be.ok;
      expect(e.detail.point).to.not.be.ok;
    });

    it('should dispatch `point-legend-item-click` event', async () => {
      chart.updateConfiguration(
        {
          chart: {
            type: 'pie',
          },
          series: [
            {
              name: 'Points',
              data: [
                {
                  name: 'Point 0',
                  y: 60,
                },
                {
                  name: 'Point 1',
                  y: 40,
                },
              ],
            },
          ],
          plotOptions: {
            pie: {
              allowPointSelect: true,
              showInLegend: true,
            },
          },
        },
        true,
      );
      await oneEvent(chart, 'chart-load');

      const spy = sinon.spy();
      chart.addEventListener('point-legend-item-click', spy);
      const legendItem = chart.$.chart.querySelector('.highcharts-legend-item');
      click(legendItem);

      expect(spy.called).to.be.ok;
      const e = spy.firstCall.args[0];
      expect(e.detail.point).to.be.ok;
      expect(e.detail.series).to.not.be.ok;
    });
  });
});
