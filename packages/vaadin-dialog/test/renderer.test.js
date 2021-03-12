import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-dialog.js';

describe('vaadin-dialog renderer', () => {
  describe('without template', () => {
    let dialog, overlay;

    beforeEach(() => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      overlay = dialog.$.overlay;
    });

    it('should render the content of renderer function when renderer function provided', () => {
      dialog.renderer = (root) => {
        const div = document.createElement('div');
        div.textContent = 'The content of the dialog';
        root.appendChild(div);
      };
      dialog.opened = true;

      expect(overlay.textContent).to.include('The content of the dialog');
    });

    it('should remove template when added after renderer', () => {
      dialog.renderer = () => {};
      const template = document.createElement('template');
      expect(() => {
        dialog.appendChild(template);
        dialog._observer.flush();
      }).to.throw(Error);
      expect(dialog._contentTemplate).to.be.not.ok;
    });

    it('should be possible to manually invoke renderer', () => {
      dialog.renderer = sinon.spy();
      dialog.opened = true;
      expect(dialog.renderer.calledOnce).to.be.true;
      dialog.render();
      expect(dialog.renderer.calledTwice).to.be.true;
    });
  });

  describe('with template', () => {
    let dialog, overlay;

    beforeEach(() => {
      dialog = fixtureSync(`
        <vaadin-dialog>
          <template>
            <div>Template content</div>
          </template>
        </vaadin-dialog>
      `);
      overlay = dialog.$.overlay;
    });

    it('should default to template if renderer function not provided', () => {
      dialog.opened = true;
      expect(overlay.textContent).to.include('Template content');
    });

    it('should throw an error when setting a renderer if there is already a template', () => {
      dialog._observer.flush();
      expect(() => (dialog.renderer = () => {})).to.throw(Error);
    });

    it('should remove renderer when added after template', () => {
      dialog._observer.flush();
      expect(() => (dialog.renderer = () => {})).to.throw(Error);
      expect(dialog.renderer).to.be.not.ok;
    });
  });
});
