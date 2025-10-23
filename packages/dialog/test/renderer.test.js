import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-dialog.js';

describe('vaadin-dialog renderer', () => {
  let dialog, rendererRoot;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextRender();
  });

  it('should render the content of renderer function when renderer function provided', async () => {
    dialog.renderer = (root) => {
      const div = document.createElement('div');
      div.textContent = 'The content of the dialog';
      root.appendChild(div);
    };
    dialog.opened = true;
    await nextRender();

    rendererRoot = dialog.firstElementChild;
    expect(rendererRoot.textContent).to.include('The content of the dialog');
  });

  it('should run renderers when requesting content update', async () => {
    dialog.renderer = sinon.spy();
    dialog.opened = true;
    await nextRender();

    expect(dialog.renderer.calledOnce).to.be.true;

    dialog.requestContentUpdate();

    expect(dialog.renderer.calledTwice).to.be.true;
  });

  it('should not throw when requesting content update for an unupgraded dialog', () => {
    const dialog = document.createElement('vaadin-dialog');

    expect(() => dialog.requestContentUpdate()).not.to.throw();
  });

  it('should clear the content when removing the renderer', async () => {
    dialog.renderer = (root) => {
      root.innerHTML = 'foo';
    };
    dialog.opened = true;
    await nextRender();

    rendererRoot = dialog.firstElementChild;

    expect(rendererRoot.textContent).to.equal('foo');

    dialog.renderer = null;
    await nextUpdate(dialog);

    expect(rendererRoot.textContent).to.equal('');
  });
});
