import { expect } from '@esm-bundle/chai';
import { click, fixtureSync, makeSoloTouchEvent, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-upload.js';
import { createFile } from './helpers.js';

describe('slots', () => {
  let upload;

  beforeEach(async () => {
    upload = fixtureSync(`<vaadin-upload></vaadin-upload>`);
    await nextRender();
  });

  describe('add button', () => {
    let addButton, input, inputClickSpy;

    function initInput() {
      // While the synthetic "Add Files" button click event is not trusted and
      // it should generate a non-trusted click event on the hidden file input,
      // at the time of writing Chrome and Firefox still open the file dialog.
      // Use stub calling `preventDefault` to prevent dialog from opening.
      inputClickSpy = sinon.stub().callsFake((e) => e.preventDefault());
      input.addEventListener('click', inputClickSpy);
    }

    function runAddButtonTests(type) {
      it(`should open file dialog on ${type} button click`, () => {
        click(addButton);
        expect(inputClickSpy.calledOnce).to.be.true;
      });

      it(`should open file dialog on ${type} button touchend`, () => {
        const event = makeSoloTouchEvent('touchend', null, addButton);
        expect(inputClickSpy.calledOnce).to.be.true;
        expect(event.defaultPrevented).to.be.true;
      });

      it(`should reset file input value on ${type} button click`, () => {
        // We can't simply assign `files` property of input[type="file"].
        // Tweaking __proto__ to make it assignable below.
        Object.setPrototypeOf(input, HTMLElement.prototype);
        delete input.value;
        input.value = 'foo';

        click(addButton);
        expect(input.value).to.be.empty;
      });

      it(`should disable the ${type} button when max files added`, () => {
        // Enabled with default maxFiles value
        expect(addButton.disabled).to.be.false;

        upload.maxFiles = 1;
        expect(addButton.disabled).to.be.false;

        upload._addFile(createFile(100, 'image/jpeg'));
        expect(addButton.disabled).to.be.true;
      });

      it(`should not open dialog on ${type} button click when max files added`, () => {
        upload.maxFiles = 0;
        click(addButton);
        expect(inputClickSpy.called).to.be.false;
      });
    }

    describe('default', () => {
      beforeEach(() => {
        addButton = upload.querySelector('[slot="add-button"]');
      });

      describe('text content', () => {
        it('should set default button text content', () => {
          expect(addButton.textContent).to.be.equal('Upload Files...');
        });

        it('should update default button text on max files change', () => {
          upload.maxFiles = 1;
          expect(addButton.textContent).to.be.equal('Upload File...');
        });
      });

      describe('interaction', () => {
        beforeEach(() => {
          input = upload.$.fileInput;
          initInput();
        });

        runAddButtonTests('default');
      });
    });

    describe('custom', () => {
      beforeEach(() => {
        addButton = document.createElement('button');
        addButton.setAttribute('slot', 'add-button');
        addButton.textContent = 'Add';
      });

      describe('text content', () => {
        it('should not modify custom button text content', async () => {
          upload.appendChild(addButton);
          await nextRender();
          expect(addButton.textContent).to.be.equal('Add');
        });

        it('should not modify custom button text on max files change', async () => {
          upload.appendChild(addButton);
          await nextRender();

          upload.maxFiles = 1;
          expect(addButton.textContent).to.be.equal('Add');
        });

        it('should modify custom button text content if marked as default', async () => {
          // Mimic the Flow counterpart logic
          addButton._isDefault = true;

          upload.appendChild(addButton);
          await nextRender();
          expect(addButton.textContent).to.be.equal('Upload Files...');

          upload.maxFiles = 1;
          expect(addButton.textContent).to.be.equal('Upload File...');
        });
      });

      describe('interaction', () => {
        beforeEach(async () => {
          input = upload.$.fileInput;
          initInput();

          upload.appendChild(addButton);
          await nextRender();
        });

        runAddButtonTests('custom');
      });
    });
  });

  describe('drop label', () => {
    let dropLabel;

    describe('default', () => {
      beforeEach(() => {
        dropLabel = upload.querySelector('[slot="drop-label"]');
      });

      it('should set default drop label text content', () => {
        expect(dropLabel.textContent).to.be.equal('Drop files here');
      });

      it('should update default drop label text on max files change', () => {
        upload.maxFiles = 1;
        expect(dropLabel.textContent).to.be.equal('Drop file here');
      });
    });

    describe('custom', () => {
      beforeEach(() => {
        dropLabel = document.createElement('strong');
        dropLabel.setAttribute('slot', 'drop-label');
        dropLabel.textContent = 'Drop image here';
      });

      it('should not modify custom drop label text content', async () => {
        upload.appendChild(dropLabel);
        await nextRender();
        expect(dropLabel.textContent).to.be.equal('Drop image here');
      });

      it('should not modify custom label text on max files change', async () => {
        upload.appendChild(dropLabel);
        await nextRender();

        upload.maxFiles = 1;
        expect(dropLabel.textContent).to.be.equal('Drop image here');
      });

      it('should modify custom label text content if marked as default', async () => {
        // Mimic the Flow counterpart logic
        dropLabel._isDefault = true;

        upload.appendChild(dropLabel);
        await nextRender();
        expect(dropLabel.textContent).to.be.equal('Drop files here');

        upload.maxFiles = 1;
        expect(dropLabel.textContent).to.be.equal('Drop file here');
      });
    });
  });
});
