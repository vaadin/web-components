import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-chart.js';

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
    expect(spy.calledOnce).to.be.ok;
    expect(chart.configuration).to.be.undefined;
  });

  it('should re-create chart configuration when attached to a new parent', async () => {
    await oneEvent(chart, 'chart-load');
    wrapper.removeChild(chart);

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    await nextFrame();
    expect(chart.configuration.series.length).to.be.equal(chart.childElementCount);
  });

  it('should apply title updated while detached after reattach', async () => {
    chart.title = 'Title';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ title: { text: 'New title' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.$.chart.querySelector('.highcharts-title').textContent).to.equal('New title');
  });

  it('should apply subtitle updated while detached after reattach', async () => {
    chart.subtitle = 'Subtitle';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ subtitle: { text: 'New subtitle' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.$.chart.querySelector('.highcharts-subtitle').textContent).to.equal('New subtitle');
  });

  it('should apply type updated while detached after reattach', async () => {
    chart.type = 'area';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ chart: { type: 'line' } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    await nextFrame();
    expect(chart.configuration.types).to.be.eql(['line']);
  });

  it('should apply tooltip updated while detached after reattach', async () => {
    chart.tooltip = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ tooltip: { enabled: false } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.tooltip.options.enabled).to.be.false;
  });

  it('should apply legend updated while detached after reattach', async () => {
    chart.noLegend = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ legend: { enabled: true } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.legend.options.enabled).to.be.true;
  });

  it('should apply chart3d updated while detached after reattach', async () => {
    chart.chart3d = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ chart: { options3d: { enabled: false } } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.is3d()).to.be.false;
  });

  it('should apply polar updated while detached after reattach', async () => {
    chart.polar = true;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
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

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.options.plotOptions.series.stacking).to.be.equal('percent');
  });

  it('should apply categories updated while detached after reattach', async () => {
    chart.categories = ['Jan', 'Feb', 'Mar'];
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ xAxis: { categories: ['Jun', 'Jul', 'Aug'] } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    await nextFrame();

    const textNodes = chart.$.chart.querySelectorAll('.highcharts-xaxis-labels > text');
    const text = Array.from(textNodes).map((node) => node.textContent);
    expect(text).to.eql(['Jun', 'Jul', 'Aug']);
  });

  it('should apply xAxis min updated while detached after reattach', async () => {
    chart.categoryMin = 0;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ xAxis: { min: 1 } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.xAxis[0].min).to.be.equal(1);
  });

  it('should apply xAxis max updated while detached after reattach', async () => {
    chart.categoryMax = 2;
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ xAxis: { max: 3 } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.xAxis[0].max).to.be.equal(3);
  });

  it('should apply inverted updated while detached after reattach', async () => {
    chart.categoryPosition = 'left';
    await oneEvent(chart, 'chart-load');

    wrapper.removeChild(chart);
    chart.updateConfiguration({ chart: { inverted: false } });

    inner.appendChild(chart);
    await oneEvent(chart, 'chart-load');
    expect(chart.configuration.inverted).to.be.undefined;
  });
});
