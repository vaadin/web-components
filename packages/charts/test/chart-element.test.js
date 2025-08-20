import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-chart.js';

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
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('creating element', () => {
    let chart;

    beforeEach(() => {
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
      const title = chart.$.chart.querySelector('.highcharts-title');
      expect(title).to.be.ok;
      expect(title.textContent).to.equal('Custom title');
    });

    it('should set a chart title using update', async () => {
      chart.updateConfiguration({ title: { text: 'Awesome chart' } });
      document.body.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      expect(chart.$.chart.querySelector('.highcharts-title').textContent).to.equal('Awesome chart');
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

  describe('gantt', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="gantt"></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should create gantt chart with gantt type', () => {
      expect(chart.configuration.options.isGantt).to.be.ok;
    });
  });

  describe('organization', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="gantt"></vaadin-chart>');
      chart.updateConfiguration(
        {
          chart: {
            styledMode: true,
            inverted: true,
            type: 'organization',
          },
          title: {
            text: 'Acme organization chart',
          },
          series: [
            {
              keys: ['from', 'to'],
              nodes: [
                {
                  id: 'Acme',
                },
                {
                  id: 'Head Office',
                },
                {
                  id: 'Labs',
                },
              ],
              name: 'Highsoft',
              data: [
                ['Acme', 'Head Office'],
                ['Acme', 'Labs'],
              ],
            },
          ],
        },
        true,
      );
      await oneEvent(chart, 'chart-end-resize');
    });

    it('should have labels aligned with points', () => {
      const renderElement = chart.$.chart;
      const point = renderElement.querySelector('path.highcharts-node.highcharts-point.highcharts-color-0');
      const label = renderElement.querySelector('div.highcharts-data-label.highcharts-data-label-color-0');

      const { left: pointLeft, width: pointWidth } = point.getBoundingClientRect();
      const { left: labelLeft, width: labelWidth } = label.getBoundingClientRect();

      expect(pointLeft + pointWidth / 2).to.be.equal(labelLeft + labelWidth / 2);
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

      const title = chart.$.chart.querySelector('.highcharts-title');
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
      const title = chart.$.chart.querySelector('.highcharts-title');
      expect(title).to.be.ok;
      expect(title.textContent).to.equal('Custom title');
    });

    it('should set chart credits using update', async () => {
      chart.updateConfiguration({ credits: { enabled: true, text: 'Vaadin' } });
      await oneEvent(chart, 'chart-redraw');
      const credits = chart.$.chart.querySelector('.highcharts-credits');
      expect(credits).to.be.ok;
      expect(credits.textContent).to.equal('Vaadin');
    });

    it('should create chart series using update', async () => {
      chart.updateConfiguration({
        series: [
          {
            type: 'column',
            data: DATA,
          },
        ],
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
          categories: MONTHS,
        },
        series: [
          {
            type: 'column',
            data: DATA,
          },
        ],
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
            name: 'series-name',
          },
        ],
      });
      const series = chart.configuration.series[0];
      await oneEvent(chart, 'chart-redraw');
      expect(series.name).to.be.equal('series-name');
    });

    it('should preserve configuration on multiple update calls', async () => {
      chart.updateConfiguration({
        series: [
          {
            innerSize: 40,
          },
        ],
      });
      chart.updateConfiguration({
        series: [
          {
            name: 'name of the series',
            type: 'area',
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      const series = chart.configuration.series;
      expect(series[0].options.innerSize).to.equal(40);
      expect(series[0].name).to.equal('name of the series');
      expect(series[0].type).to.equal('area');
    });

    it('should handle merging multiple series', async () => {
      chart.updateConfiguration({
        series: [{ name: 'series 1' }, { name: 'series 2' }],
      });
      chart.updateConfiguration({
        series: [null, { innerSize: 100 }],
      });
      await oneEvent(chart, 'chart-redraw');
      const series = chart.configuration.series;
      expect(series[0].name).to.equal('series 1');
      expect(series[1].name).to.equal('series 2');
      expect(series[1].options.innerSize).to.equal(100);
    });
  });

  describe('width', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart style="width: 400px"></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should propagate width to the chart container', () => {
      const rect = chart.$.chart.getBoundingClientRect();
      expect(rect.width).to.be.equal(400);
      expect(chart.configuration.chartWidth).to.be.equal(400);
    });

    it('should update container width on chart resize', async () => {
      chart.style.width = '300px';
      await oneEvent(chart, 'chart-end-resize');
      const rect = chart.$.chart.getBoundingClientRect();
      expect(rect.width).to.be.equal(300);
      expect(chart.configuration.chartWidth).to.be.equal(300);
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
      await oneEvent(chart, 'chart-end-resize');
      const rect = chart.$.chart.getBoundingClientRect();
      expect(rect.height).to.be.equal(300);
      expect(chart.configuration.chartHeight).to.be.equal(300);
    });
  });

  describe('resize', () => {
    let layout, charts;

    beforeEach(async () => {
      layout = fixtureSync(`
        <div style="display: flex; width: 1000px; height: 300px;">
          <vaadin-chart>
            <vaadin-chart-series values="[1,7,3,1,5,6]"></vaadin-chart-series>
          </vaadin-chart>
          <vaadin-chart timeline>
            <vaadin-chart-series values="[1,7,3,1,5,6]"></vaadin-chart-series>
          </vaadin-chart>
        </div>
      `);
      charts = Array.from(layout.querySelectorAll('vaadin-chart'));
      await oneEvent(charts[0], 'chart-load');
    });

    it('should update chart width when container width changes', async () => {
      expect(layout.getBoundingClientRect().width).to.be.equal(1000);
      expect(charts[0].configuration.chartWidth).to.be.equal(500);
      expect(charts[1].configuration.chartWidth).to.be.equal(500);

      layout.style.width = '500px';
      await oneEvent(charts[0], 'chart-end-resize');

      expect(layout.getBoundingClientRect().width).to.be.equal(500);
      expect(charts[0].configuration.chartWidth).to.be.equal(250);
      expect(charts[1].configuration.chartWidth).to.be.equal(250);
    });

    it('should update chart height when container height changes', async () => {
      expect(layout.getBoundingClientRect().height).to.be.equal(300);
      expect(charts[0].configuration.chartHeight).to.be.equal(300);
      expect(charts[1].configuration.chartHeight).to.be.equal(300);

      layout.style.height = '200px';
      await oneEvent(charts[0], 'chart-end-resize');

      expect(layout.getBoundingClientRect().height).to.be.equal(200);
      expect(charts[0].configuration.chartHeight).to.be.equal(200);
      expect(charts[1].configuration.chartHeight).to.be.equal(200);
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
      await nextRender();

      redrawSpy = sinon.spy(chart.configuration, 'redraw');
    });

    it('should redraw the chart only 1 time when using update', async () => {
      chart.updateConfiguration({
        title: 'Title',
        xAxis: {
          categories: ['2021', '2022', '2023', '2024'],
        },
        yAxis: {
          title: 'Values',
        },
        credits: {
          enabled: true,
          title: 'Vaadin',
        },
        series: [
          {
            name: 'Series 1',
            data: [0, 100, 200, 300],
          },
          {
            name: 'Series 2',
            data: [0, 100, 200, 300],
          },
        ],
      });

      await nextRender();

      expect(redrawSpy.calledOnce).to.be.true;
    });

    describe('adding a series', () => {
      it('should redraw the chart only 2 times', async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2, 3, 4]"></vaadin-chart-series>`);

        chart.appendChild(series);
        await nextFrame();

        // The number of times the chart is redrawn may be optimized later.
        expect(redrawSpy.callCount).to.be.equal(2);
      });
    });

    describe('replacing a series', () => {
      beforeEach(async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2]"></vaadin-chart-series>`);

        chart.appendChild(series);
        await nextFrame();

        redrawSpy.resetHistory();
      });

      it('should redraw the chart only 4 times', async () => {
        const series = fixtureSync(`<vaadin-chart-series values="[1, 2, 3, 4]"></vaadin-chart-series>`);

        chart.replaceChild(series, chart.firstElementChild);
        await nextFrame();

        // The number of times the chart is redrawn may be optimized later.
        expect(redrawSpy.callCount).to.equal(4);
      });
    });
  });
});
