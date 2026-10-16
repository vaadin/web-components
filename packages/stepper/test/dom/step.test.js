import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../enable-feature-flag.js';
import '../../src/vaadin-step.js';

describe('vaadin-step', () => {
  let step;

  beforeEach(async () => {
    step = fixtureSync('<vaadin-step>Step<span slot="description">Description</span></vaadin-step>');
    step._position = 1;
    await nextRender();
  });

  it('host', async () => {
    await expect(step).dom.to.equalSnapshot();
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('current', async () => {
      step.current = true;
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('completed', async () => {
      step.completed = true;
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      step.invalid = true;
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('path', async () => {
      step.path = '/shipping';
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      step.path = '/shipping';
      step.disabled = true;
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('last', async () => {
      step._last = true;
      await nextUpdate(step);
      await expect(step).shadowDom.to.equalSnapshot();
    });
  });
});
