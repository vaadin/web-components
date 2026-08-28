import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
// Loaded after Vaadin Charts, like an app adding the optional module itself (#11911)
import 'highcharts/es-modules/masters/modules/offline-exporting.src.js';
import OfflineExporting from 'highcharts/es-modules/Extensions/OfflineExporting/OfflineExporting.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart local exporting', () => {
  let chart, downloadStub;

  before(() => {
    // Prevent downloading the export
    downloadStub = sinon.stub(OfflineExporting, 'downloadSVGLocal');
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
  });

  it('should let the offline-exporting module install exportChartLocal', () => {
    expect(Highcharts.Chart.prototype.exportChartLocal).to.be.a('function');
  });

  it('should export locally without throwing', () => {
    chart.configuration.exportChartLocal();
    expect(downloadStub.calledOnce).to.be.true;
  });

  it('should dispatch export events once per local export', () => {
    const events = [];
    chart.addEventListener('chart-before-export', () => events.push('before'));
    chart.addEventListener('chart-after-export', () => events.push('after'));

    chart.configuration.exportChartLocal();

    expect(events).to.eql(['before', 'after']);
  });

  it('should copy shadow styles to the body during a local export', () => {
    let styleContent;
    chart.addEventListener('chart-before-export', () => {
      styleContent = document.body.contains(chart.tempBodyStyle) && chart.tempBodyStyle.textContent;
    });

    chart.configuration.exportChartLocal();

    expect(styleContent).to.include('.highcharts-color-0');
  });

  it('should not leave the temporary style in the document body', () => {
    chart.configuration.exportChartLocal();
    expect(chart.tempBodyStyle).to.be.undefined;
    expect(document.body.hasAttribute('styled-mode')).to.be.false;
  });
});
