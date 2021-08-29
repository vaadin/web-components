import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-login-overlay-wrapper.js';

describe('vaadin-login-overlay-wrapper', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync('<vaadin-login-overlay-wrapper></vaadin-login-overlay-wrapper>');
  });

  it('default', async () => {
    await expect(wrapper).shadowDom.to.equalSnapshot();
  });

  it('title', async () => {
    wrapper.title = 'App title';
    await expect(wrapper).shadowDom.to.equalSnapshot();
  });

  it('description', async () => {
    wrapper.description = 'App description';
    await expect(wrapper).shadowDom.to.equalSnapshot();
  });
});
