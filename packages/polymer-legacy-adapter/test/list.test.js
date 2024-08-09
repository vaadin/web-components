import { expect } from '@vaadin/chai-plugins';
import { click, fire, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../template-renderer.js';
import './fixtures/mock-list-host.js';
import './fixtures/mock-list.js';

describe('list', () => {
  let host, list, template;

  function getItemTitle(item) {
    return item.querySelector('.title').textContent;
  }

  function getItemValue(item) {
    return item.querySelector('.value').textContent;
  }

  beforeEach(() => {
    host = fixtureSync(`<mock-list-host></mock-list-host>`);
    list = host.$.list;
    template = host.$.list.querySelector('template');
  });

  it('should render the list', () => {
    expect(list.$.items.children).to.have.lengthOf(2);
    expect(getItemTitle(list.$.items.children[0])).to.equal('title0');
    expect(getItemTitle(list.$.items.children[1])).to.equal('title1');
  });

  it('should handle events from the template instances', () => {
    const spy = sinon.spy(host, 'onClick');

    const button0 = list.$.items.children[0].querySelector('button');
    const button1 = list.$.items.children[1].querySelector('button');

    click(button0);
    click(button1);

    expect(spy.calledTwice).to.be.true;
  });

  it('should re-render the list when removing an item', () => {
    host.items = [{ title: 'new0' }];

    expect(list.$.items.children).to.have.lengthOf(1);
    expect(getItemTitle(list.$.items.children[0])).to.equal('new0');
  });

  it('should create a template instance for each item', () => {
    const templateInstance0 = list.$.items.children[0].__templateInstance;
    const templateInstance1 = list.$.items.children[1].__templateInstance;

    expect(template.__templatizer.__templateInstances).to.include(templateInstance0);
    expect(template.__templatizer.__templateInstances).to.include(templateInstance1);
  });

  it('should support the 2-way property binding', () => {
    const input = list.$.items.children[0].querySelector('input');

    input.value = 'foobar';
    fire(input, 'input');

    expect(host.value).to.equal('foobar');
  });

  it('should re-render the template instances when changing a parent property', () => {
    host.value = 'foobar';

    expect(getItemValue(list.$.items.children[0])).to.equal('foobar');
    expect(getItemValue(list.$.items.children[1])).to.equal('foobar');
  });

  it('should re-render the template instances when changing items', () => {
    host.items = [{ title: 'new0' }, { title: 'new1' }];

    expect(getItemTitle(list.$.items.children[0])).to.equal('new0');
    expect(getItemTitle(list.$.items.children[1])).to.equal('new1');
  });

  it('should re-render the template instances when mutating an item', () => {
    host.items[0].title = 'new0';
    list.render();

    expect(getItemTitle(list.$.items.children[0])).to.equal('new0');
    expect(getItemTitle(list.$.items.children[1])).to.equal('title1');
  });
});
