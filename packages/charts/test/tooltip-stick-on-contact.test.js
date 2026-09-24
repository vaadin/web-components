import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import './chart-not-animated-styles.js';
import '../src/vaadin-chart.js';

describe('vaadin-chart tooltip stickOnContact', () => {
  let chart;

  async function moveMouseTo(position) {
    await sendMouse({ type: 'move', position });
    await nextFrame();
    await nextFrame();
  }

  function elementAtTooltipCentre() {
    // The label <g> is wider than the painted tooltip, so aim at the box.
    const rect = document.querySelector('.highcharts-tooltip-box').getBoundingClientRect();
    const [x, y] = [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)];
    return [document.elementFromPoint(x, y), [x, y]];
  }

  beforeEach(async () => {
    chart = fixtureSync(`
      <vaadin-chart type="column" tooltip style="width: 500px; height: 300px"
        additional-options='{ "tooltip": { "stickOnContact": true, "outside": true } }'>
        <vaadin-chart-series title="Installation" values="[43934, 52503, 57177, 69658]"></vaadin-chart-series>
      </vaadin-chart>
    `);
    await oneEvent(chart, 'chart-load');

    const rect = chart.configuration.series[0].points[3].graphic.element.getBoundingClientRect();
    await moveMouseTo([Math.round(rect.x + rect.width / 2), Math.round(rect.y + 10)]);
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should keep the tooltip under the pointer moved onto it', async () => {
    const [element, centre] = elementAtTooltipCentre();
    expect(element.closest('.highcharts-tooltip')).to.exist;

    await moveMouseTo(centre);
    expect(elementAtTooltipCentre()[0].closest('.highcharts-tooltip')).to.exist;
  });

  it('should not fail when the formatter returns false', async () => {
    chart.configuration.update({ tooltip: { formatter: () => false } });
    await nextFrame();

    expect(() => chart.configuration.series[0].points[1].onMouseOver()).to.not.throw();
  });
});
