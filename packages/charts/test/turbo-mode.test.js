import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-chart.js';

describe('turbo-mode', () => {
  let chart;

  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  function addSeries(numDataItems) {
    const data = Array.from(Array(numDataItems).keys());
    const series = fixtureSync(`<vaadin-chart-series values="[${data.join(',')}]"></vaadin-chart-series>`);
    chart.appendChild(series);
  }

  function addSeriesWithJS(numDataItems) {
    const data = Array.from(Array(numDataItems).keys());
    chart.updateConfiguration({
      series: [
        {
          type: 'column',
          data,
        },
      ],
    });
  }

  describe('when initializing chart', () => {
    beforeEach(async () => {
      chart = document.createElement('vaadin-chart');
      chart.updateConfiguration({
        plotOptions: {
          series: {
            turboThreshold: 10,
          },
        },
      });
      await nextRender();
    });

    describe('add series', () => {
      it('should not log warning when no series exceeds the turbo threshold', async () => {
        addSeries(9);
        document.body.appendChild(chart);
        await nextRender();
        expect(console.warn.called).to.be.false;
      });
      it('should log warning when initializing with a series that exceeds the turbo threshold', async () => {
        addSeries(11);
        document.body.appendChild(chart);
        await nextRender();
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');
      });
    });

    describe('add series with JS', () => {
      it('should not log warning when no series exceeds the turbo threshold', async () => {
        addSeriesWithJS(9);
        document.body.appendChild(chart);
        await nextRender();
        expect(console.warn.called).to.be.false;
      });
      it('should log warning when initializing with a series that exceeds the turbo threshold', async () => {
        addSeriesWithJS(11);
        document.body.appendChild(chart);
        await nextRender();
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');
      });
    });
  });

  describe('with existing chart', () => {
    beforeEach(async () => {
      chart = fixtureSync(`<vaadin-chart></vaadin-chart>`);
      chart.updateConfiguration({
        plotOptions: {
          series: {
            turboThreshold: 10,
          },
        },
      });
      await nextRender();
    });

    describe('adding series', () => {
      it('should not log warning when no series exceeds the turbo threshold', async () => {
        addSeries(9);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.called).to.be.false;
      });

      it('should log warning when a series exceeds the turbo threshold', async () => {
        addSeries(11);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');
      });
    });

    describe('adding series with JS', () => {
      it('should not log warning when no series exceeds the turbo threshold', async () => {
        addSeriesWithJS(9);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.called).to.be.false;
      });

      it('should log warning when a series exceeds the turbo threshold', async () => {
        addSeriesWithJS(11);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');
      });
    });

    describe('adding points', () => {
      function addPoint(seriesIndex, data) {
        chart.configuration.series[seriesIndex].addPoint(data);
      }

      it('should not log warning when total number of items does not exceed the turbo threshold', async () => {
        addSeriesWithJS(4);
        await oneEvent(chart, 'chart-redraw');
        addPoint(0, 5);
        addPoint(0, 6);
        addPoint(0, 7);
        chart.configuration.redraw();
        expect(console.warn.called).to.be.false;
      });

      it('should log warning when total number of items exceeds the turbo threshold', async () => {
        addSeriesWithJS(10);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.called).to.be.false;

        addPoint(0, 11);
        chart.configuration.redraw();
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');
      });
    });

    describe('single log entry', () => {
      it('should only log the warning once', async () => {
        addSeriesWithJS(13);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.args[0][0]).to.include('<vaadin-chart> Turbo mode has been enabled for one or more series');

        console.warn.resetHistory();
        addSeriesWithJS(16);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.called).to.be.false;
      });
    });

    describe('production mode', () => {
      const originalDevelopmentMode = window.Vaadin.developmentMode;
      before(() => {
        window.Vaadin.developmentMode = false;
      });
      after(() => {
        window.Vaadin.developmentMode = originalDevelopmentMode;
      });

      it('should not log warning in production', async () => {
        addSeriesWithJS(13);
        await oneEvent(chart, 'chart-redraw');
        expect(console.warn.called).to.be.false;
      });
    });
  });
});
