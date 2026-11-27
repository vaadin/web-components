import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
// Loaded after Vaadin Charts, like an app adding the optional module itself, see
// https://github.com/vaadin/web-components/issues/11911
import 'highcharts/es-modules/masters/modules/offline-exporting.src.js';
import HttpUtilities from 'highcharts/es-modules/Core/HttpUtilities.js';
import OfflineExporting from 'highcharts/es-modules/Extensions/OfflineExporting/OfflineExporting.js';

describe('vaadin-chart local exporting', () => {
  let chart, downloadStub, postStub;

  before(() => {
    // Prevent downloading the export
    downloadStub = sinon.stub(OfflineExporting, 'downloadSVGLocal');
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

  it('should export locally without throwing', () => {
    chart.configuration.exportChartLocal();

    expect(downloadStub).to.be.calledOnce;
    expect(postStub).to.be.not.called;
  });

  it('should export in the browser from the download menu items', async () => {
    const exported = oneEvent(chart, 'chart-after-export');
    click(chart.$.chart.querySelector('.highcharts-exporting-group > .highcharts-no-tooltip'));
    // Download PNG image
    click(chart.$.chart.querySelectorAll('.highcharts-menu-item')[2]);
    await exported;
    await nextRender();

    expect(downloadStub).to.be.calledOnce;
    expect(postStub).to.be.not.called;
  });

  it('should post the export to the export server from exportChart', async () => {
    await chart.configuration.exportChart();

    expect(postStub).to.be.calledOnce;
    expect(downloadStub).to.be.not.called;
  });

  it('should dispatch export events once per local export', () => {
    const events = [];
    chart.addEventListener('chart-before-export', () => events.push('before'));
    chart.addEventListener('chart-after-export', () => events.push('after'));

    chart.configuration.exportChartLocal();

    expect(events).to.eql(['before', 'after']);
  });

  it('should apply the shadow styles to the exported SVG', () => {
    chart.configuration.exportChartLocal();

    // Blue comes from the `:host(#chart)` rule in exporting-styles.js
    expect(downloadStub.firstCall.args[0]).to.include('fill="rgb(0, 0, 255)"');
  });

  it('should not leave the temporary style in the document body', () => {
    chart.configuration.exportChartLocal();
    expect(chart.tempBodyStyle).to.be.undefined;
    expect(document.body.hasAttribute('styled-mode')).to.be.false;
  });
});
