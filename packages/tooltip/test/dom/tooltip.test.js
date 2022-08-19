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
});
