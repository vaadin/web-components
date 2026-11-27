import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
import HttpUtilities from 'highcharts/es-modules/Core/HttpUtilities.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart exporting', () => {
  let chart, chartContainer, fireEventSpy, postStub;
  const attributeName = 'styled-mode';

  function simulateExportToPNG() {
    const exportingButton = chartContainer.querySelector('.highcharts-exporting-group > .highcharts-no-tooltip');
    click(exportingButton);

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    click(pngExportButton);
  }

  async function performExport() {
    expect(document.body.hasAttribute(attributeName)).to.be.false;

    let styledModeAddedToBody = false;

    const targetNode = document.body;
    const config = { attributes: true, attributeOldValue: true };

    // Track styled-mode attribute addition and removal from the document body
    const observer = new MutationObserver((mutations) => {
      styledModeAddedToBody ||= mutations.some(
        (mutation) => mutation.attributeName === attributeName && mutation.oldValue === '',
      );
    });

    observer.observe(targetNode, config);

    simulateExportToPNG();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    return styledModeAddedToBody;
  }

  before(() => {
    // Prevent posting the export to the export server
    postStub = sinon.stub(HttpUtilities, 'post');
    // Hook into Highcharts events
    fireEventSpy = sinon.spy(Highcharts, 'fireEvent');
  });

  beforeEach(async () => {
    chart = fixtureSync(`
      <vaadin-chart id="chart" class="my-class dummy-class">
        <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
      </vaadin-chart>
    `);
    chart.additionalOptions = { exporting: { enabled: true } };
    await oneEvent(chart, 'chart-add-series');
    chartContainer = chart.$.chart;
  });

  afterEach(() => {
    fireEventSpy.resetHistory();
    postStub.resetHistory();
  });

  describe('export path', () => {
    it('should post the export to the export server by default', async () => {
      await chart.configuration.exportChart();

      expect(postStub).to.be.calledOnce;
      expect(postStub.firstCall.args[0]).to.include('export-svg.highcharts.com');
      expect(postStub.firstCall.args[1].svg).to.include('<svg');
    });

    it('should post the export from the download menu items', async () => {
      const exported = oneEvent(chart, 'chart-after-export');
      simulateExportToPNG();
      await exported;
      await nextRender();

      expect(postStub).to.be.calledOnce;
      expect(postStub.firstCall.args[1].type).to.equal('image/png');
    });
  });

  it('should return no value from exportChart', () => {
    expect(chart.configuration.exportChart()).to.be.undefined;
  });

  it('should temporarily copy shadow styles to the body before export', async () => {
    let styleCopiedToBody = false;
    let styleContent;

    // Track style movement into the document body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const styleTag = [...mutation.addedNodes].find((node) => node instanceof HTMLStyleElement);
        if (styleTag) {
          styleCopiedToBody = true;
          styleContent = styleTag.textContent;
        }
      });
    });

    observer.observe(document.body, { childList: true });

    simulateExportToPNG();

    expect(fireEventSpy.firstCall.args[1]).to.be.equal('beforeExport');
    await nextRender();
    expect(styleCopiedToBody).to.be.true;
    expect(styleContent).to.include('.highcharts-color-0');
  });

  it('should remove shadow styles from body after export', async () => {
    let styleRemovedFromBody = false;

    // Track style removal from the document body
    const observer = new MutationObserver((mutations) => {
      styleRemovedFromBody ||= mutations.some(
        (mutation) =>
          Array.from(mutation.removedNodes)
            .map((node) => node.tagName.toLowerCase())
            .indexOf('style') >= 0,
      );
    });

    observer.observe(document.body, { childList: true });

    simulateExportToPNG();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    expect(styleRemovedFromBody).to.be.true;
  });

  // The export copy renders outside the shadow root, so without the style copying
  // above the SVG loses its paint attributes.
  // Workaround for https://github.com/vaadin/vaadin-charts/issues/389
  it('should inline paint attributes into the exported SVG', () => {
    const svg = chart.configuration.getSVGForExport({}, {});
    expect(svg.match(/fill="/gu)).to.have.length.above(20);
  });

  it('should inline paint attributes into the SVG of the deprecated chart method', () => {
    const svg = chart.configuration.getSVG();
    expect(svg.match(/fill="/gu)).to.have.length.above(20);
  });

  it('should dispatch export events once per export', () => {
    const events = [];
    chart.addEventListener('chart-before-export', () => events.push('before'));
    chart.addEventListener('chart-after-export', () => events.push('after'));

    chart.configuration.exportChart();

    expect(events).to.eql(['before', 'after']);
  });

  it('should add styled-mode attribute to body before export and delete it afterwards', async () => {
    expect(document.body.hasAttribute(attributeName)).to.be.false;

    const styledModeAddedToBody = await performExport();
    expect(styledModeAddedToBody).to.be.true;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });

  it('should not add styled-mode attribute to body if styledMode option is set to false', async () => {
    const options = { ...chart.configuration.userOptions };
    options.chart.styledMode = false;
    chart.updateConfiguration(options, true);
    await nextRender();

    const styledModeAddedToBody = await performExport();

    expect(styledModeAddedToBody).to.be.false;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });

  it('should copy the shadow styles to the body for a print', () => {
    const bodyStyles = () => document.body.querySelectorAll(':scope > style').length;
    const initialStyles = bodyStyles();

    Highcharts.fireEvent(chart.configuration, 'beforePrint');
    const style = chart.tempBodyStyle;
    expect(style.isConnected).to.be.true;
    expect(document.body.hasAttribute(attributeName)).to.be.true;

    // Another print can start before the first one ends
    Highcharts.fireEvent(chart.configuration, 'beforePrint');
    expect(bodyStyles()).to.equal(initialStyles + 1);

    Highcharts.fireEvent(chart.configuration, 'afterPrint');
    expect(style.isConnected).to.be.false;
    expect(chart.tempBodyStyle).to.be.undefined;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });
});
