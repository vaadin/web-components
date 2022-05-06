import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart properties', () => {
  describe('subtitle', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart subtitle="My subtitle">
          <vaadin-chart-series values="[10, 20, 30, 40, 50]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chartContainer = chart.$.chart;
    });

    it('should have custom subtitle', () => {
      expect(chartContainer.querySelector('.highcharts-subtitle').textContent).to.be.equal('My subtitle');
    });

    it('should not reset subtitle on update', async () => {
      chart.updateConfiguration({ title: { text: 'Awesome chart' } });
      await oneEvent(chart, 'chart-redraw');
      expect(chartContainer.querySelector('.highcharts-title').textContent).to.equal('Awesome chart');
      expect(chartContainer.querySelector('.highcharts-subtitle').textContent).to.equal('My subtitle');
    });
  });

  describe('type', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart type="gauge">
          <vaadin-chart-series values="[80]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chartContainer = chart.$.chart;
    });

    it('should create gauge series when type is set to gauge', () => {
      const series = chartContainer.querySelectorAll('.highcharts-data-labels.highcharts-gauge-series');
      expect(series).to.have.length(1);
      const text = Array.from(series).map((node) => node.textContent);
      expect(text).to.be.deep.equal(['80']);
    });
  });

  describe('additionalOptions', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart
          title="My title"
          additional-options='{"legend": {"title": {"text": "Legend title"}}, "exporting": {"enabled": true}, "credits": {"enabled": true, "text": "Vaadin Ltd"}, "title": {"text": "Additional title"}}'
        >
          <vaadin-chart-series values="[1,2,3,4]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chartContainer = chart.$.chart;
    });

    it('should have additional-options', () => {
      expect(chartContainer.querySelector('.highcharts-contextbutton')).to.not.be.null;
    });

    it('should overwrite conflicting base config properties', () => {
      expect(chartContainer.querySelector('.highcharts-credits').textContent).to.be.equal('Vaadin Ltd');
    });

    it('should not overwrite top-level element properties', () => {
      expect(chartContainer.querySelector('.highcharts-title').textContent).to.be.equal('My title');
    });

    it('should react to additionalOptions object change', async () => {
      chart.additionalOptions = { title: { text: 'Updated title' } };
      await oneEvent(chart, 'chart-redraw');
      expect(chartContainer.querySelector('.highcharts-title').textContent).to.be.equal('Updated title');
    });

    it('should react to additionalOptions sub property change', async () => {
      chart.set('additionalOptions.title.text', 'Reindeer statistics');
      await oneEvent(chart, 'chart-redraw');
      expect(chartContainer.querySelector('.highcharts-title').textContent).to.be.equal('Reindeer statistics');
    });
  });

  describe('categories', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart categories="[2010, 2011, 2012, 2013]">
          <vaadin-chart-series values="[1, 2, 3, 4]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chartContainer = chart.$.chart;
    });

    it('should support setting categories with attribute', () => {
      const textNodes = chartContainer.querySelectorAll('.highcharts-xaxis-labels > text');
      const text = Array.from(textNodes).map((node) => node.textContent);
      expect(text).to.be.deep.equal(['2010', '2011', '2012', '2013']);
    });

    it('should support updating categories with property', () => {
      chart.categories = ['Jan', 'Fev', 'Mar', 'Abr'];
      const textNodes = chartContainer.querySelectorAll('.highcharts-xaxis-labels > text');
      const text = Array.from(textNodes).map((node) => node.textContent);
      expect(text).to.be.deep.equal(['Jan', 'Fev', 'Mar', 'Abr']);
    });
  });

  describe('legend', () => {
    let chart, chartContainer;

    describe('visible', () => {
      beforeEach(async () => {
        chart = fixtureSync(`
          <vaadin-chart
            categories="[2010,2011,2012,2013]"
            additional-options='{"legend": {"title": {"text": "Legend title"}}}'
          >
            <vaadin-chart-series values="[1,2,3,4]"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
        chartContainer = chart.$.chart;
      });

      it('should apply legend config via additional-options', () => {
        const legend = chartContainer.querySelector('.highcharts-legend-title > text');
        expect(legend.textContent).to.be.equal('Legend title');
      });

      it('should hide legend when no-legend attribute is set', () => {
        expect(chartContainer.querySelector('.highcharts-legend')).to.not.be.null;
        chart.setAttribute('no-legend', '');
        expect(chartContainer.querySelector('.highcharts-legend')).to.be.null;
      });
    });

    describe('hidden', () => {
      beforeEach(async () => {
        chart = fixtureSync(`
          <vaadin-chart
            categories="[2010,2011,2012,2013]"
            no-legend
          >
            <vaadin-chart-series values="[1,2,3,4]"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
        chartContainer = chart.$.chart;
      });

      it('should not show legend when no-legend attribute is set', () => {
        expect(chartContainer.querySelector('.highcharts-legend')).to.be.null;
      });
    });
  });

  describe('tooltip', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series values="[1,2,3,4]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should not have tooltips by default', () => {
      expect(chart.configuration.tooltip.options.enabled).to.be.false;
    });

    it('should have tooltips when tooltip is set to true', async () => {
      chart.tooltip = true;
      await aTimeout(50);
      expect(chart.configuration.tooltip.options.enabled).to.be.true;
    });

    it('should have tooltips when tooltip is set using additionalOptions', async () => {
      chart.set('additionalOptions', { tooltip: { enabled: true, pointFormat: 'custom' } });
      await aTimeout(50);
      expect(chart.configuration.tooltip.options.enabled).to.be.true;
    });

    it('should have tooltips when tooltip is set using update', async () => {
      chart.updateConfiguration({ tooltip: { enabled: true, pointFormat: 'custom' } });
      await aTimeout(50);
      expect(chart.configuration.tooltip.options.enabled).to.be.true;
    });
  });

  describe('stacking', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart stacking="normal">
          <vaadin-chart-series title="First" values="[1,2,8,10]" stack="0"></vaadin-chart-series>
          <vaadin-chart-series title="Second" values="[0,0,2,10]" stack="0"></vaadin-chart-series>
          <vaadin-chart-series title="Third" values="[0,1,2,10]" stack="1" ></vaadin-chart-series>
          <vaadin-chart-series title="4th" values="[1,0,1,10]" stack="1" ></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should set stacking to normal with attribute', () => {
      const series = chart.configuration.series;
      expect(series[0].data[3].stackY).to.be.equal(20);
      expect(series[1].data[3].stackY).to.be.equal(10);
      expect(series[2].data[3].stackY).to.be.equal(20);
      expect(series[3].data[3].stackY).to.be.equal(10);
    });

    it('should update when stacking is changed to percent', () => {
      chart.stacking = 'percent';
      const series = chart.configuration.series;
      expect(series[0].data[3].stackY).to.be.equal(100);
      expect(series[1].data[3].stackY).to.be.equal(50);
      expect(series[2].data[3].stackY).to.be.equal(100);
      expect(series[3].data[3].stackY).to.be.equal(50);
    });
  });

  describe('category-min', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart categories="[10, 20, 30, 40, 50]" category-min="1">
          <vaadin-chart-series values="[1, 2, 3, 4, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should support setting category minimum with attribute', () => {
      const [xAxis] = chart.configuration.xAxis;
      expect(xAxis.min).to.be.equal(1);
    });

    it('should support changing category minimum value', (done) => {
      const newCategoryMin = 2;

      function extremesListener(event) {
        expect(event.detail.originalEvent.min).to.be.equal(newCategoryMin);
        chart.removeEventListener('xaxes-extremes-set', extremesListener);
        done();
      }

      chart.addEventListener('xaxes-extremes-set', extremesListener);
      chart.setAttribute('category-min', newCategoryMin);
    });

    it('should warn when setting a not valid minimum value', () => {
      const stub = sinon.stub(console, 'warn');
      chart.categoryMin = 'invalid';
      stub.restore();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.equal('<vaadin-chart> Acceptable value for "category-min" are Numbers or null');
    });
  });

  describe('category-max', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart categories="[10, 20, 30, 40, 50]" category-max="2">
          <vaadin-chart-series values="[1, 2, 3, 4, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should support setting category maximum with attribute', () => {
      const [xAxis] = chart.configuration.xAxis;
      expect(xAxis.max).to.be.equal(2);
    });

    it('should support changing category maximum value', (done) => {
      const newCategoryMax = 5;

      function extremesListener(event) {
        expect(event.detail.originalEvent.max).to.be.equal(newCategoryMax);
        chart.removeEventListener('xaxes-extremes-set', extremesListener);
        done();
      }

      chart.addEventListener('xaxes-extremes-set', extremesListener);
      chart.setAttribute('category-max', newCategoryMax);
    });

    it('should warn when setting a not valid maximum value', () => {
      const stub = sinon.stub(console, 'warn');
      chart.categoryMax = 'invalid';
      stub.restore();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.equal('<vaadin-chart> Acceptable value for "category-max" are Numbers or null');
    });
  });

  describe('categoryPosition', () => {
    describe('property', () => {
      let chart;

      beforeEach(async () => {
        chart = fixtureSync(`
          <vaadin-chart>
            <vaadin-chart-series values="[0, 1, 2, 3]"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
      });

      it('should not define any properties by default', () => {
        expect(chart.configuration.inverted).to.be.undefined;
        expect(chart.configuration.xAxis[0].opposite).to.be.undefined;
      });

      it('should handle categoryPosition set to left', () => {
        chart.categoryPosition = 'left';
        expect(chart.configuration.inverted).to.be.true;
        expect(chart.configuration.xAxis[0].opposite).to.be.false;
      });

      it('should handle categoryPosition set to right', () => {
        chart.categoryPosition = 'right';
        expect(chart.configuration.inverted).to.be.true;
        expect(chart.configuration.xAxis[0].opposite).to.be.true;
      });

      it('should handle categoryPosition set to top', () => {
        chart.categoryPosition = 'top';
        expect(chart.configuration.inverted).to.be.undefined;
        expect(chart.configuration.xAxis[0].opposite).to.be.true;
      });

      it('should handle categoryPosition set to bottom', () => {
        chart.categoryPosition = 'bottom';
        expect(chart.configuration.inverted).to.be.undefined;
        expect(chart.configuration.xAxis[0].opposite).to.be.false;
      });
    });

    ['left', 'right', 'top', 'bottom'].forEach((value) => {
      describe(`attribute value ${value}`, () => {
        let chart;

        beforeEach(async () => {
          chart = fixtureSync(`
            <vaadin-chart category-position="${value}">
              <vaadin-chart-series values="[0, 1, 2, 3]"></vaadin-chart-series>
            </vaadin-chart>
          `);
          await oneEvent(chart, 'chart-load');
        });

        it(`should handle category-position set to ${value}`, () => {
          expect(chart.configuration.inverted).to.be.equal(['left', 'right'].includes(value) ? true : undefined);
          expect(chart.configuration.xAxis[0].opposite).to.be.equal(['top', 'right'].includes(value));
        });
      });
    });

    describe('multiple series', () => {
      let chart;

      beforeEach(async () => {
        chart = fixtureSync('<vaadin-chart></vaadin-chart>');
        await oneEvent(chart, 'chart-load');
      });

      it('should react to category position changes with multiple x-axes', async () => {
        chart.updateConfiguration({
          xAxis: [
            {
              name: 'First',
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            {
              name: 'Second',
              categories: ['a', 'v', 's', 'h', 'd', 'g', 'g', 'e', 'kj', 'kl', 'gs', 'df'],
            },
            {
              name: 'Third',
              categories: [
                'Abuja',
                'Rio',
                'Minsk',
                'Montevideo',
                'Helsinki',
                'Turku',
                'Stockholm',
                'Tallinn',
                'Riga',
                'Copenhagen',
                'Oslo',
                'St. Petersburg',
              ],
            },
          ],
          series: [
            {
              name: 'Rainfall',
              type: 'column',
              data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            },
            {
              name: 'Sea-Level Pressure',
              type: 'column',
              xAxis: 1,
              data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
            },
          ],
        });
        await oneEvent(chart, 'chart-redraw');
        expect(chart.configuration.xAxis.length).to.be.equal(3);

        chart.categoryPosition = 'right';
        expect(chart.configuration.inverted).to.be.true;
        expect(chart.configuration.xAxis.every((e) => e.opposite)).to.be.true;
      });
    });
  });

  describe('polar', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart polar>
          <vaadin-chart-series values="[0, 1, 2, 3]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should set polar to true when attribute is set', () => {
      const { polar } = chart.configuration.options.chart;
      expect(polar).to.be.true;
    });

    it('should set polar to false when property is set', () => {
      chart.polar = false;
      const { polar } = chart.configuration.options.chart;
      expect(polar).to.not.be.true;
    });
  });

  describe('chart3d', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart type="column" chart3d>
          <vaadin-chart-series values="[1, 2, 8, 18]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should set chart3d to true when attribute is set', () => {
      expect(chart.configuration.is3d()).to.be.true;
    });

    it('should set chart3d to false when property is set', () => {
      chart.chart3d = false;
      expect(chart.configuration.is3d()).to.be.false;
    });
  });

  describe('empty-text', () => {
    describe('without series', () => {
      let chart;

      beforeEach(async () => {
        chart = fixtureSync('<vaadin-chart></vaadin-chart>');
        await oneEvent(chart, 'chart-load');
      });

      it('should not show any message for empty chart by default', () => {
        const message = chart.$.chart.querySelector('.highcharts-no-data > text');
        expect(message.textContent.trim()).to.be.empty;
      });

      it('should show an element-specific message when emptyText property is set', () => {
        chart.emptyText = 'Empty Vaadin Chart';
        const message = chart.$.chart.querySelector('.highcharts-no-data > text');
        expect(message.textContent).to.be.equal(chart.emptyText);
      });

      describe('with global language setting', () => {
        const defaultGlobalNoDataMessage = Highcharts.getOptions().lang.noData;

        before(() => {
          Highcharts.setOptions({ lang: { noData: 'Global empty chart' } });
        });
        after(() => {
          Highcharts.setOptions({ lang: { noData: defaultGlobalNoDataMessage } });
        });

        it('should show custom global message for empty chart', () => {
          const message = chart.$.chart.querySelector('.highcharts-no-data > text');
          expect(message.textContent.trim()).to.equal('Global empty chart');
        });

        it('should show an element-specific message when emptyText property is set', () => {
          chart.emptyText = 'Empty Vaadin Chart';
          const message = chart.$.chart.querySelector('.highcharts-no-data > text');
          expect(message.textContent).to.be.equal(chart.emptyText);
        });
      });
    });

    describe('with series', () => {
      let chart;

      beforeEach(async () => {
        chart = fixtureSync(`
          <vaadin-chart>
            <vaadin-chart-series values="[1,2,3]"></vaadin-chart-series>
            <vaadin-chart-series values="[4,5,6]"></vaadin-chart-series>
            <vaadin-chart-series values="[]"></vaadin-chart-series>
          </vaadin-chart>
        `);
        await oneEvent(chart, 'chart-load');
      });

      it('should not show a message when lazily setting the property and the chart has data', async () => {
        chart.emptyText = 'Empty Vaadin Chart';
        expect(chart.$.chart.querySelector('.highcharts-no-data > text')).not.to.exist;
      });

      it('should show a message when all series are removed from chart', async () => {
        chart.emptyText = 'Empty Vaadin Chart';
        const series = chart.querySelectorAll('vaadin-chart-series');
        series.forEach((element) => chart.removeChild(element));
        await oneEvent(chart, 'chart-redraw');
        const message = chart.$.chart.querySelector('.highcharts-no-data > text');
        expect(message.textContent).to.be.equal('Empty Vaadin Chart');
      });

      it('should show a message when data-containing series are removed from chart', async () => {
        chart.emptyText = 'Empty Vaadin Chart';
        const series = chart.querySelectorAll('vaadin-chart-series');
        chart.removeChild(series[0]);
        chart.removeChild(series[1]);
        await oneEvent(chart, 'chart-redraw');
        const message = chart.$.chart.querySelector('.highcharts-no-data > text');
        expect(message.textContent).to.be.equal('Empty Vaadin Chart');
      });
    });
  });
});
