import { expect } from '@esm-bundle/chai';
import { arrowDown, fixtureSync, focusin, focusout, listenOnce, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@vaadin/checkbox-group';
import '@vaadin/date-picker';
import '@vaadin/date-time-picker';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/radio-group';
import '@vaadin/select';
import '@vaadin/text-field';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, render } from 'lit';
import { FieldHighlighter } from '../src/vaadin-field-highlighter.js';

describe('field components', () => {
  let field;
  let overlay;
  let showSpy;
  let hideSpy;

  function getOutline(elem) {
    return elem.shadowRoot.querySelector('[part="outline"]');
  }

  function open(elem, callback) {
    const overlay = elem.$.overlay || elem._overlayElement;
    listenOnce(overlay, 'vaadin-overlay-open', callback);
    arrowDown(elem.focusElement);
  }

  describe('text field', () => {
    beforeEach(() => {
      field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
    });

    it('should dispatch vaadin-highlight-show event on focus', () => {
      field.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on blur', () => {
      field.focus();
      field.blur();
      expect(hideSpy.callCount).to.equal(1);
    });
  });

  describe('date picker', () => {
    beforeEach(() => {
      field = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      FieldHighlighter.init(field);
      overlay = field.$.overlay;
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
    });

    afterEach(() => {
      field.opened && field.close();
    });

    describe('default', () => {
      it('should dispatch vaadin-highlight-show event on focus', () => {
        field.focus();
        expect(showSpy.callCount).to.equal(1);
      });

      it('should dispatch vaadin-highlight-hide event on blur', () => {
        field.focus();
        field.blur();
        expect(hideSpy.callCount).to.equal(1);
      });

      it('should not dispatch vaadin-highlight-hide event on open', (done) => {
        field.focus();
        open(field, () => {
          expect(hideSpy.callCount).to.equal(0);
          done();
        });
      });

      it('should not dispatch vaadin-highlight-hide event on close without blur', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
          field.close();
        });
      });

      it('should not dispatch vaadin-highlight-hide event on close with focus moved to the field', (done) => {
        open(field, async () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
          field.focus();
          field.close();
        });
      });

      it('should not dispatch vaadin-highlight-hide event on re-focusing field', (done) => {
        field.focus();
        open(field, () => {
          focusin(field, overlay);
          afterNextRender(field, () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
        });
      });

      it('should not dispatch second vaadin-highlight-show event on re-focusing field', (done) => {
        field.focus();
        open(field, () => {
          focusout(field);
          focusin(field);
          afterNextRender(field, () => {
            expect(showSpy.callCount).to.equal(1);
            done();
          });
        });
      });

      it('should not dispatch vaadin-highlight-hide event on field blur if opened', (done) => {
        field.focus();
        open(field, () => {
          focusout(field);
          field.focus();
          afterNextRender(field, () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
        });
      });

      it('should dispatch vaadin-highlight-hide event on close after blur', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(1);
            done();
          });
          overlay.focus();
          focusout(overlay);
          field.close();
        });
      });
    });

    describe('fullscreen', () => {
      beforeEach(() => {
        field._fullscreen = true;
      });

      it('should not dispatch vaadin-highlight-show event on focus', () => {
        field.focus();
        expect(showSpy.callCount).to.equal(0);
      });

      it('should dispatch vaadin-highlight-show event on open', (done) => {
        listenOnce(field, 'opened-changed', () => {
          afterNextRender(field, () => {
            expect(showSpy.callCount).to.equal(1);
            done();
          });
        });
        field.focus();
        field.click();
      });
    });
  });

  describe('select', () => {
    beforeEach(() => {
      field = fixtureSync(`<vaadin-select></vaadin-select>`);
      field.renderer = (root) => {
        if (root.firstChild) {
          return;
        }

        render(
          html`
            <vaadin-list-box>
              <vaadin-item>Foo</vaadin-item>
              <vaadin-item>Bar</vaadin-item>
              <vaadin-item>Baz</vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      FieldHighlighter.init(field);
      overlay = field._overlayElement;
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
    });

    describe('default', () => {
      it('should dispatch vaadin-highlight-show event on focus', () => {
        field.focus();
        expect(showSpy.callCount).to.equal(1);
      });

      it('should dispatch vaadin-highlight-hide event on blur', () => {
        field.focus();
        field.blur();
        expect(hideSpy.callCount).to.equal(1);
      });

      it('should not dispatch vaadin-highlight-hide event on open', (done) => {
        field.focus();
        open(field, () => {
          expect(hideSpy.callCount).to.equal(0);
          done();
        });
      });

      it('should not dispatch vaadin-highlight-hide event on select', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
          overlay.querySelector('vaadin-item').click();
        });
      });

      it('should not dispatch vaadin-highlight-hide event on outside click', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(0);
            done();
          });
          overlay.querySelector('vaadin-item').blur();
          document.body.click();
        });
      });

      it('should not dispatch second vaadin-highlight-show event on outside click', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(showSpy.callCount).to.equal(1);
            done();
          });
          overlay.querySelector('vaadin-item').blur();
          document.body.click();
        });
      });
    });

    describe('phone', () => {
      beforeEach(() => {
        field._phone = true;
      });

      it('should dispatch vaadin-highlight-hide event on outside click', (done) => {
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(1);
            done();
          });
          focusout(overlay);
          document.body.click();
        });
      });

      it('should dispatch vaadin-highlight-hide event on select', (done) => {
        field.focus();
        open(field, () => {
          listenOnce(field, 'opened-changed', () => {
            expect(hideSpy.callCount).to.equal(1);
            done();
          });
          overlay.querySelector('vaadin-item').click();
        });
      });
    });
  });

  describe('checkbox group', () => {
    let checkboxes;

    beforeEach(() => {
      field = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="3" label="Checkbox 3"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      checkboxes = Array.from(field.children);
    });

    it('should dispatch vaadin-highlight-show event on checkbox focus', () => {
      checkboxes[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on checkbox blur', () => {
      checkboxes[0].focus();
      checkboxes[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other checkbox focus', async () => {
      checkboxes[0].focus();
      await sendKeys({ press: 'Tab' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other checkbox focus', async () => {
      checkboxes[0].focus();
      await sendKeys({ press: 'Tab' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple checkboxes based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(checkboxes[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(checkboxes[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(checkboxes[2])).opacity).to.equal('0');
    });
  });

  describe('radio group', () => {
    let radios;

    beforeEach(() => {
      field = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button value="1" label="Radio 1"></vaadin-radio-button>
          <vaadin-radio-button value="2" label="Radio 2"></vaadin-radio-button>
          <vaadin-radio-button value="3" label="Radio 3"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      radios = Array.from(field.children);
    });

    it('should dispatch vaadin-highlight-show event on checkbox focus', () => {
      radios[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on checkbox blur', () => {
      radios[0].focus();
      radios[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other radio focus', async () => {
      radios[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other radio focus', async () => {
      radios[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple radios based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(radios[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(radios[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(radios[2])).opacity).to.equal('0');
    });
  });

  describe('date time picker', () => {
    let date;
    let time;

    beforeEach(() => {
      field = fixtureSync(`<vaadin-date-time-picker></vaadin-date-time-picker>`);
      FieldHighlighter.init(field);
      date = field.__inputs[0];
      time = field.__inputs[1];
      overlay = field.$.overlay;
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
    });

    afterEach(() => {
      date.opened && date.close();
    });

    it('should dispatch vaadin-highlight-show event on date picker focus', () => {
      date.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on date picker blur', () => {
      date.focus();
      date.blur();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-show event on time picker focus', () => {
      time.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on time picker blur', () => {
      time.focus();
      time.blur();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on Tab to time picker', async () => {
      date.focus();
      await sendKeys({ press: 'Tab' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on Tab to time picker', async () => {
      date.focus();
      await sendKeys({ press: 'Tab' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on Shift Tab to date picker', async () => {
      time.focus();
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(1);
    });

    it('should dispatch second vaadin-highlight-show event on Shift Tab to date picker', async () => {
      time.focus();
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on overlay focusout to time picker', (done) => {
      date.focus();
      open(date, () => {
        listenOnce(date, 'opened-changed', () => {
          expect(hideSpy.callCount).to.equal(1);
          expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
          done();
        });
        date.$.overlay.focus();
        focusout(date.$.overlay, time);
        date.close();
      });
    });

    it('should set outline on both date and time pickers based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(date)).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(time)).opacity).to.equal('1');
    });
  });

  describe('list-box', () => {
    let items;

    beforeEach(async () => {
      field = fixtureSync(`
        <vaadin-list-box>
          <vaadin-item>Option 1</vaadin-item>
          <vaadin-item>Option 2</vaadin-item>
          <vaadin-item>Option 3</vaadin-item>
        </vaadin-list-box>
      `);
      await nextFrame();
      FieldHighlighter.init(field);
      items = field.items;
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
    });

    it('should dispatch vaadin-highlight-show event on item focus', () => {
      items[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on item blur', () => {
      items[0].focus();
      items[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other item focus', async () => {
      items[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other item focus', async () => {
      items[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple items based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(items[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(items[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(items[2])).opacity).to.equal('0');
    });
  });
});
