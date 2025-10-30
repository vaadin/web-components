import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, keyboardEventFor, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-rich-text-editor.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('accessibility', () => {
  let rte, content, buttons, announcer, editor;

  const flushFormatAnnouncer = () => {
    rte.__debounceAnnounceFormatting?.flush();
  };

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  describe('helper', () => {
    let helper;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
    });

    it('should not have has-helper attribute by default', () => {
      expect(rte.hasAttribute('has-helper')).to.be.false;
    });

    it('should set has-helper attribute when helper text is set', async () => {
      rte.helperText = 'Helper text';
      await nextFrame();
      expect(rte.hasAttribute('has-helper')).to.be.true;
    });

    it('should remove has-helper attribute when helper text is cleared', async () => {
      rte.helperText = 'Helper text';
      await nextFrame();
      rte.helperText = '';
      await nextFrame();
      expect(rte.hasAttribute('has-helper')).to.be.false;
    });

    it('should set id on the lazily added helper element', async () => {
      rte.helperText = 'Helper text';
      await nextFrame();
      helper = rte.querySelector('[slot="helper"]');
      const ID_REGEX = /^helper-vaadin-rich-text-editor-\d+$/u;
      expect(helper.getAttribute('id')).to.match(ID_REGEX);
    });

    it('should add helper to aria-describedby when helper text is set', async () => {
      rte.helperText = 'Helper text';
      await nextFrame();
      helper = rte.querySelector('[slot="helper"]');
      const aria = rte.getAttribute('aria-describedby');
      expect(aria).to.equal(helper.id);
    });

    it('should remove helper from aria-describedby when helper text is cleared', async () => {
      rte.helperText = 'Helper text';
      await nextFrame();
      rte.helperText = '';
      await nextFrame();
      expect(rte.hasAttribute('aria-describedby')).to.be.false;
    });

    describe('shadow DOM', () => {
      let toolbar, editorContent;

      beforeEach(async () => {
        rte = fixtureSync(
          '<vaadin-rich-text-editor label="Title" helper-text="Helper text"></vaadin-rich-text-editor>',
        );
        await nextRender();
        toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
        editorContent = rte.shadowRoot.querySelector('.ql-editor');
      });

      it('should set aria-describedby on host element', () => {
        const describedBy = rte.getAttribute('aria-describedby');
        expect(describedBy).to.be.ok;
        expect(describedBy).to.include('helper-vaadin-rich-text-editor-');
      });

      it('should not set aria-describedby on toolbar', () => {
        const describedBy = toolbar.getAttribute('aria-describedby');
        expect(describedBy).to.not.be.ok;
      });

      it('should set aria-describedby on editor content', () => {
        const describedBy = editorContent.getAttribute('aria-describedby');
        expect(describedBy).to.be.ok;
        expect(describedBy).to.equal('rte-shadow-helper-desc');
      });

      it('should have helper element with the referenced ID', () => {
        const describedBy = rte.getAttribute('aria-describedby');
        expect(describedBy).to.be.ok;
        const helperId = describedBy.split(' ').find((id) => id.includes('helper'));
        expect(helperId).to.be.ok;
        const helperElement = rte.querySelector(`#${helperId}`);

        expect(helperElement).to.be.ok;
        expect(helperElement.textContent.trim()).to.equal('Helper text');

        const shadowHelper = rte.shadowRoot.querySelector('#rte-shadow-helper-desc');
        expect(shadowHelper).to.be.ok;
        expect(shadowHelper.textContent.trim()).to.equal('Helper text');
      });
    });

    describe('slotted', () => {
      beforeEach(async () => {
        rte = fixtureSync(`
          <vaadin-rich-text-editor>
            <div slot="helper">Custom helper</div>
          </vaadin-rich-text-editor>
        `);
        await nextRender();
        helper = rte.querySelector('[slot="helper"]');
      });

      it('should set id on the slotted helper element', () => {
        const ID_REGEX = /^helper-vaadin-rich-text-editor-\d+$/u;
        expect(helper.getAttribute('id')).to.match(ID_REGEX);
      });

      it('should set has-helper attribute with slotted helper', () => {
        expect(rte.hasAttribute('has-helper')).to.be.true;
      });

      it('should not override custom id on the slotted helper', async () => {
        rte = fixtureSync(`
          <vaadin-rich-text-editor>
            <div slot="helper" id="custom-helper">Custom helper</div>
          </vaadin-rich-text-editor>
        `);
        await nextRender();
        helper = rte.querySelector('[slot="helper"]');
        expect(helper.getAttribute('id')).to.equal('custom-helper');
      });
    });
  });

  describe('error message', () => {
    let error;

    describe('when invalid', () => {
      beforeEach(async () => {
        rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
        rte.invalid = true;
        await nextRender();
      });

      it('should not have has-error-message attribute by default', () => {
        expect(rte.hasAttribute('has-error-message')).to.be.false;
      });

      it('should set has-error-message attribute when error message is set', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        expect(rte.hasAttribute('has-error-message')).to.be.true;
      });

      it('should remove has-error-message attribute when error message is cleared', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        rte.errorMessage = '';
        await nextUpdate(rte);
        await nextFrame();
        expect(rte.hasAttribute('has-error-message')).to.be.false;
      });

      it('should set id on the lazily added error element', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        error = rte.querySelector('[slot="error-message"]');
        const ID_REGEX = /^error-message-vaadin-.+-\d+$/u;
        expect(error.getAttribute('id')).to.match(ID_REGEX);
      });

      it('should add error to aria-describedby when field is invalid', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        const aria = rte.getAttribute('aria-describedby');
        expect(aria).to.be.ok;
        expect(aria).to.match(/error-message-vaadin-.+-\d+/u);
      });

      it('should remove error from aria-describedby when field becomes valid', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        rte.invalid = false;
        await nextUpdate(rte);
        await nextFrame();
        expect(rte.hasAttribute('aria-describedby')).to.be.false;
      });

      describe('shadow DOM', () => {
        let toolbar, editorContent;

        beforeEach(async () => {
          rte = fixtureSync(
            '<vaadin-rich-text-editor label="Title" error-message="Error text"></vaadin-rich-text-editor>',
          );
          rte.invalid = true;
          await nextRender();
          toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
          editorContent = rte.shadowRoot.querySelector('.ql-editor');
        });

        it('should set aria-describedby with error ID on host element', () => {
          const describedBy = rte.getAttribute('aria-describedby');
          expect(describedBy).to.be.ok;
          expect(describedBy).to.include('error-message-vaadin-rich-text-editor-');
        });

        it('should not set aria-describedby on toolbar', () => {
          const describedBy = toolbar.getAttribute('aria-describedby');
          expect(describedBy).to.not.be.ok;
        });

        it('should set aria-describedby with error on editor content', () => {
          const describedBy = editorContent.getAttribute('aria-describedby');
          expect(describedBy).to.be.ok;
          expect(describedBy).to.equal('rte-shadow-error-desc');
        });

        it('should have error element with the referenced ID', () => {
          const describedBy = rte.getAttribute('aria-describedby');
          expect(describedBy).to.be.ok;
          const errorId = describedBy.split(' ').find((id) => id.includes('error-message'));
          expect(errorId).to.be.ok;
          const errorElement = rte.querySelector(`#${errorId}`);

          expect(errorElement).to.be.ok;
          expect(errorElement.textContent.trim()).to.include('Error text');

          const shadowError = rte.shadowRoot.querySelector('#rte-shadow-error-desc');
          expect(shadowError).to.be.ok;
          expect(shadowError.textContent.trim()).to.equal('Error text');
        });
      });
    });

    describe('when valid', () => {
      beforeEach(async () => {
        rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
        await nextRender();
      });

      it('should not add error to aria-describedby when field is valid', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        const aria = rte.getAttribute('aria-describedby');
        expect(aria).to.be.null;
      });

      it('should not set has-error-message when field is valid', async () => {
        rte.errorMessage = 'Error message';
        await nextUpdate(rte);
        await nextFrame();
        expect(rte.hasAttribute('has-error-message')).to.be.false;
      });
    });

    describe('slotted', () => {
      beforeEach(async () => {
        rte = fixtureSync(`
          <vaadin-rich-text-editor invalid>
            <div slot="error-message">Custom error</div>
          </vaadin-rich-text-editor>
        `);
        await nextRender();
        error = rte.querySelector('[slot="error-message"]');
      });

      it('should set id on the slotted error element', () => {
        const ID_REGEX = /^error-message-vaadin-rich-text-editor-\d+$/u;
        expect(error.getAttribute('id')).to.match(ID_REGEX);
      });

      it('should set has-error-message attribute with slotted error', () => {
        expect(rte.hasAttribute('has-error-message')).to.be.true;
      });

      it('should not override custom id on the slotted error', async () => {
        rte = fixtureSync(`
          <vaadin-rich-text-editor invalid>
            <div slot="error-message" id="custom-error">Custom error</div>
          </vaadin-rich-text-editor>
        `);
        await nextRender();
        error = rte.querySelector('[slot="error-message"]');
        expect(error.getAttribute('id')).to.equal('custom-error');
      });
    });
  });

  describe('aria-describedby', () => {
    beforeEach(async () => {
      rte = fixtureSync(`
        <vaadin-rich-text-editor helper-text="Helper" error-message="Error">
        </vaadin-rich-text-editor>
      `);
      await nextRender();
    });

    it('should only contain helper id when the field is valid', () => {
      const aria = rte.getAttribute('aria-describedby');
      expect(aria).to.be.ok;
      expect(aria).to.match(/^helper-vaadin-.+-\d+$/u);
      expect(aria).to.not.match(/error-message/u);
    });

    it('should add error id when the field becomes invalid', async () => {
      rte.invalid = true;
      await nextUpdate(rte);
      await nextFrame();
      const aria = rte.getAttribute('aria-describedby');
      expect(aria).to.be.ok;
      expect(aria).to.match(/helper-vaadin-.+-\d+/u);
      expect(aria).to.match(/error-message-vaadin-.+-\d+/u);
    });

    it('should remove error id when the field becomes valid', async () => {
      rte.invalid = true;
      await nextUpdate(rte);
      await nextFrame();
      rte.invalid = false;
      await nextUpdate(rte);
      await nextFrame();
      const aria = rte.getAttribute('aria-describedby');
      expect(aria).to.be.ok;
      expect(aria).to.match(/^helper-vaadin-.+-\d+$/u);
      expect(aria).to.not.match(/error-message/u);
    });

    it('should have both helper and error when invalid', async () => {
      rte.invalid = true;
      await nextUpdate(rte);
      await nextFrame();
      const aria = rte.getAttribute('aria-describedby');
      const ids = aria.split(' ');
      expect(ids).to.have.lengthOf(2);
      expect(aria).to.match(/helper-vaadin-.+-\d+/u);
      expect(aria).to.match(/error-message-vaadin-.+-\d+/u);
    });

    it('should have both helper and error elements accessible', async () => {
      rte.invalid = true;
      await nextUpdate(rte);
      await nextFrame();
      const describedBy = rte.getAttribute('aria-describedby');
      expect(describedBy).to.be.ok;
      const ids = describedBy.split(' ');
      const helperId = ids.find((id) => id.includes('helper'));
      const errorId = ids.find((id) => id.includes('error-message'));

      expect(helperId).to.be.ok;
      expect(errorId).to.be.ok;

      const helperElement = rte.querySelector(`#${helperId}`);
      const errorElement = rte.querySelector(`#${errorId}`);

      expect(helperElement).to.be.ok;
      expect(errorElement).to.be.ok;
      expect(helperElement.textContent.trim()).to.equal('Helper');
      expect(errorElement.textContent.trim()).to.include('Error');
    });
  });

  describe('label', () => {
    let toolbar, editorContent;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
      editorContent = rte.shadowRoot.querySelector('.ql-editor');
    });

    it('should not have aria-labelledby attribute by default', () => {
      expect(rte.hasAttribute('aria-labelledby')).to.be.false;
      expect(toolbar.hasAttribute('aria-labelledby')).to.be.false;
      expect(editorContent.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should set id on the lazily added label element', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      rte.appendChild(label);
      await nextFrame();

      const ID_REGEX = /^label-vaadin-rich-text-editor-\d+$/u;
      expect(label.getAttribute('id')).to.match(ID_REGEX);
    });

    it('should not override custom id on the lazily added label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');
      label.id = 'custom-label';

      rte.appendChild(label);
      await nextFrame();

      expect(label.getAttribute('id')).to.equal('custom-label');
    });

    it('should set aria-labelledby on host, toolbar and editor when adding a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');
      label.textContent = 'Custom Label';

      rte.appendChild(label);
      await nextFrame();
      await nextFrame();

      const labelId = label.id;

      expect(rte.getAttribute('aria-labelledby')).to.equal(labelId);

      expect(toolbar.getAttribute('aria-label')).to.equal('Custom Label');
      expect(editorContent.getAttribute('aria-label')).to.equal('Custom Label');
    });

    it('should remove aria-label from shadow DOM elements when removing a label', async () => {
      const label = document.createElement('label');
      label.setAttribute('slot', 'label');

      rte.appendChild(label);
      await nextFrame();

      rte.removeChild(label);
      await nextFrame();

      expect(rte.hasAttribute('aria-labelledby')).to.be.false;
      expect(toolbar.hasAttribute('aria-label')).to.be.false;
      expect(editorContent.hasAttribute('aria-label')).to.be.false;
    });

    it('should use label property to set aria-label on shadow DOM elements', async () => {
      rte.label = 'Rich Text Editor Label';
      await nextFrame();

      const ariaLabelledBy = rte.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).to.be.ok;
      expect(ariaLabelledBy).to.match(/^label-vaadin-.+-\d+$/u);
      expect(toolbar.getAttribute('aria-label')).to.equal('Rich Text Editor Label');
      expect(editorContent.getAttribute('aria-label')).to.equal('Rich Text Editor Label');
    });

    it('should update aria-label on shadow DOM elements when label property changes', async () => {
      rte.label = 'Initial Label';
      await nextFrame();
      const initialLabelId = rte.getAttribute('aria-labelledby');

      rte.label = 'Updated Label';
      await nextFrame();
      const updatedLabelId = rte.getAttribute('aria-labelledby');

      expect(initialLabelId).to.equal(updatedLabelId);
      expect(updatedLabelId).to.match(/^label-vaadin-.+-\d+$/u);
      expect(toolbar.getAttribute('aria-label')).to.equal('Updated Label');
      expect(editorContent.getAttribute('aria-label')).to.equal('Updated Label');
    });

    it('should remove aria-label when label property is cleared', async () => {
      rte.label = 'Some Label';
      await nextFrame();

      rte.label = '';
      await nextFrame();

      expect(rte.hasAttribute('aria-labelledby')).to.be.false;
      expect(toolbar.hasAttribute('aria-label')).to.be.false;
      expect(editorContent.hasAttribute('aria-label')).to.be.false;
    });

    describe('with string label', () => {
      beforeEach(async () => {
        rte = fixtureSync('<vaadin-rich-text-editor label="Article Content"></vaadin-rich-text-editor>');
        await nextRender();
        toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
        editorContent = rte.shadowRoot.querySelector('.ql-editor');
      });

      it('should set aria-labelledby on host element', () => {
        const labelId = rte.getAttribute('aria-labelledby');
        expect(labelId).to.be.ok;
        expect(labelId).to.match(/^label-vaadin-rich-text-editor-\d+$/u);
      });

      it('should set aria-label on toolbar', () => {
        const label = toolbar.getAttribute('aria-label');
        expect(label).to.equal('Article Content');
      });

      it('should set aria-label on editor content', () => {
        const label = editorContent.getAttribute('aria-label');
        expect(label).to.equal('Article Content');
      });

      it('should all have the same label text', () => {
        const toolbarLabel = toolbar.getAttribute('aria-label');
        const editorLabel = editorContent.getAttribute('aria-label');

        expect(toolbarLabel).to.equal('Article Content');
        expect(editorLabel).to.equal('Article Content');
      });

      it('should have the label element with the referenced ID', () => {
        const labelId = rte.getAttribute('aria-labelledby');
        const labelElement = rte.querySelector(`#${labelId}`);

        expect(labelElement).to.be.ok;
        expect(labelElement.textContent.trim()).to.equal('Article Content');
      });
    });

    describe('with slotted label', () => {
      beforeEach(async () => {
        rte = fixtureSync(`
          <vaadin-rich-text-editor>
            <label slot="label">Custom Label</label>
          </vaadin-rich-text-editor>
        `);
        await nextRender();
        toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
        editorContent = rte.shadowRoot.querySelector('.ql-editor');
      });

      it('should set aria-labelledby on host element', () => {
        const labelId = rte.getAttribute('aria-labelledby');
        expect(labelId).to.be.ok;
      });

      it('should set aria-label on toolbar', () => {
        const label = toolbar.getAttribute('aria-label');
        expect(label).to.equal('Custom Label');
      });

      it('should set aria-label on editor content', () => {
        const label = editorContent.getAttribute('aria-label');
        expect(label).to.equal('Custom Label');
      });

      it('should reference the slotted label element', () => {
        const labelId = rte.getAttribute('aria-labelledby');
        const slottedLabel = rte.querySelector('label[slot="label"]');

        expect(slottedLabel).to.be.ok;
        expect(slottedLabel.id).to.equal(labelId);
        expect(slottedLabel.textContent).to.equal('Custom Label');
      });
    });

    describe('updates', () => {
      beforeEach(async () => {
        rte = fixtureSync('<vaadin-rich-text-editor label="Initial"></vaadin-rich-text-editor>');
        await nextRender();
        toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
        editorContent = rte.shadowRoot.querySelector('.ql-editor');
      });

      it('should update aria-label on shadow DOM elements when label changes', async () => {
        const initialHostId = rte.getAttribute('aria-labelledby');
        const initialToolbarLabel = toolbar.getAttribute('aria-label');
        const initialEditorLabel = editorContent.getAttribute('aria-label');

        expect(initialToolbarLabel).to.equal('Initial');
        expect(initialEditorLabel).to.equal('Initial');

        rte.label = 'Updated Label';
        await nextFrame();

        const updatedHostId = rte.getAttribute('aria-labelledby');
        const updatedToolbarLabel = toolbar.getAttribute('aria-label');
        const updatedEditorLabel = editorContent.getAttribute('aria-label');

        expect(updatedHostId).to.equal(initialHostId);

        expect(updatedToolbarLabel).to.equal('Updated Label');
        expect(updatedEditorLabel).to.equal('Updated Label');

        const labelElement = rte.querySelector(`#${updatedHostId}`);
        expect(labelElement.textContent.trim()).to.equal('Updated Label');
      });
    });
  });

  describe('screen readers', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      content = rte.shadowRoot.querySelector('[contenteditable]');
      announcer = rte.shadowRoot.querySelector('[aria-live=polite]');
    });

    it('should have aria-label for the buttons', () => {
      buttons.forEach((button, index) => {
        const expectedLabel = rte.i18n[Object.keys(rte.i18n)[index]];
        expect(button.ariaLabel).to.equal(expectedLabel);
      });
    });

    it('should localize aria-label for the buttons', async () => {
      const defaultI18n = rte.i18n;

      const localized = {};
      Object.keys(defaultI18n).forEach((key) => {
        localized[key] = `${defaultI18n[key]} localized`;
      });
      rte.i18n = localized;
      await nextUpdate(rte);

      buttons.forEach((button, index) => {
        const expectedLabel = `${defaultI18n[Object.keys(defaultI18n)[index]]} localized`;
        expect(button.ariaLabel).to.equal(expectedLabel);
      });
    });

    it('should have an invisible aria-live element', () => {
      const clip = getComputedStyle(announcer).clip;
      expect(clip).to.equal('rect(0px, 0px, 0px, 0px)');
    });

    it('should have textbox role', () => {
      expect(content.getAttribute('role')).to.equal('textbox');
    });

    it('should be decorated with aria-multiline', () => {
      expect(content.getAttribute('aria-multiline')).to.equal('true');
    });

    it('should announce the default formatting', () => {
      rte.value = '[{"insert": "foo "}, {"attributes": {"bold": true}, "insert": "bar"}, {"insert": "\\n"}]';
      editor.setSelection(1, 1);
      flushFormatAnnouncer();
      expect(announcer.textContent).to.equal('align left');
    });

    it('should announce custom formatting', (done) => {
      rte.value = '[{"insert": "foo "}, {"attributes": {"bold": true}, "insert": "bar"}, {"insert": "\\n"}]';
      editor.on('selection-change', () => {
        flushFormatAnnouncer();
        if (announcer.textContent === 'bold, align left') {
          done();
        }
      });
      editor.setSelection(5, 1);
    });

    it('should have role toolbar on the toolbar', () => {
      const toolbar = rte.shadowRoot.querySelector('[part=toolbar]');
      expect(toolbar.getAttribute('role')).to.be.equal('toolbar');
    });
  });

  describe('toolbar navigation', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should have only one tabbable button in toolbar', () => {
      const tabbables = rte.shadowRoot.querySelectorAll(`[part=toolbar] button:not([tabindex="-1"])`);
      expect(tabbables.length).to.equal(1);
      expect(tabbables[0]).to.eql(buttons[0]);
    });

    it('should focus the next button on right-arrow', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      const e = keyboardEventFor('keydown', 39);
      buttons[buttons.length - 1].dispatchEvent(e);
    });

    it('should focus the previous button on left-arrow', (done) => {
      sinon.stub(buttons[buttons.length - 1], 'focus').callsFake(done);
      const e = keyboardEventFor('keydown', 37);
      buttons[0].dispatchEvent(e);
    });

    it('should change the tabbable button on arrow navigation', () => {
      const e = keyboardEventFor('keydown', 39);
      buttons[0].dispatchEvent(e);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
      expect(buttons[1].getAttribute('tabindex')).not.to.be.ok;
    });

    // This is a common pattern in popular rich text editors so users might expect
    // the combo to work. The toolbar is still accessible with the tab key normally.
    it('should focus a toolbar button on meta-f10 combo', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      editor.focus();
      const e = keyboardEventFor('keydown', 121, ['alt'], 'F10');
      content.dispatchEvent(e);
    });

    it('should focus a toolbar button on shift-tab combo', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift'], 'Tab');
      content.dispatchEvent(e);
    });

    it('should mark toolbar as focused before focusing it on shift-tab', (done) => {
      const spy = sinon.spy(rte, '_markToolbarFocused');
      sinon.stub(buttons[0], 'focus').callsFake(() => {
        expect(spy.calledOnce).to.be.true;
        done();
      });
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift'], 'Tab');
      content.dispatchEvent(e);
    });

    it('should prevent keydown and focus the editor on esc', (done) => {
      sinon.stub(editor, 'focus').callsFake(done);
      const e = new CustomEvent('keydown', { bubbles: true });
      e.keyCode = 27;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // DispatchEvent returns false when preventDefault is called
    });

    it('should prevent keydown and focus the editor on tab', (done) => {
      sinon.stub(editor, 'focus').callsFake(done);
      const e = new CustomEvent('keydown', { bubbles: true });
      e.keyCode = 9;
      e.key = 'Tab';
      e.shiftKey = false;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // DispatchEvent returns false when preventDefault is called
    });
  });

  describe('lists', () => {
    const getListItems = () => rte.shadowRoot.querySelectorAll('.ql-editor li');

    const getListItemsWithIndent = (indentLevel) =>
      rte.shadowRoot.querySelectorAll(`.ql-editor li.ql-indent-${indentLevel}`);

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should create new list item on enter', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ type: 'Item 2' });
      flushValueDebouncer();

      expect(getListItems()).to.have.length(2);
      expect(rte.htmlValue).to.include('Item 1');
      expect(rte.htmlValue).to.include('Item 2');
      expect(rte.htmlValue).to.equal('<ul><li>Item 1</li><li>Item 2</li></ul>');
    });

    it('should exit list on double enter', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ type: 'Some input' });
      flushValueDebouncer();

      expect(getListItems()).to.have.length(1);
      expect(rte.htmlValue).to.equal('<ul><li>Item 1</li></ul><p>Some input</p>');
    });

    it('should increase list indentation with Tab', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 2' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 3' });
      flushValueDebouncer();

      for (let indentLevel = 1; indentLevel < 3; indentLevel++) {
        const indentedItems = getListItemsWithIndent(indentLevel);
        expect(indentedItems).to.have.length(1);
        expect(indentedItems[0].textContent.trim()).to.equal(`Item ${indentLevel + 1}`);
        expect(indentedItems[0].classList.contains(`ql-indent-${indentLevel}`)).to.be.true;
      }
      expect(rte.htmlValue).to.equal('<ul><li>Item 1<ul><li>Item 2<ul><li>Item 3</li></ul></li></ul></li></ul>');
    });

    it('should decrease list indentation with Shift + Tab', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 2' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 3' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Shift+Tab' });
      await sendKeys({ type: 'Item 4' });
      flushValueDebouncer();

      const indentedItems = getListItemsWithIndent(1);
      expect(indentedItems).to.have.length(2);
      expect(indentedItems[0].textContent.trim()).to.equal('Item 2');
      expect(indentedItems[0].classList.contains('ql-indent-1')).to.be.true;
      expect(indentedItems[1].textContent.trim()).to.equal('Item 4');
      expect(indentedItems[1].classList.contains('ql-indent-1')).to.be.true;
      expect(rte.htmlValue).to.equal(
        '<ul><li>Item 1<ul><li>Item 2<ul><li>Item 3</li></ul></li><li>Item 4</li></ul></li></ul>',
      );
    });

    it('should focus the toolbar on Shift + Tab at the end of the list item', async () => {
      const button = rte.shadowRoot.querySelector('[part=toolbar] button');
      const spy = sinon.stub(button, 'focus');
      rte.value = '[{"attributes":{"list":"bullet"},"insert":"Foo\\n"}]';
      editor.focus();
      editor.setSelection(3, 0);
      await sendKeys({ press: 'Shift+Tab' });
      expect(spy).to.be.calledOnce;
    });
  });

  describe('indent', () => {
    let indent;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      indent = rte.shadowRoot.querySelector('#btn-indent');
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should represent indentation correctly', async () => {
      editor.focus();
      indent.click();

      await sendKeys({ type: 'Indent 1' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Indent 2' });
      flushValueDebouncer();

      expect(rte.value).to.equal(
        JSON.stringify([
          { insert: 'Indent 1' },
          { attributes: { indent: 1 }, insert: '\n' },
          { insert: 'Indent 2' },
          { attributes: { indent: 2 }, insert: '\n' },
        ]),
      );
      expect(content.innerHTML).to.equal('<p class="ql-indent-1">Indent 1</p><p class="ql-indent-2">Indent 2</p>');
      expect(rte.htmlValue).to.equal('<p>\tIndent 1</p><p>\t\tIndent 2</p>');
    });

    it('should handle empty indented elements', () => {
      rte.value = JSON.stringify([
        { insert: 'Before\n' },
        { insert: '\n', attributes: { indent: 1 } },
        { insert: '\n', attributes: { indent: 2 } },
        { insert: 'After\n' },
      ]);
      expect(rte.htmlValue).to.equal('<p>Before</p><p>\t</p><p>\t\t</p><p>After</p>');
    });

    it('should handle indentation with alignment', () => {
      rte.value = JSON.stringify([
        { insert: 'Normal\n' },
        { insert: 'Indented and aligned\n', attributes: { indent: 1, align: 'center' } },
        { insert: 'More indented\n', attributes: { indent: 2 } },
      ]);
      expect(rte.htmlValue).to.equal(
        '<p>Normal</p><p style="text-align: center">\tIndented and aligned</p><p>\t\tMore indented</p>',
      );
    });

    it('should preserve existing tab characters in content', () => {
      rte.dangerouslySetHtmlValue('<p>Already has\ttab</p><p class="ql-indent-1">Needs indent</p>');
      flushValueDebouncer();
      expect(rte.htmlValue).to.include('Already has\ttab');
      expect(rte.htmlValue).to.include('\tNeeds indent');
      expect(rte.htmlValue).to.not.include('ql-indent');
    });

    it('should handle high indentation levels', () => {
      rte.value = JSON.stringify([
        { insert: 'Level 7\n', attributes: { indent: 7 } },
        { insert: 'Level 8\n', attributes: { indent: 8 } },
      ]);
      expect(rte.htmlValue).to.include(`${'\t'.repeat(7)}Level 7`);
      expect(rte.htmlValue).to.include(`${'\t'.repeat(8)}Level 8`);
    });
  });

  describe('code block', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should change indentation on Tab in the code block', async () => {
      rte.value = '[{"insert":"foo"},{"attributes":{"code-block":true},"insert":"\\n"}]';
      editor.focus();
      await sendKeys({ press: 'Tab' });
      flushValueDebouncer();
      expect(rte.value).to.equal('[{"insert":"  foo"},{"attributes":{"code-block":true},"insert":"\\n"}]');
    });

    it('should change indentation on Shift + Tab in the code block', async () => {
      rte.value = '[{"insert":"  foo"},{"attributes":{"code-block":true},"insert":"\\n"}]';
      editor.focus();
      editor.setSelection(2, 0);
      await sendKeys({ press: 'Shift+Tab' });
      flushValueDebouncer();
      expect(rte.value).to.equal('[{"insert":"foo"},{"attributes":{"code-block":true},"insert":"\\n"}]');
    });
  });

  describe('Tab behavior', () => {
    let lastGlobalFocusable;

    beforeEach(async () => {
      [rte, lastGlobalFocusable] = fixtureSync(
        `<div>
          <vaadin-rich-text-editor></vaadin-rich-text-editor>
          <input id="last-global-focusable" />
        </div>`,
      ).children;
      await nextRender();
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      editor = rte._editor;
      editor.focus();
    });

    it('should move focus to next element after esc followed by tab are pressed', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);
    });

    it('should move focus to the first toolbar button after esc followed by shift-tab are pressed', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore default Tab behavior after multiple Esc and then Tab', async () => {
      // Hitting Escape multiple times and Tab should move focus to next element
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);

      // Checking that default Tab behavior is restored
      editor.focus();
      await sendKeys({ press: 'Tab' });
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal('<p>\t</p>');
    });
  });

  describe('required indicator', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor label="Title" required></vaadin-rich-text-editor>');
      await nextRender();
    });

    it('should have required attribute on host', () => {
      expect(rte.hasAttribute('required')).to.be.true;
    });

    it('should have required indicator element', () => {
      const indicator = rte.shadowRoot.querySelector('[part="required-indicator"]');
      expect(indicator).to.exist;
    });

    it('should have required indicator visible', () => {
      const indicator = rte.shadowRoot.querySelector('[part="required-indicator"]');
      expect(indicator).to.be.ok;

      const display = getComputedStyle(indicator).display;
      expect(display).to.not.equal('none');
    });

    it('should have aria-hidden on required indicator', () => {
      const indicator = rte.shadowRoot.querySelector('[part="required-indicator"]');
      expect(indicator.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('toolbar role', () => {
    let toolbar;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor label="Editor"></vaadin-rich-text-editor>');
      await nextRender();
      toolbar = rte.shadowRoot.querySelector('[part="toolbar"]');
    });

    it('should have role="toolbar" on toolbar element', () => {
      expect(toolbar.getAttribute('role')).to.equal('toolbar');
    });

    it('should have aria-label on toolbar', () => {
      const label = toolbar.getAttribute('aria-label');
      expect(label).to.equal('Editor');
    });
  });

  describe('editor content attributes', () => {
    let editorContent;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor label="Editor"></vaadin-rich-text-editor>');
      await nextRender();
      editorContent = rte.shadowRoot.querySelector('.ql-editor');
    });

    it('should have contenteditable on editor', () => {
      expect(editorContent.getAttribute('contenteditable')).to.equal('true');
    });

    it('should have aria-label on editor', () => {
      const label = editorContent.getAttribute('aria-label');
      expect(label).to.equal('Editor');
    });
  });
});
