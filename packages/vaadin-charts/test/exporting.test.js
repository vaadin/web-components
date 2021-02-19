import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { fixtureSync, oneEvent } from '@open-wc/testing-helpers';
import { nextRender } from './helpers.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import '../vaadin-chart.js';

registerStyles(
  'vaadin-chart',
  css`
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
  `,
  { include: ['vaadin-chart-default-theme'] }
);

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
  }
);

describe('vaadin-chart exporting', () => {
  let wrapper, chart, chartContainer, fireEventSpy;

  before(() => {
    // Prevent form submit
    sinon.stub(Highcharts, 'post');
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
              .indexOf('style') >= 0
        );
    });

    observer.observe(document.body, { childList: true });

    // Reveal exporting menu items
    chartContainer.querySelector('.highcharts-contextbutton').onclick();

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
              .indexOf('style') >= 0
        );
    });

    observer.observe(document.body, { childList: true });

    // Reveal exporting menu items
    chartContainer.querySelector('.highcharts-contextbutton').onclick();

    // Simulate a PNG export
    const pngExportButton = chartContainer.querySelectorAll('.highcharts-menu-item')[2];
    pngExportButton.onclick();

    expect(fireEventSpy.lastCall.args[1]).to.be.equal('afterExport');
    await nextRender(chart);
    expect(styleRemovedFromBody).to.be.true;
  });

  // TODO add test for print button.
  // The original issue https://github.com/highcharts/highcharts/issues/13489 is fixed now.
});
