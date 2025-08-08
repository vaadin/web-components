import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-dashboard-widget.js';

describe('vaadin-dashboard-widget', () => {
  let widget;

  beforeEach(async () => {
    widget = fixtureSync('<vaadin-dashboard-widget></vaadin-dashboard-widget>');
    widget.widgetTitle = 'Custom title';
    await nextRender();
  });

  it('host', async () => {
    await expect(widget).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(widget).shadowDom.to.equalSnapshot();
  });
});
