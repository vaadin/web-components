import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync, fire, click } from '@vaadin/testing-helpers';
import { templatizerPropertyChangedCallback } from '../src/vaadin-template-renderer-templatizer.js';

import '../vaadin-template-renderer.js';

import './fixtures/mock-list-host.js';
import './fixtures/mock-list.js';

describe('list', () => {
  let host, list, template;

  function getItemText(item) {
    return item.querySelector('.item-text').textContent;
  }

  function getItemValueText(item) {
    return item.querySelector('.value-text').textContent;
  }

  beforeEach(() => {
    host = fixtureSync(`<mock-list-host></mock-list-host>`);
    list = host.$.list;
    template = host.$.list.querySelector('template');
  });

  it('should render the list', () => {
    expect(list.$.items.children).to.have.lengthOf(2);
    expect(getItemText(list.$.items.children[0])).to.equal('item1');
    expect(getItemText(list.$.items.children[1])).to.equal('item2');
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
    host.items = ['item1'];

    expect(list.$.items.children).to.have.lengthOf(1);
    expect(getItemText(list.$.items.children[0])).to.equal('item1');
  });

  it('should create a template instance for each item', () => {
    const templateInstance0 = list.$.items.children[0].__templateInstance;
    const templateInstance1 = list.$.items.children[1].__templateInstance;

    expect(template.__templatizer.__templateInstances).to.include(templateInstance0);
    expect(template.__templatizer.__templateInstances).to.include(templateInstance1);
  });

  it('should support the 2-way property binding', () => {
    const input = list.$.items.children[0].querySelector('.value-input');

    input.value = 'foobar';
    fire(input, 'input');

    expect(host.value).to.equal('foobar');
  });

  it('should re-render the template instances when changing a parent property', () => {
    host.value = 'foobar';

    expect(getItemValueText(list.$.items.children[0])).to.equal('foobar');
    expect(getItemValueText(list.$.items.children[1])).to.equal('foobar');
  });

  it('should re-render the template instances when changing items', () => {
    host.items = ['foo', 'bar'];

    expect(getItemText(list.$.items.children[0])).to.equal('foo');
    expect(getItemText(list.$.items.children[1])).to.equal('bar');
  });

  it('should call the callback when changing the template instance property', () => {
    const spy = sinon.spy(list, templatizerPropertyChangedCallback);
    const item = list.$.items.children[0];
    const input = item.querySelector('.item-input');

    input.value = 'foobar';
    fire(input, 'input');

    expect(spy.calledOnce).to.be.true;
    expect(spy.args[0][0]).to.be.equal(item.__templateInstance);
    expect(spy.args[0][1]).to.be.equal('item');
    expect(spy.args[0][2]).to.be.equal('foobar');
  });
});
