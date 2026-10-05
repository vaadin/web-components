import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
import { Exporting } from 'highcharts/es-modules/Extensions/Exporting/Exporting.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart exporting', () => {
  let chart, chartContainer, fireEventSpy;
  const attributeName = 'styled-mode';

  // The export renders the chart copy asynchronously, so it is only done once `chart-after-export` fires
  function waitForExport() {
    return oneEvent(chart, 'chart-after-export');
  }

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

    const exported = waitForExport();
    simulateExportToPNG();
    await exported;

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    return styledModeAddedToBody;
  }

  before(() => {
    // Prevent downloading the export. `exporting.local` defaults to `true`, so the
    // export is rendered in the browser instead of being posted to the export server.
    sinon.stub(Exporting.prototype, 'downloadSVG');
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

    const exported = waitForExport();
    simulateExportToPNG();

    expect(fireEventSpy.firstCall.args[1]).to.be.equal('beforeExport');
    await exported;
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

    const exported = waitForExport();
    simulateExportToPNG();
    await exported;

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    expect(styleRemovedFromBody).to.be.true;
  });

  // The export copy renders outside the shadow root, so without the style copying
  // above the SVG loses its paint attributes.
  // Workaround for https://github.com/vaadin/vaadin-charts/issues/389
  it('should inline paint attributes into the exported SVG', async () => {
    const svg = await chart.configuration.exporting.getSVGForExport({}, {});
    expect(svg.match(/fill="/gu)).to.have.length.above(20);
  });

  it('should inline paint attributes into the SVG of the deprecated chart method', () => {
    const svg = chart.configuration.getSVG();
    expect(svg.match(/fill="/gu)).to.have.length.above(20);
  });

  it('should dispatch export events once per export', async () => {
    const events = [];
    chart.addEventListener('chart-before-export', () => events.push('before'));
    chart.addEventListener('chart-after-export', () => events.push('after'));

    await chart.configuration.exportChart();

    expect(events).to.eql(['before', 'after']);
  });

  it('should keep the shadow styles in the body until the chart copy has rendered', async () => {
    // The chart copy only renders asynchronously while it has an image to load. The
    // renderer caches image sizes by URL, so the image needs a URL of its own.
    const url = URL.createObjectURL(
      new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8"/></svg>'], {
        type: 'image/svg+xml',
      }),
    );
    chart.updateConfiguration({ series: [{ data: [1, 2, 3], marker: { symbol: `url(${url})` } }] });
    await nextRender();

    // Highcharts fires `getSVG` right after it has inlined the styles of the chart copy
    const stylesPresent = [];
    const removeListener = Highcharts.addEvent(chart.configuration, 'getSVG', () => {
      stylesPresent.push(document.body.hasAttribute(attributeName));
    });

    try {
      await chart.configuration.exporting.getSVGForExport({}, {});
    } finally {
      removeListener();
      URL.revokeObjectURL(url);
    }

    expect(stylesPresent).to.eql([true]);
    expect(document.body.hasAttribute(attributeName)).to.be.false;
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

  // TODO add test for print button.
  // The original issue https://github.com/highcharts/highcharts/issues/13489 is fixed now.
});
