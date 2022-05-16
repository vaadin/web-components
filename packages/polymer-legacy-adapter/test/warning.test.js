import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../template-renderer.js';
import './fixtures/mock-component.js';

describe('warning', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    stub.restore();
  });

  it('should show the warning', () => {
    fixtureSync(`
      <mock-component>
        <template></template>
      </mock-component>
    `);

    expect(stub.calledOnce).to.be.true;
    expect(stub.args[0][0]).to.equal(
      'WARNING: <template> inside <mock-component> is deprecated. Use a renderer function instead (see https://vaad.in/template-renderer)',
    );
  });

  it('should show the warning only once per component', () => {
    fixtureSync(`
      <mock-component>
        <template></template>
        <template></template>
      </mock-component>
    `);

    expect(stub.calledOnce).to.be.true;
  });

  it('should suppress the warning for an individual component', () => {
    fixtureSync(`
      <mock-component suppress-template-warning>
        <template></template>
      </mock-component>
    `);

    expect(stub.called).to.be.false;
  });
});
