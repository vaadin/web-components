import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render, type RenderResult, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import chaiAsPromised from 'chai-as-promised';
import chaiDom from 'chai-dom';
import sinon from 'sinon';
import { MasterDetailLayout, MasterDetailLayoutElement } from '../packages/react-components/src/MasterDetailLayout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

useChaiPlugin(chaiDom);
useChaiPlugin(chaiAsPromised);

describe('MasterDetailLayout', () => {
  let startTransitionSpy: sinon.SinonSpy;
  let finishTransitionSpy: sinon.SinonSpy;
  let result: RenderResult;
  let layout: MasterDetailLayoutElement;

  async function assertDetailsVisible(text: string) {
    await waitFor(() => {
      const detail = layout!.querySelector('[slot="detail"]');
      expect(detail).to.exist;
      expect(detail).to.have.text(text);
    });
  }

  async function assertDetailsHidden() {
    await waitFor(() => {
      const detail = layout!.querySelector('[slot="detail-hidden"]');
      expect(detail).to.exist;
    });
  }

  beforeEach(() => {
    result = render(<MasterDetailLayout></MasterDetailLayout>);
    startTransitionSpy = sinon.spy();
    finishTransitionSpy = sinon.spy();

    layout = document.querySelector('vaadin-master-detail-layout')!;
    expect(layout).to.exist;

    (layout as any)._startTransition = (transitionType: string, callback: () => void) => {
      startTransitionSpy(transitionType);
      callback();
      return Promise.resolve();
    };
    (layout as any)._finishTransition = () => {
      finishTransitionSpy();
      return Promise.resolve();
    };
  });

  it('should render master and detail content', () => {
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Master>
          <div>Master content</div>
        </MasterDetailLayout.Master>
        <MasterDetailLayout.Detail>
          <div>Detail content</div>
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );
    const master = layout!.querySelector('div:not([slot])');
    expect(master).to.exist;
    expect(master).to.have.text('Master content');

    const detail = layout!.querySelector('[slot="detail"]');
    expect(detail).to.exist;
    expect(detail).to.have.text('Detail content');
  });

  it('should toggle visibility of details area when child component type changes', async () => {
    // Render without detail content
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render with detail content
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <div>Detail content</div>
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('Detail content');

    // Render with empty component
    function EmptyComponent() {
      return null;
    }

    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <EmptyComponent />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render with text node
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>Just a text node</MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();
  });

  it('should toggle visibility of details area when content of the same type of child component changes', async () => {
    function Wrapper({ children }: { children?: ReactNode }) {
      return children;
    }

    // Render with empty wrapper
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <Wrapper />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render wrapper with content
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <Wrapper>
            <div>Wrapper content</div>
          </Wrapper>
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('Wrapper content');
  });

  it('should start view transition when detail component changes', async () => {
    function ViewA() {
      return <div>View A</div>;
    }

    function ViewB() {
      return <div>View B</div>;
    }

    // Render initial view - no transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewA />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('View A');
    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();

    // Render same view - no transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewA />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();

    // Render different view - transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewB />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('View B');
    expect(startTransitionSpy.calledOnce).to.be.true;
    startTransitionSpy.resetHistory();

    // Render same view - no transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewB />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();

    // Render without view - transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();
    expect(startTransitionSpy.calledOnce).to.be.true;
    startTransitionSpy.resetHistory();

    // Render with text node - no transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>Just a text node</MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();
  });

  it('should use correct transition type', async () => {
    function ViewA() {
      return <div>View A</div>;
    }

    function ViewB() {
      return <div>View B</div>;
    }

    // Start with empty detail
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    // Add detail
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewA />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('View A');
    expect(startTransitionSpy.calledOnce).to.be.true;
    expect(startTransitionSpy.firstCall.args[0]).to.equal('add');
    startTransitionSpy.resetHistory();

    // Replace detail
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewB />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('View B');
    expect(startTransitionSpy.calledOnce).to.be.true;
    expect(startTransitionSpy.firstCall.args[0]).to.equal('replace');
    startTransitionSpy.resetHistory();

    // Remove detail
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();
    expect(startTransitionSpy.calledOnce).to.be.true;
    expect(startTransitionSpy.firstCall.args[0]).to.equal('remove');
  });

  it('should properly start and finish transitions', async () => {
    // Start without content
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    // Change detail content to trigger transition
    result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <div>New Content</div>
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsVisible('New Content');
    expect(startTransitionSpy.calledOnce).to.be.true;
    expect(finishTransitionSpy.calledOnce).to.be.true;
    expect(startTransitionSpy.calledBefore(finishTransitionSpy)).to.be.true;
  });

  describe('Child validation', () => {
    it('should throw an error for invalid child component type', () => {
      const renderWithInvalidChild = () => {
        render(
          <MasterDetailLayout>
            <div>Unexpected div</div>
            <MasterDetailLayout.Master>Master</MasterDetailLayout.Master>
          </MasterDetailLayout>,
        );
      };
      expect(renderWithInvalidChild).to.throw(
        'Invalid child in MasterDetailLayout. Only <MasterDetailLayout.Master> and <MasterDetailLayout.Detail> components are allowed. Check the component docs for proper usage.',
      );

      const CustomComponent = () => <div>Custom</div>;
      const renderWithInvalidCustomComponent = () => {
        render(
          <MasterDetailLayout>
            <CustomComponent />
            <MasterDetailLayout.Master>Master</MasterDetailLayout.Master>
          </MasterDetailLayout>,
        );
      };
      expect(renderWithInvalidCustomComponent).to.throw(
        'Invalid child in MasterDetailLayout. Only <MasterDetailLayout.Master> and <MasterDetailLayout.Detail> components are allowed. Check the component docs for proper usage.',
      );
    });

    it('should not throw an error when using null, undefined, or text nodes', () => {
      const renderWithNull = () => {
        render(
          <MasterDetailLayout>
            {null}
            {undefined}
            Just a text node
          </MasterDetailLayout>,
        );
      };
      expect(renderWithNull).to.not.throw();
    });
  });
});
