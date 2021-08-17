import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-chart.js';

describe('vaadin-chart', () => {
  describe('custom element definition', () => {
    let chart, tagName;

    beforeEach(() => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
      tagName = chart.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(chart.constructor.is).to.equal(tagName);
    });

    it('should have a valid version number', () => {
      expect(chart.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta|rc)\d+)?$/);
    });
  });

  describe('creating element', () => {
    let chart;

    beforeEach(async () => {
      chart = document.createElement('vaadin-chart');
    });

    afterEach(() => {
      document.body.removeChild(chart);
    });

    it('should create a chart with empty title', async () => {
      document.body.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      const title = chart.$.chart.querySelector('.highcharts-title');
      expect(title).to.be.ok;
      expect(title.textContent).to.be.empty;
    });

    it('should set a chart title with attribute', async () => {
      chart.setAttribute('title', 'Custom title');
      document.body.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      const title = chart.$.chart.querySelector('.highcharts-title > tspan');
      expect(title).to.be.ok;
      expect(title.textContent).to.equal('Custom title');
    });

    it('should set a chart title using update', async () => {
      chart.updateConfiguration({ title: { text: 'Awesome chart' } });
      document.body.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      expect(chart.$.chart.querySelector('.highcharts-title > tspan').textContent).to.equal('Awesome chart');
    });

    it('should support adding chart series', async () => {
      const series = document.createElement('vaadin-chart-series');
      series.values = [10, 20, 30, 40, 50];
      chart.appendChild(series);
      document.body.appendChild(chart);
      await oneEvent(chart, 'chart-add-series');
      expect(Array.from(chart.$.chart.querySelectorAll('.highcharts-series'))).to.have.lengthOf(1);
    });
  });

  describe('configuration', () => {
    const DATA = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let chart, config;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
      config = chart.configuration;
    });

    it('should set chart title using configuration', () => {
      config.setTitle({ text: 'Custom title' });

      const title = chart.$.chart.querySelector('.highcharts-title > tspan');
      expect(title).to.be.ok;
      expect(title.textContent).to.equal('Custom title');
    });

    it('should create chart series using configuration', () => {
      config.addSeries({ type: 'column', data: DATA });

      const series = chart.$.chart.querySelectorAll('.highcharts-series');
      expect(series).to.have.lengthOf(1);
      expect(series[0].classList.contains('highcharts-column-series')).to.be.true;
      expect(series[0].querySelectorAll('.highcharts-point')).to.have.lengthOf(DATA.length);
    });

    it('should set chart categories using configuration', () => {
      config.addSeries({ type: 'column', data: DATA });
      config.xAxis[0].setCategories(MONTHS);

      const categories = chart.$.chart.querySelectorAll('.highcharts-xaxis-labels > text');
      expect(categories.length).to.equal(MONTHS.length);
      expect(Array.from(categories).map((c) => c.textContent)).to.deep.equal(MONTHS);
    });
  });

  describe('update', () => {
    const DATA = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should set chart title using update', async () => {
      chart.updateConfiguration({ title: { text: 'Custom title' } });
      await oneEvent(chart, 'chart-redraw');
      const title = chart.$.chart.querySelector('.highcharts-title > tspan');
      expect(title).to.be.ok;
      expect(title.textContent).to.equal('Custom title');
    });

    it('should create chart series using update', async () => {
      chart.updateConfiguration({
        series: [
          {
            type: 'column',
            data: DATA
          }
        ]
      });
      await oneEvent(chart, 'chart-redraw');
      const series = chart.$.chart.querySelectorAll('.highcharts-series');
      expect(series).to.have.lengthOf(1);
      expect(series[0].classList.contains('highcharts-column-series')).to.be.true;
      expect(series[0].querySelectorAll('.highcharts-point')).to.have.lengthOf(DATA.length);
    });

    it('should set chart categories using update', async () => {
      chart.updateConfiguration({
        xAxis: {
          categories: MONTHS
        },
        series: [
          {
            type: 'column',
            data: DATA
          }
        ]
      });
      await oneEvent(chart, 'chart-redraw');
      const categories = chart.$.chart.querySelectorAll('.highcharts-xaxis-labels > text');
      expect(categories.length).to.equal(MONTHS.length);
      expect(Array.from(categories).map((c) => c.textContent)).to.deep.equal(MONTHS);
    });

    it('should clear chart title using reset flag', async () => {
      chart.updateConfiguration({ title: { text: 'Custom title' } });
      chart.updateConfiguration({}, true);
      await oneEvent(chart, 'chart-redraw');
      const title = chart.$.chart.querySelector('.highcharts-title');
      expect(title).to.be.ok;
      expect(title.textContent).to.be.empty;
    });

    it('should call updateConfiguration() when calling deprecated update()', () => {
      const stub = sinon.stub(chart, 'updateConfiguration');
      chart.update({}, true);
      stub.restore();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.be.an('object');
      expect(stub.args[0][1]).to.be.true;
    });

    it('should warn when calling deprecated update()', () => {
      const stub = sinon.stub(console, 'warn');
      chart.update({}, true);
      stub.restore();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.equal(
        'WARNING: Since Vaadin 21, update() is deprecated. Please use updateConfiguration() instead.'
      );
    });
  });

  describe('series', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[10, 20, 30, 40, 50]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should have one series defined using HTML', () => {
      const series = chart.configuration.series;
      expect(series.length).to.be.equal(1);

      const values = series[0].data.map(({ y }) => y);
      expect(values).to.deep.equal([10, 20, 30, 40, 50]);
    });

    it('should remove series when element is removed', async () => {
      const series = chart.$.chart.querySelectorAll('.highcharts-series');
      expect(series).to.have.lengthOf(1);
      chart.removeChild(chart.querySelector('vaadin-chart-series'));
      await aTimeout(20);
      expect(chart.$.chart.querySelectorAll('.highcharts-series').length).to.equal(0);
    });

    it('should apply options passed using update', async () => {
      chart.updateConfiguration({
        series: [
          {
            name: 'series-name'
          }
        ]
      });
      const series = chart.configuration.series[0];
      await oneEvent(chart, 'chart-redraw');
      expect(series.name).to.be.equal('series-name');
    });

    it('should preserve configuration on multiple update calls', async () => {
      chart.updateConfiguration({
        series: [
          {
            innerSize: 40
          }
        ]
      });
      chart.updateConfiguration({
        series: [
          {
            name: 'name of the series',
            type: 'area'
          }
        ]
      });
      await oneEvent(chart, 'chart-redraw');
      const series = chart.configuration.series;
      expect(series[0].options.innerSize).to.equal(40);
      expect(series[0].name).to.equal('name of the series');
      expect(series[0].type).to.equal('area');
    });

    it('should handle merging multiple series', async () => {
      chart.updateConfiguration({
        series: [{ name: 'series 1' }, { name: 'series 2' }]
      });
      chart.updateConfiguration({
        series: [null, { innerSize: 100 }]
      });
      await oneEvent(chart, 'chart-redraw');
      const series = chart.configuration.series;
      expect(series[0].name).to.equal('series 1');
      expect(series[1].name).to.equal('series 2');
      expect(series[1].options.innerSize).to.equal(100);
    });
  });

  describe('height', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart style="height: 200px"></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should propagate height to the chart container', () => {
      const rect = chart.$.chart.getBoundingClientRect();
      expect(rect.height).to.be.equal(200);
      expect(chart.configuration.chartHeight).to.be.equal(200);
    });

    it('should update container height on chart resize', async () => {
      chart.style.height = '300px';
      await oneEvent(chart, 'chart-redraw');
      const rect = chart.$.chart.getBoundingClientRect();
      expect(rect.height).to.be.equal(300);
      expect(chart.configuration.chartHeight).to.be.equal(300);
    });
  });

  describe('resize', () => {
    let layout, charts;

    beforeEach(async () => {
      layout = fixtureSync(`
        <div style="display: flex; width: 1000px;">
          <vaadin-chart>
            <vaadin-chart-series values="[1,7,3,1,5,6]"></vaadin-chart-series>
          </vaadin-chart>
          <vaadin-chart timeline>
            <vaadin-chart-series values="[1,7,3,1,5,6]"></vaadin-chart-series>
          </vaadin-chart>
        </div>
      `);
      charts = layout.querySelectorAll('vaadin-chart');
      await oneEvent(charts[0], 'chart-load');
    });

    it('should update chart size on window resize', async () => {
      expect(layout.getBoundingClientRect().width).to.be.equal(1000);
      expect(charts[0].configuration.chartWidth).to.be.equal(500);
      expect(charts[1].configuration.chartWidth).to.be.equal(500);

      layout.style.width = '500px';
      window.dispatchEvent(new Event('resize'));

      await aTimeout(100);
      expect(layout.getBoundingClientRect().width).to.be.equal(500);
      expect(charts[0].configuration.chartWidth).to.be.equal(250);
      expect(charts[1].configuration.chartWidth).to.be.equal(250);
    });
  });

  describe('reattach', () => {
    let wrapper, inner, chart;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-chart>
            <vaadin-chart-series value="[0,1,2]"></vaadin-chart-series>
            <vaadin-chart-series value="[3,2,1]"></vaadin-chart-series>
          </vaadin-chart>
          <div id="inner"></div>
        </div>
      `);
      chart = wrapper.querySelector('vaadin-chart');
      inner = wrapper.querySelector('#inner');
      await oneEvent(chart, 'chart-load');
    });

    it('should keep chart configuration when attached to a new parent', async () => {
      expect(chart.configuration.series.length).to.be.equal(chart.childElementCount);
      inner.appendChild(chart);
      await oneEvent(chart, 'chart-redraw');
      expect(chart.configuration.series.length).to.be.equal(chart.childElementCount);
    });

    it('should apply configuration update when attached to a new parent', async () => {
      chart.updateConfiguration({ title: { text: 'Awesome title' }, credits: { enabled: false } });
      await oneEvent(chart, 'chart-redraw');
      expect(chart.$.chart.querySelector('.highcharts-title > tspan').textContent).to.equal('Awesome title');
      expect(chart.$.chart.querySelector('.highcharts-credits')).to.be.null;

      wrapper.removeChild(chart);
      chart.updateConfiguration({ subtitle: { text: 'Awesome subtitle' }, credits: { enabled: true, text: 'Vaadin' } });

      inner.appendChild(chart);
      await oneEvent(chart, 'chart-redraw');
      expect(chart.$.chart.querySelector('.highcharts-title > tspan').textContent).to.equal('Awesome title');
      expect(chart.$.chart.querySelector('.highcharts-subtitle > tspan').textContent).to.equal('Awesome subtitle');
      expect(chart.$.chart.querySelector('.highcharts-credits').textContent).to.equal('Vaadin');
    });
  });

  describe('RTL', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[10, 20, 30, 40, 50]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('should not create horizontal scroll when dir is set to RTL', () => {
      const scrollWidth = document.documentElement.scrollWidth;
      document.dir = 'rtl';
      expect(scrollWidth).to.be.equal(document.documentElement.scrollWidth);
    });
  });

  describe('performance', () => {
    let chart, redrawSpy;

    beforeEach(async () => {
      chart = fixtureSync(`<vaadin-chart></vaadin-chart>`);
      await oneEvent(chart, 'chart-load');

      redrawSpy = sinon.spy(chart.configuration, 'redraw');
    });

    describe('adding a series', () => {
      it('should redraw the chart only once', async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2, 3, 4]"></vaadin-chart-series>`);

        chart.appendChild(series);
        await nextFrame();

        expect(redrawSpy.calledOnce).to.be.true;
      });
    });

    describe('replacing a series', () => {
      beforeEach(async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2]"></vaadin-chart-series>`);

        chart.appendChild(series);
        await nextFrame();

        redrawSpy.resetHistory();
      });

      it('should redraw the chart 3 times', async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2, 3, 4]"></vaadin-chart-series>`);

        chart.replaceChild(series, chart.firstElementChild);
        await nextFrame();

        expect(redrawSpy.callCount).to.equal(3);
      });
    });
  });
});
