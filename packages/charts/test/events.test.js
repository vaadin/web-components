import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-chart.js';

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
});
