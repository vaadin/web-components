import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
// Loaded after Vaadin Charts, like an app adding the optional module itself, see
// https://github.com/vaadin/web-components/issues/11911
import 'highcharts/es-modules/masters/modules/offline-exporting.src.js';
import HttpUtilities from 'highcharts/es-modules/Core/HttpUtilities.js';
import { Exporting } from 'highcharts/es-modules/Extensions/Exporting/Exporting.js';

describe('vaadin-chart local exporting', () => {
  let chart, downloadStub, postStub;

  before(() => {
    // Prevent downloading the export. The local export runs in the core exporting
    // module, so the download goes through `Exporting` rather than `OfflineExporting`.
    downloadStub = sinon.stub(Exporting.prototype, 'downloadSVG');
    // Prevent posting the export to the export server
    postStub = sinon.stub(HttpUtilities, 'post');
  });

  beforeEach(async () => {
    chart = fixtureSync(`
      <vaadin-chart id="chart">
        <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
      </vaadin-chart>
    `);
    chart.additionalOptions = { exporting: { enabled: true } };
    await oneEvent(chart, 'chart-add-series');
    downloadStub.resetHistory();
    postStub.resetHistory();
  });

  it('should export locally without throwing', async () => {
    await chart.configuration.exportChartLocal();

    expect(downloadStub).to.be.calledOnce;
    expect(postStub).to.be.not.called;
  });

  it('should export locally from the download menu items', async () => {
    const chartContainer = chart.$.chart;
    click(chartContainer.querySelector('.highcharts-exporting-group > .highcharts-no-tooltip'));
    // Download PNG image
    click(chartContainer.querySelectorAll('.highcharts-menu-item')[2]);
    // The local export inlines images and fonts asynchronously before the download
    while (!downloadStub.called) {
      await nextFrame();
    }

    expect(downloadStub).to.be.calledOnce;
    expect(postStub).to.be.not.called;
  });

  it('should post the export to the export server when local is false', async () => {
    await chart.configuration.exportChart({ local: false });

    expect(postStub).to.be.calledOnce;
    expect(downloadStub).to.be.not.called;
  });

  it('should dispatch export events once per local export', async () => {
    const events = [];
    chart.addEventListener('chart-before-export', () => events.push('before'));
    chart.addEventListener('chart-after-export', () => events.push('after'));

    await chart.configuration.exportChartLocal();

    expect(events).to.eql(['before', 'after']);
  });

  it('should apply the shadow styles to the exported SVG', async () => {
    await chart.configuration.exportChartLocal();

    // Blue comes from the `:host(#chart)` rule in exporting-styles.js
    expect(downloadStub.firstCall.args[0]).to.include('fill="rgb(0, 0, 255)"');
  });

  it('should not leave the temporary style in the document body', async () => {
    await chart.configuration.exportChartLocal();

    expect(chart.tempBodyStyle).to.be.undefined;
    expect(document.body.hasAttribute('styled-mode')).to.be.false;
  });
});
