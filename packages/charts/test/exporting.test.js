import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-chart.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import HttpUtilities from 'highcharts/es-modules/Core/HttpUtilities.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { chartBaseTheme } from '../theme/vaadin-chart-base-theme.js';

const chart = css`
  /* Ensure exporting works with complex selectors */
  .highcharts-color-0 {
    stroke: red;
    fill: red;
  }

  :host(#chart) .highcharts-color-0 {
    stroke: blue;
    fill: blue;
  }

  :host(.my-class .dummy-class) .highcharts-color-0 {
    stroke: blue;
    fill: blue;
  }

  :host(.ColumnLineAndPie) g.highcharts-markers > .highcharts-point {
    fill: white;
  }

  :host(.GaugeWithDualAxes) .kmh .highcharts-tick,
  :host(.GaugeWithDualAxes) .kmh .highcharts-axis-line {
    stroke: #339;
    stroke-width: 2;
  }
`;

registerStyles('vaadin-chart', [chartBaseTheme, chart]);

customElements.define(
  'chart-exporting',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-chart id="chart" class="my-class dummy-class">
          <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
        </vaadin-chart>
      `;
    }
  },
);

describe('vaadin-chart exporting', () => {
  let wrapper, chart, chartContainer, fireEventSpy;

  before(() => {
    // Prevent form submit
    sinon.stub(HttpUtilities, 'post');
    // Hook into Highcharts events
    fireEventSpy = sinon.spy(Highcharts, 'fireEvent');
  });

  beforeEach(async () => {
    wrapper = fixtureSync('<chart-exporting></chart-exporting>');
    chart = wrapper.$.chart;
    chart.set('additionalOptions', { exporting: { enabled: true } });
    await oneEvent(chart, 'chart-add-series');
    chartContainer = chart.$.chart;
  });

  afterEach(() => {
    fireEventSpy.resetHistory();
  });

  it('should temporarily copy shadow styles to the body before export', async () => {
    let styleCopiedToBody = false;

    // Track style movement into the document body
    const observer = new MutationObserver((mutations) => {
      styleCopiedToBody =
        styleCopiedToBody ||
        mutations.some(
          (mutation) =>
            Array.from(mutation.addedNodes)
              .map((node) => node.tagName.toLowerCase())
              .indexOf('style') >= 0,
        );
    });

    observer.observe(document.body, { childList: true });

    // Reveal exporting menu items
    chartContainer.querySelector('button.highcharts-a11y-proxy-button.highcharts-no-tooltip').click();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.firstCall.args[1]).to.be.equal('beforeExport');
    await nextRender(chart);
    expect(styleCopiedToBody).to.be.true;
  });

  it('should remove shadow styles from body after export', async () => {
    let styleRemovedFromBody = false;

    // Track style removal from the document body
    const observer = new MutationObserver((mutations) => {
      styleRemovedFromBody =
        styleRemovedFromBody ||
        mutations.some(
          (mutation) =>
            Array.from(mutation.removedNodes)
              .map((node) => node.tagName.toLowerCase())
              .indexOf('style') >= 0,
        );
    });

    observer.observe(document.body, { childList: true });

    // Reveal exporting menu items
    chartContainer.querySelector('button.highcharts-a11y-proxy-button.highcharts-no-tooltip').click();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender(chart);
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
      styledModeAddedToBody =
        styledModeAddedToBody ||
        mutations.some((mutation) => mutation.attributeName === attributeName && mutation.oldValue === '');
    });

    observer.observe(targetNode, config);

    // Reveal exporting menu items
    chartContainer.querySelector('button.highcharts-a11y-proxy-button.highcharts-no-tooltip').click();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender(chart);
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
      styledModeAddedToBody =
        styledModeAddedToBody ||
        mutations.some((mutation) => mutation.attributeName === attributeName && mutation.oldValue === '');
    });

    observer.observe(targetNode, config);

    // Reveal exporting menu items
    chartContainer.querySelector('button.highcharts-a11y-proxy-button.highcharts-no-tooltip').click();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender(chart);
    expect(styledModeAddedToBody).to.be.false;
    expect(document.body.hasAttribute(attributeName)).to.be.false;
  });

  // TODO add test for print button.
  // The original issue https://github.com/highcharts/highcharts/issues/13489 is fixed now.
});
