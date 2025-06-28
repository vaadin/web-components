import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../src/vaadin-select.js';

describe('items', () => {
  let select, overlay, rendererRoot, listBox;

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select></vaadin-select>`);
    await nextRender();
    select.items = [{ label: 'Option 1', value: 'value-1' }];
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    rendererRoot = select.querySelector('[slot="overlay"]');
    select.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
    listBox = rendererRoot.querySelector('vaadin-select-list-box');
  });

  it('should render items', () => {
    expect(listBox).to.be.ok;
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].localName).to.equal('vaadin-select-item');
    expect(listBox.childNodes[0].textContent).to.equal('Option 1');
    expect(listBox.childNodes[0].value).to.equal('value-1');
    expect(listBox.childNodes[0].disabled).to.be.false;
  });

  it('should re-render items on items property change', async () => {
    select.items = [{ label: 'New Option', value: 'new-value' }];
    await nextUpdate(select);
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].textContent).to.equal('New Option');
    expect(listBox.childNodes[0].value).to.equal('new-value');
  });

  it('should re-render items on content update request', () => {
    select.items[0].value = 'new-value';
    select.requestContentUpdate();
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].value).to.equal('new-value');
  });

  it('should clear the content when setting items property to an empty array', async () => {
    select.items = [];
    await nextUpdate(select);
    expect(rendererRoot.childNodes).to.be.empty;
  });

  it('should clear the content when setting items property to null', async () => {
    select.items = null;
    await nextUpdate(select);
    expect(rendererRoot.childNodes).to.be.empty;
  });

  it('should clear the content when setting items property to undefined', async () => {
    select.items = undefined;
    await nextUpdate(select);
    expect(rendererRoot.childNodes).to.be.empty;
  });

  it('should render item with a custom component', async () => {
    select.items = [{ component: 'hr' }];
    await nextUpdate(select);
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].localName).to.equal('hr');
  });

  it('should render disabled item', async () => {
    select.items = [{ label: 'Option 1', value: 'value-1', disabled: true }];
    await nextUpdate(select);
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].disabled).to.be.true;
  });

  it('should set class name on the rendered item', async () => {
    select.items = [{ label: 'Option 1', value: 'value-1', className: 'red' }];
    await nextUpdate(select);
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].getAttribute('class')).to.equal('red');
  });

  describe('renderer', () => {
    beforeEach(async () => {
      select.renderer = (root) => {
        root.textContent = 'Renderer';
      };
      await nextUpdate(select);
    });

    it('should override content with the renderer', () => {
      expect(rendererRoot.textContent).to.equal('Renderer');
    });

    it('should render items when removing the renderer', async () => {
      select.renderer = null;
      await nextUpdate(select);
      const newListBox = rendererRoot.querySelector('vaadin-select-list-box');
      expect(newListBox).to.be.ok;
      expect(newListBox.childNodes).to.have.lengthOf(1);
      expect(newListBox.childNodes[0].textContent).to.equal('Option 1');
    });
  });
});
