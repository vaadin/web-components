import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import { FieldHighlighter } from '../src/vaadin-field-highlighter.js';

const user1 = { id: 'a', name: 'foo', colorIndex: 0 };
const user2 = { id: 'b', name: 'var', colorIndex: 1 };
const user3 = { id: 'c', name: 'baz', colorIndex: 2 };

describe('user-tags', () => {
  let field;
  let wrapper;

  const getTags = () => {
    const { overlay } = wrapper.$;
    return overlay.content.querySelectorAll('vaadin-user-tag');
  };

  const addUser = (user) => {
    FieldHighlighter.addUser(field, user);
    wrapper.requestContentUpdate();
  };

  const removeUser = (user) => {
    FieldHighlighter.removeUser(field, user);
    wrapper.requestContentUpdate();
  };

  const setUsers = (users) => {
    FieldHighlighter.setUsers(field, users);
    wrapper.requestContentUpdate();
  };

  describe('default', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      FieldHighlighter.init(field);
      wrapper = field.shadowRoot.querySelector('vaadin-user-tags');
      wrapper.duration = 0;
      wrapper.delay = 0;
    });

    it('should create user tags for each added user', async () => {
      addUser(user1);
      addUser(user2);
      await wrapper.flashPromise;
      const tags = getTags();
      expect(tags).to.have.lengthOf(2);
    });

    it('should replace user tags when replacing users', async () => {
      setUsers([user1, user2]);
      await wrapper.flashPromise;
      setUsers([user3]);
      await wrapper.flashPromise;
      const tags = getTags();
      expect(tags).to.have.lengthOf(1);
    });
  });

  describe('opened', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      FieldHighlighter.init(field);
      wrapper = field.shadowRoot.querySelector('vaadin-user-tags');
      wrapper.duration = 0;
      wrapper.delay = 0;
      wrapper.show();
    });

    it('should create user tags for each added user', () => {
      addUser(user1);
      addUser(user2);
      const tags = getTags();
      expect(tags).to.have.lengthOf(2);
    });

    it('should remove user tag when user is removed', () => {
      addUser(user1);
      addUser(user2);
      removeUser(user2);
      const tags = getTags();
      expect(tags).to.have.lengthOf(1);
    });

    it('should replace user tags when replacing users', async () => {
      setUsers([user1, user2]);
      setUsers([user3]);
      const tags = getTags();
      expect(tags).to.have.lengthOf(1);
    });

    it('should set tag background color based on user index', () => {
      setUsers([user1, user2]);
      const tags = getTags();
      document.documentElement.style.setProperty('--vaadin-user-color-0', 'red');
      document.documentElement.style.setProperty('--vaadin-user-color-1', 'blue');
      expect(getComputedStyle(tags[0]).backgroundColor).to.equal('rgb(0, 0, 255)');
      expect(getComputedStyle(tags[1]).backgroundColor).to.equal('rgb(255, 0, 0)');
    });

    it('should not set custom property if index is null', () => {
      addUser({ name: 'xyz', colorIndex: null });
      const tags = getTags();
      expect(getComputedStyle(tags[0]).getPropertyValue('--vaadin-user-tag-color')).to.equal('');
    });

    it('should dispatch event on tag mousedown', () => {
      addUser(user1);
      const tag = getTags()[0];
      const spy = sinon.spy();
      tag.addEventListener('user-tag-click', spy);
      tag.dispatchEvent(new Event('mousedown'));
      expect(spy.callCount).to.equal(1);
    });

    it('should reuse existing user tag when user is moved', () => {
      setUsers([user3, user2]);
      const oldTags = getTags();
      setUsers([user1, user2, user3]);
      const newTags = getTags();
      // ['b', 'c'] -> ['a', 'b', 'c']
      expect(newTags[1].id).to.deep.equal(oldTags[0].id);
      expect(newTags[2].id).to.deep.equal(oldTags[1].id);
    });

    it('should handle pending changes properly', () => {
      FieldHighlighter.setUsers(field, [user3, user2]);
      field.dispatchEvent(new CustomEvent('focusin'));
      FieldHighlighter.setUsers(field, []);
      wrapper.requestContentUpdate();
      expect(getTags()).to.have.lengthOf(0);
    });
  });

  describe('closed', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      FieldHighlighter.init(field);
      wrapper = field.shadowRoot.querySelector('vaadin-user-tags');
      wrapper.duration = 0;
      wrapper.delay = 0;
      wrapper.show();
      setUsers([user2, user3]);
      wrapper.hide();
      wrapper.$.overlay._flushAnimation('closing');
    });

    it('should render and hide all tags except new ones', async () => {
      FieldHighlighter.setUsers(field, [user1, user2, user3]);
      await oneEvent(wrapper.$.overlay, 'vaadin-overlay-open');
      const tags = getTags();
      expect(tags).to.have.lengthOf(3);
      expect(getComputedStyle(tags[0]).display).to.equal('block');
      expect(getComputedStyle(tags[1]).display).to.equal('none');
      expect(getComputedStyle(tags[2]).display).to.equal('none');
    });

    it('should close overlay and restore tags after a timeout', async () => {
      FieldHighlighter.addUser(field, user1);
      await oneEvent(wrapper.$.overlay, 'vaadin-overlay-open');
      await wrapper.flashPromise;
      expect(wrapper.opened).to.be.false;
    });

    it('should not flash tags when reordering same users', async () => {
      const spy = sinon.spy(wrapper, 'flashTags');
      FieldHighlighter.setUsers(field, [user3, user2]);
      await nextFrame();
      expect(spy.called).to.be.false;
    });

    it('should not update tags when reordering same users', async () => {
      const spy = sinon.spy(wrapper, 'updateTagsSync');
      FieldHighlighter.setUsers(field, [user3, user2]);
      await nextFrame();
      expect(spy.called).to.be.false;
    });
  });
});
