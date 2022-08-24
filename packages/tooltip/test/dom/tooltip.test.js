import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-tooltip.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-tooltip', () => {
  let tooltip;

  beforeEach(() => {
    resetUniqueId();
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
  });

  it('default', async () => {
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('top-start', async () => {
    tooltip.position = 'top-start';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('top', async () => {
    tooltip.position = 'top';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('top-end', async () => {
    tooltip.position = 'top-end';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('bottom-start', async () => {
    tooltip.position = 'bottom-start';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('bottom', async () => {
    tooltip.position = 'bottom';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('bottom-end', async () => {
    tooltip.position = 'bottom-end';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('start-top', async () => {
    tooltip.position = 'start-top';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('start', async () => {
    tooltip.position = 'start';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('start-bottom', async () => {
    tooltip.position = 'start-bottom';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('end-top', async () => {
    tooltip.position = 'end-top';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('end', async () => {
    tooltip.position = 'end';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });

  it('end-bottom', async () => {
    tooltip.position = 'end-bottom';
    await expect(tooltip).shadowDom.to.equalSnapshot();
  });
});
