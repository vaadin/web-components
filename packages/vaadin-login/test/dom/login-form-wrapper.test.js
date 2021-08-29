import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-login-form-wrapper.js';

describe('vaadin-login-form-wrapper', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync('<vaadin-login-form-wrapper></vaadin-login-form-wrapper>');
  });

  it('default', async () => {
    await expect(wrapper).shadowDom.to.equalSnapshot();
  });
});
