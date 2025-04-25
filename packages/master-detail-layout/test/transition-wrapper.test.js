import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import '../src/vaadin-master-detail-layout-transition-wrapper.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('Transition wrapper', () => {
  const originalStartViewTransition = document.startViewTransition;

  let layout, wrapper;
  let startViewTransitionSpy, transitionType;

  beforeEach(() => {
    startViewTransitionSpy = sinon.spy();
    document.startViewTransition = (callback) => {
      startViewTransitionSpy();
      transitionType = layout.getAttribute('transition');
      callback();
      return {
        finished: Promise.resolve(),
      };
    };

    const clock = sinon.useFakeTimers();
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <vaadin-master-detail-layout-transition-wrapper></vaadin-master-detail-layout-transition-wrapper>
      </vaadin-master-detail-layout>
    `);
    wrapper = layout.querySelector('vaadin-master-detail-layout-transition-wrapper');
    // Advance time to ensure initialization completes (500ms timeout in connectedCallback)
    clock.tick(500);
    clock.restore();
  });

  after(() => {
    document.startViewTransition = originalStartViewTransition;
  });

  function verifyProperties(wrapper, expectedNodes) {
    // Verify childNodes
    expect(wrapper.childNodes.length).to.equal(expectedNodes.length);
    expect(Array.from(wrapper.childNodes).length).to.equal(expectedNodes.length);
    for (let i = 0; i < expectedNodes.length; i++) {
      expect(wrapper.childNodes[i]).to.equal(expectedNodes[i]);
      expect(wrapper.childNodes.item(i)).to.equal(expectedNodes[i]);
      expect(Array.from(wrapper.childNodes)[i]).to.equal(expectedNodes[i]);
    }

    // Verify firstChild and lastChild
    if (expectedNodes.length === 0) {
      expect(wrapper.firstChild).to.be.null;
      expect(wrapper.lastChild).to.be.null;
    } else {
      expect(wrapper.firstChild).to.equal(expectedNodes[0]);
      expect(wrapper.lastChild).to.equal(expectedNodes[expectedNodes.length - 1]);
    }
  }

  function verifyDomState(wrapper, expectedNodes) {
    const domState = wrapper.__getDomState();

    // Verify actual childNodes
    expect(domState.childNodes.length).to.equal(expectedNodes.length);
    for (let i = 0; i < expectedNodes.length; i++) {
      expect(domState.childNodes[i]).to.equal(expectedNodes[i]);
    }

    // Verify actual firstChild and lastChild
    if (expectedNodes.length === 0) {
      expect(domState.firstChild).to.be.null;
      expect(domState.lastChild).to.be.null;
    } else {
      expect(domState.firstChild).to.equal(expectedNodes[0]);
      expect(domState.lastChild).to.equal(expectedNodes[expectedNodes.length - 1]);
    }
  }

  describe('Custom DOM API', () => {
    it('should initialize from existing child nodes', () => {
      const emptyWrapper = fixtureSync(`
        <vaadin-master-detail-layout-transition-wrapper></vaadin-master-detail-layout-transition-wrapper>
      `);
      verifyProperties(emptyWrapper, []);
      verifyDomState(emptyWrapper, []);

      const wrapperWithContent = fixtureSync(`
        <vaadin-master-detail-layout-transition-wrapper><div></div></vaadin-master-detail-layout-transition-wrapper>
      `);
      const content = wrapperWithContent.querySelector('div');
      verifyProperties(wrapperWithContent, [content]);
      verifyDomState(wrapperWithContent, [content]);
    });

    describe('appendChild', () => {
      it('should append children', async () => {
        const node1 = document.createElement('div');
        wrapper.appendChild(node1);

        verifyProperties(wrapper, [node1]);
        verifyDomState(wrapper, []);

        const node2 = document.createElement('div');
        wrapper.appendChild(node2);

        verifyProperties(wrapper, [node1, node2]);
        verifyDomState(wrapper, []);

        await nextFrame();

        verifyProperties(wrapper, [node1, node2]);
        verifyDomState(wrapper, [node1, node2]);

        const node3 = document.createElement('div');
        wrapper.appendChild(node3);

        verifyProperties(wrapper, [node1, node2, node3]);
        verifyDomState(wrapper, [node1, node2]);

        await nextFrame();

        verifyProperties(wrapper, [node1, node2, node3]);
        verifyDomState(wrapper, [node1, node2, node3]);
      });

      it('should remove node from childNodes if already present', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);
        await nextFrame();

        wrapper.appendChild(node1);

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, [node1, node2]);

        await nextFrame();

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, [node2, node1]);
      });
    });

    describe('insertBefore', () => {
      it('should insert a node before the reference node', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);

        const newNode = document.createElement('div');
        wrapper.insertBefore(newNode, node2);

        verifyProperties(wrapper, [node1, newNode, node2]);
        verifyDomState(wrapper, []);

        await nextFrame();

        verifyProperties(wrapper, [node1, newNode, node2]);
        verifyDomState(wrapper, [node1, newNode, node2]);
      });

      it('should insert at the beginning', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);
        await nextFrame();

        const newNode = document.createElement('div');
        wrapper.insertBefore(newNode, node1);

        verifyProperties(wrapper, [newNode, node1, node2]);
        verifyDomState(wrapper, [node1, node2]);

        await nextFrame();

        verifyProperties(wrapper, [newNode, node1, node2]);
        verifyDomState(wrapper, [newNode, node1, node2]);
      });

      it('should append if reference node is null', async () => {
        const node1 = document.createElement('div');
        wrapper.appendChild(node1);
        await nextFrame();

        const newNode = document.createElement('div');
        wrapper.insertBefore(newNode, null);

        verifyProperties(wrapper, [node1, newNode]);
        verifyDomState(wrapper, [node1]);

        await nextFrame();

        verifyProperties(wrapper, [node1, newNode]);
        verifyDomState(wrapper, [node1, newNode]);
      });

      it('should remove node from childNodes if already present', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);
        await nextFrame();

        wrapper.insertBefore(node2, node1);

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, [node1, node2]);

        await nextFrame();

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, [node2, node1]);
      });
    });

    describe('removeChild', () => {
      it('should remove children', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        const node3 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);
        wrapper.appendChild(node3);
        await nextFrame();

        wrapper.removeChild(node1);
        verifyProperties(wrapper, [node2, node3]);
        verifyDomState(wrapper, [node1, node2, node3]);

        wrapper.removeChild(node3);
        verifyProperties(wrapper, [node2]);
        verifyDomState(wrapper, [node1, node2, node3]);

        await nextFrame();

        verifyProperties(wrapper, [node2]);
        verifyDomState(wrapper, [node2]);
      });

      it('should throw error when removing non-existent node', () => {
        const node = document.createElement('div');
        expect(() => wrapper.removeChild(node)).to.throw('The node to be removed is not a child of this node');
      });
    });

    describe('multiple operations', () => {
      it('should batch multiple operations', async () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        const node3 = document.createElement('div');
        wrapper.appendChild(node1);
        wrapper.appendChild(node2);
        wrapper.appendChild(node3);
        wrapper.removeChild(node1);
        wrapper.removeChild(node3);
        wrapper.appendChild(node1);

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, []);

        await nextFrame();

        verifyProperties(wrapper, [node2, node1]);
        verifyDomState(wrapper, [node2, node1]);
      });
    });

    describe('slot name', () => {
      it('should update slot name asynchronously when content is added or removed', async () => {
        expect(wrapper.getAttribute('slot')).to.equal('detail-hidden');

        const div = document.createElement('div');
        wrapper.appendChild(div);
        expect(wrapper.getAttribute('slot')).to.equal('detail-hidden');

        await nextFrame();

        expect(wrapper.getAttribute('slot')).to.equal('detail');

        wrapper.removeChild(div);
        expect(wrapper.getAttribute('slot')).to.equal('detail');

        await nextFrame();

        expect(wrapper.getAttribute('slot')).to.equal('detail-hidden');
      });
    });
  });

  describe('view transitions', () => {
    it('should start view transition when elements are added or removed', async () => {
      const div1 = document.createElement('div');
      wrapper.appendChild(div1);
      await nextFrame();

      expect(startViewTransitionSpy.calledOnce).to.be.true;

      const div2 = document.createElement('div');
      wrapper.insertBefore(div2, div1);
      await nextFrame();

      expect(startViewTransitionSpy.calledTwice).to.be.true;

      wrapper.removeChild(div1);
      await nextFrame();

      expect(startViewTransitionSpy.calledThrice).to.be.true;
    });

    it('should use the correct transition type', async () => {
      // "add" transition
      const div1 = document.createElement('div');
      wrapper.appendChild(div1);
      await nextFrame();

      expect(transitionType).to.equal('add');
      expect(layout.hasAttribute('transition')).to.be.false;

      // "replace" transition
      const div2 = document.createElement('div');
      wrapper.insertBefore(div2, div1);
      wrapper.removeChild(div1);
      await nextFrame();

      expect(transitionType).to.equal('replace');
      expect(layout.hasAttribute('transition')).to.be.false;

      // "remove" transition
      wrapper.removeChild(div2);
      await nextFrame();

      expect(transitionType).to.equal('remove');
      expect(layout.hasAttribute('transition')).to.be.false;
    });

    it('should not start view transition if wrapper is not used in a layout', async () => {
      const wrapperWithoutLayout = fixtureSync(
        '<vaadin-master-detail-layout-transition-wrapper></vaadin-master-detail-layout-transition-wrapper>',
      );
      const div = document.createElement('div');
      wrapperWithoutLayout.appendChild(div);
      await nextFrame();

      expect(startViewTransitionSpy.called).to.be.false;
    });

    it('should not start view transition if layout has noAnimation set', async () => {
      layout.noAnimation = true;

      const div = document.createElement('div');
      wrapper.appendChild(div);
      await nextFrame();

      expect(startViewTransitionSpy.called).to.be.false;
    });

    it('should not start view transition if wrapper is not in DOM', async () => {
      wrapper.remove();

      const div = document.createElement('div');
      wrapper.appendChild(div);
      await nextFrame();

      expect(startViewTransitionSpy.called).to.be.false;
    });
  });

  describe('initialization', () => {
    beforeEach(() => {
      // Create wrapper that does not wait for initialization
      layout = fixtureSync(`
        <vaadin-master-detail-layout>
          <vaadin-master-detail-layout-transition-wrapper></vaadin-master-detail-layout-transition-wrapper>
        </vaadin-master-detail-layout>
      `);
      wrapper = layout.querySelector('vaadin-master-detail-layout-transition-wrapper');
    });

    it('should update DOM synchronously if component is initializing', () => {
      const div1 = document.createElement('div');
      wrapper.appendChild(div1);

      verifyProperties(wrapper, [div1]);
      verifyDomState(wrapper, [div1]);

      const div2 = document.createElement('div');
      wrapper.insertBefore(div2, div1);

      verifyProperties(wrapper, [div2, div1]);
      verifyDomState(wrapper, [div2, div1]);

      wrapper.removeChild(div1);

      verifyProperties(wrapper, [div2]);
      verifyDomState(wrapper, [div2]);
    });

    it('should update slot name synchronously if component is initializing', () => {
      expect(wrapper.getAttribute('slot')).to.equal('detail-hidden');

      const div = document.createElement('div');
      wrapper.appendChild(div);

      expect(wrapper.getAttribute('slot')).to.equal('detail');

      wrapper.removeChild(div);

      expect(wrapper.getAttribute('slot')).to.equal('detail-hidden');
    });

    it('should not start view transition if component is initializing', () => {
      const div1 = document.createElement('div');
      wrapper.appendChild(div1);

      expect(startViewTransitionSpy.called).to.be.false;

      const div2 = document.createElement('div');
      wrapper.insertBefore(div2, div1);

      expect(startViewTransitionSpy.called).to.be.false;

      wrapper.removeChild(div1);

      expect(startViewTransitionSpy.called).to.be.false;
    });
  });
});
