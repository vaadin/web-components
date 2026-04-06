import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, type RenderResult } from 'vitest-browser-react';
import type { ReactNode } from 'react';
import sinon from 'sinon';
import { LitElement, html } from 'lit';
import { MasterDetailLayout, MasterDetailLayoutElement } from '../packages/react-components/src/MasterDetailLayout.js';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'test-lit-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

class TestLitElement extends LitElement {
  override render() {
    return html`<div style="width: 200px">Lit Content</div>`;
  }
}

customElements.define('test-lit-element', TestLitElement);

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('MasterDetailLayout', () => {
  let startTransitionSpy: sinon.SinonSpy;
  let result: RenderResult;
  let layout: MasterDetailLayoutElement;

  async function assertDetailsVisible(text: string) {
    await vi.waitFor(() => {
      const detail = layout!.querySelector('[slot="detail"]');
      expect(detail).to.exist;
      expect(detail).to.have.text(text);
    });
  }

  async function assertDetailsHidden() {
    await vi.waitFor(() => {
      const detail = layout!.querySelector('[slot="detail-hidden"]');
      expect(detail).to.exist;
    });
  }

  beforeEach(async () => {
    result = await render(<MasterDetailLayout></MasterDetailLayout>);
    startTransitionSpy = sinon.spy();

    layout = document.querySelector('vaadin-master-detail-layout')!;
    expect(layout).to.exist;

    (layout as any)._startTransition = (transitionType: string, callback: () => void) => {
      startTransitionSpy(transitionType);
      callback();
      return Promise.resolve();
    };
  });

  it('should render master and detail content', async () => {
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render with detail content
    await result.rerender(
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

    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <EmptyComponent />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render with text node
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <Wrapper />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();

    // Render wrapper with content
    await result.rerender(
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
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewA />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();

    // Render different view - transition
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <ViewB />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    expect(startTransitionSpy.called).to.be.false;
    startTransitionSpy.resetHistory();

    // Render without view - transition
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();
    expect(startTransitionSpy.calledOnce).to.be.true;
    startTransitionSpy.resetHistory();

    // Render with text node - no transition
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    // Add detail
    await result.rerender(
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
    await result.rerender(
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
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    await assertDetailsHidden();
    expect(startTransitionSpy.calledOnce).to.be.true;
    expect(startTransitionSpy.firstCall.args[0]).to.equal('remove');
  });

  it('should call recalculateLayout after Lit elements have rendered', async () => {
    // Use the real _startTransition
    delete (layout as any)._startTransition;

    layout.style.width = '800px';

    // Start without content
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail />
      </MasterDetailLayout>,
    );

    // Add a Lit element as detail content. Its intrinsic width should be measured
    // correctly only if recalculateLayout is called after the Lit element renders.
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Detail>
          <test-lit-element />
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>,
    );

    const litElement = layout.querySelector('test-lit-element') as TestLitElement;
    await vi.waitFor(() => {
      expect(litElement.shadowRoot!.querySelector('div')).to.exist;
    });

    expect(getComputedStyle(layout).getPropertyValue('--_detail-cached-size')).to.equal('201px'); // 1px border
  });

  it('should render detail placeholder content', async () => {
    await result.rerender(
      <MasterDetailLayout>
        <MasterDetailLayout.Master>
          <div>Master content</div>
        </MasterDetailLayout.Master>
        <MasterDetailLayout.DetailPlaceholder>
          <div>Select an item</div>
        </MasterDetailLayout.DetailPlaceholder>
      </MasterDetailLayout>,
    );

    await vi.waitFor(() => {
      const placeholder = layout!.querySelector('[slot="detail-placeholder"]');
      expect(placeholder).to.exist;
      expect(placeholder).to.have.text('Select an item');
    });
  });

  it('should not throw an error when using DetailPlaceholder', async () => {
    await render(
      <MasterDetailLayout>
        <MasterDetailLayout.Master>Master</MasterDetailLayout.Master>
        <MasterDetailLayout.Detail />
        <MasterDetailLayout.DetailPlaceholder>Placeholder</MasterDetailLayout.DetailPlaceholder>
      </MasterDetailLayout>,
    );
  });

  describe('Child validation', () => {
    it('should throw an error for invalid child component type', async () => {
      await expect(
        render(
          <MasterDetailLayout>
            <div>Unexpected div</div>
            <MasterDetailLayout.Master>Master</MasterDetailLayout.Master>
          </MasterDetailLayout>,
        ),
      ).to.be.rejectedWith(
        'Invalid child in MasterDetailLayout. Only <MasterDetailLayout.Master>, <MasterDetailLayout.Detail>, and <MasterDetailLayout.DetailPlaceholder> components are allowed. Check the component docs for proper usage.',
      );

      const CustomComponent = () => <div>Custom</div>;
      await expect(
        render(
          <MasterDetailLayout>
            <CustomComponent />
            <MasterDetailLayout.Master>Master</MasterDetailLayout.Master>
          </MasterDetailLayout>,
        ),
      ).to.be.rejectedWith(
        'Invalid child in MasterDetailLayout. Only <MasterDetailLayout.Master>, <MasterDetailLayout.Detail>, and <MasterDetailLayout.DetailPlaceholder> components are allowed. Check the component docs for proper usage.',
      );
    });

    it('should not throw an error when using null, undefined, or text nodes', async () => {
      await render(
        <MasterDetailLayout>
          {null}
          {undefined}
          Just a text node
        </MasterDetailLayout>,
      );
    });
  });
});
