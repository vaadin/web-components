import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './exporting-styles.js';
import '../src/vaadin-chart.js';
import HttpUtilities from 'highcharts/es-modules/Core/HttpUtilities.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

describe('vaadin-chart exporting', () => {
  let chart, chartContainer, fireEventSpy;

  function clickExportingButton() {
    const exportingButton = chartContainer.querySelector('.highcharts-exporting-group > .highcharts-no-tooltip');
    click(exportingButton);
  }

  before(() => {
    // Prevent form submit
    sinon.stub(HttpUtilities, 'post');
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

    // Reveal exporting menu items
    // chartContainer.querySelector('button.highcharts-a11y-proxy-button.highcharts-no-tooltip').click();
    clickExportingButton();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    click(pngExportButton);

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

    // Reveal exporting menu items
    clickExportingButton();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    expect(styleRemovedFromBody).to.be.true;
  });

  it('should add styled-mode attribute to body before export and delete it afterwards', async () => {
    chart.options.chart.styledMode = true;
    const attributeName = 'styled-mode';
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

    // Reveal exporting menu items
    clickExportingButton();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    expect(styledModeAddedToBody).to.be.true;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });

  it('should not add styled-mode attribute to body if styledMode option is set to false', async () => {
    chart.options.chart.styledMode = false;
    const attributeName = 'styled-mode';
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

    // Reveal exporting menu items
    clickExportingButton();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender();
    expect(styledModeAddedToBody).to.be.false;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });

  // TODO add test for print button.
  // The original issue https://github.com/highcharts/highcharts/issues/13489 is fixed now.
});
