import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './chart-not-animated-styles.js';
import '../src/vaadin-chart.js';

describe('reattach', () => {
  let wrapper, inner, chart;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-chart>
          <vaadin-chart-series values="[0,1,2]"></vaadin-chart-series>
          <vaadin-chart-series values="[3,2,1]"></vaadin-chart-series>
        </vaadin-chart>
        <div id="inner"></div>
      </div>
    `);
    chart = wrapper.querySelector('vaadin-chart');
    inner = wrapper.querySelector('#inner');
  });

  it('should destroy chart configuration when disconnected from the DOM', async () => {
    await oneEvent(chart, 'chart-load');

    const spy = sinon.spy(chart.configuration, 'destroy');
    wrapper.removeChild(chart);
    await nextFrame();

    expect(spy).to.be.calledOnce;
    expect(chart.configuration).to.be.undefined;
  });

  it('should re-create chart configuration when attached to a new parent', async () => {
    await oneEvent(chart, 'chart-load');
    wrapper.removeChild(chart);
    await nextFrame();

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.series.length).to.be.equal(chart.childElementCount);
  });

  it('should not re-create chart configuration when moved to a new parent', async () => {
    await oneEvent(chart, 'chart-load');

    const configuration = chart.configuration;

    const spy = sinon.spy(chart.configuration, 'destroy');
    inner.appendChild(chart);
    await nextFrame();

    expect(spy).to.not.be.called;
    expect(chart.configuration).to.be.equal(configuration);
  });

  it('should apply title updated while detached after reattach', async () => {
    chart.title = 'Title';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ title: { text: 'New title' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.$.chart.querySelector('.highcharts-title').textContent).to.equal('New title');
  });

  it('should apply subtitle updated while detached after reattach', async () => {
    chart.subtitle = 'Subtitle';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ subtitle: { text: 'New subtitle' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.$.chart.querySelector('.highcharts-subtitle').textContent).to.equal('New subtitle');
  });

  it('should apply type updated while detached after reattach', async () => {
    chart.type = 'area';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ chart: { type: 'line' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.types).to.be.eql(['line']);
  });

  it('should apply tooltip updated while detached after reattach', async () => {
    chart.tooltip = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ tooltip: { enabled: false } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.tooltip.options.enabled).to.be.false;
  });

  it('should apply legend updated while detached after reattach', async () => {
    chart.noLegend = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ legend: { enabled: true } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.legend.options.enabled).to.be.true;
  });

  it('should apply chart3d updated while detached after reattach', async () => {
    chart.chart3d = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ chart: { options3d: { enabled: false } } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.is3d()).to.be.false;
  });

  it('should apply polar updated while detached after reattach', async () => {
    chart.polar = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ chart: { polar: false } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.options.chart.polar).to.be.false;
  });

  it('should apply empty text updated while detached after reattach', async () => {
    chart.emptyText = 'No data';
    chart.innerHTML = '';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ lang: { noData: 'Nothing' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');

    const message = chart.$.chart.querySelector('.highcharts-no-data > text');
    expect(message.textContent).to.equal('Nothing');
  });

  it('should apply stacking updated while detached after reattach', async () => {
    chart.stacking = 'normal';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({
      plotOptions: {
        series: { stacking: 'percent' },
      },
    });
    await nextFrame();

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.options.plotOptions.series.stacking).to.be.equal('percent');
  });

  it('should restore configuration done through `updateConfigaration` after reattach', async () => {
    const wrapper = fixtureSync(`<div><vaadin-chart></vaadin-chart></div>`);
    const chart = wrapper.firstElementChild;
    chart.updateConfiguration({ title: { text: 'New title' }, series: [{ name: 'series', data: [1, 2, 3] }] });
    await nextFrame();
    wrapper.removeChild(chart);
    await nextFrame();
    wrapper.appendChild(chart);
    await nextFrame();
    expect(chart.configuration.options.title.text).to.be.equal('New title');
    expect(chart.configuration.options.series.length).to.be.equal(1);
    expect(chart.configuration.options.series[0].name).to.be.equal('series');
  });

  it('should apply categories updated while detached after reattach', async () => {
    chart.categories = ['Jan', 'Feb', 'Mar'];
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ xAxis: [{ categories: ['Jun', 'Jul', 'Aug'] }] });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');

    const textNodes = chart.$.chart.querySelectorAll('.highcharts-xaxis-labels > text');
    const text = Array.from(textNodes).map((node) => node.textContent);
    expect(text).to.eql(['Jun', 'Jul', 'Aug']);
  });

  it('should apply xAxis min updated while detached after reattach', async () => {
    chart.categoryMin = 0;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ xAxis: [{ min: 1 }] });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.xAxis[0].min).to.be.equal(1);
  });

  it('should apply xAxis max updated while detached after reattach', async () => {
    chart.categoryMax = 2;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ xAxis: [{ max: 3 }] });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.xAxis[0].max).to.be.equal(3);
  });

  it('should apply inverted updated while detached after reattach', async () => {
    chart.categoryPosition = 'left';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    await nextFrame();

    chart.updateConfiguration({ chart: { inverted: false } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.inverted).to.be.undefined;
  });

  it('should restore default height when moving from different container with defined height', async () => {
    await oneEvent(chart, 'chart-load');
    await nextResize(chart);

    const initialHeight = getComputedStyle(chart).height;

    inner.style.height = '700px';
    inner.appendChild(chart);
    await nextResize(chart);

    expect(getComputedStyle(chart).height).to.be.equal(inner.style.height);

    // Move back to first parent
    wrapper.appendChild(chart);
    await nextResize(chart);

    expect(getComputedStyle(chart).height).to.be.equal(initialHeight);
  });

  describe('series', () => {
    let series;

    beforeEach(async () => {
      await oneEvent(chart, 'chart-load');
      series = chart.querySelector('vaadin-chart-series');
    });

    it('should apply the series title updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.title = 'Title';

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.series[0].name).to.be.equal('Title');
    });

    it('should apply the series type updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.type = 'area';

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.series[0].type).to.be.equal('area');
    });

    it('should apply the series unit updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.unit = 'unit';

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      const hasUnit = chart.configuration.yAxis.some((axis) => axis.options.id === 'unit');
      expect(hasUnit).to.be.ok;
    });

    it('should apply the series neck-width updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.neckWidth = 20;

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      expect(chart.configuration.series[0].options.neckWidth).to.be.equal(20);
    });

    it('should apply the series neck-position updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.neckPosition = 50;

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');
      expect(chart.configuration.series[0].options.neckHeight).to.be.equal(50);
    });

    it('should apply the series valueMin updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.valueMin = 5;

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.yAxis[0].options.min).to.be.equal(5);
    });

    it('should apply the series valueMax updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.valueMax = 10;

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.yAxis[0].options.max).to.be.equal(10);
    });

    it('should apply the series markers updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.markers = 'auto';

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.series[0].options.marker.enabled).to.be.equal(null);
    });

    it('should apply the series stack updated while detached after reattach', async () => {
      wrapper.removeChild(chart);
      await nextFrame();

      series.stack = '1';

      wrapper.appendChild(chart);
      await oneEvent(chart, 'chart-load');

      expect(chart.configuration.series[0].options.stack).to.be.equal('1');
    });
  });
});
