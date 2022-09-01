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

  [
    'top-start',
    'top',
    'top-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'start-top',
    'start',
    'start-bottom',
    'end-top',
    'end',
    'end-bottom',
  ].forEach((position) => {
    it(position, async () => {
      tooltip.position = position;
      await expect(tooltip).shadowDom.to.equalSnapshot();
    });
  });
});
