import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/text-field';
import { FieldHighlighter } from '../src/vaadin-field-highlighter.js';

async function waitForIntersectionObserver() {
  await nextFrame();
  await nextFrame();
}

describe('field highlighter', () => {
  let field;
  let highlighter;
  let outline;
  let wrapper;
  let overlay;

  beforeEach(async () => {
    field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
    highlighter = FieldHighlighter.init(field);
    outline = field.shadowRoot.querySelector('[part="outline"]');
    wrapper = field.shadowRoot.querySelector('vaadin-user-tags');
    overlay = wrapper.$.overlay;
    await waitForIntersectionObserver();
  });

  describe('initialization', () => {
    it('should create field highlighter instance', () => {
      expect(highlighter).to.be.ok;
    });

    it('should create field outline instance', () => {
      expect(outline).to.be.ok;
    });

    it('should set field as the field highlighter host', () => {
      expect(highlighter.host).to.equal(field);
    });

    it('should set has-highlighter attribute on the field', () => {
      expect(field.hasAttribute('has-highlighter')).to.be.true;
    });

    it('should position the outline based on the field', () => {
      const { position, top, left, right, bottom } = getComputedStyle(outline);
      expect(position).to.equal('absolute');
      expect(top).to.equal('0px');
      expect(left).to.equal('0px');
      expect(right).to.equal('0px');
      expect(bottom).to.equal('0px');
    });

    it('should not show outline by default', () => {
      expect(getComputedStyle(outline).opacity).to.equal('0');
    });

    it('should set pointer-events on the outline to none', () => {
      expect(getComputedStyle(outline).pointerEvents).to.equal('none');
    });
  });

  describe('users', () => {
    const user1 = { id: 'a', name: 'foo', colorIndex: 0 };
    const user2 = { id: 'b', name: 'var', colorIndex: 1 };

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

    describe('adding and removing', () => {
      it('should add users to the highlighter', () => {
        addUser(user1);
        expect(highlighter.users).to.deep.equal([user1]);

        addUser(user2);
        expect(highlighter.users).to.deep.equal([user1, user2]);
      });

      it('should remove users from the highlighter', () => {
        addUser(user1);
        removeUser(user1);
        expect(highlighter.users).to.deep.equal([]);
      });

      it('should add multiple users at a time', () => {
        setUsers([user1, user2]);
        expect(highlighter.users).to.deep.equal([user1, user2]);
      });

      it('should remove users if empty array is passed', () => {
        setUsers([user1, user2]);
        setUsers([]);
        expect(highlighter.users).to.deep.equal([]);
      });

      it('should not add user if empty value is passed', () => {
        addUser(user1);
        addUser(null);
        expect(highlighter.users).to.deep.equal([user1]);
      });

      it('should not remove user if no value is passed', () => {
        addUser(user1);
        removeUser();
        expect(highlighter.users).to.deep.equal([user1]);
      });
    });

    describe('active user', () => {
      it('should set active user on the highlighter', () => {
        addUser(user1);
        expect(highlighter.user).to.deep.equal(user1);
      });

      it('should set last added user as active', () => {
        setUsers([user1, user2]);
        expect(highlighter.user).to.deep.equal(user2);
      });

      it('should set attribute on the outline when user is added', () => {
        addUser(user1);
        expect(outline.hasAttribute('has-active-user')).to.be.true;
      });

      it('should show highlighter when user is added', async () => {
        addUser(user1);
        await nextFrame();
        expect(getComputedStyle(outline).opacity).to.equal('1');
      });

      it('should remove attribute when user is removed', () => {
        addUser(user1);
        removeUser(user1);
        expect(outline.hasAttribute('has-active-user')).to.be.false;
      });

      it('should make previous user active when user is removed', () => {
        addUser(user1);
        addUser(user2);
        removeUser(user2);
        expect(highlighter.user).to.deep.equal(user1);
      });

      it('should reset user when all the users are removed', () => {
        addUser(user1);
        addUser(user2);
        removeUser(user2);
        removeUser(user1);
        expect(highlighter.user).to.be.null;
      });

      it('should reset user when multiple users are removed', () => {
        setUsers([user1, user2]);
        setUsers([]);
        expect(highlighter.user).to.be.null;
      });
    });

    describe('overlay', () => {
      it('should open overlay on field focusin', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('focusin'));
        expect(overlay.opened).to.be.true;
      });

      it('should close overlay on field focusout', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('focusin'));
        field.dispatchEvent(new CustomEvent('focusout'));
        await aTimeout(1);
        expect(overlay.opened).to.be.false;
      });

      it('should open overlay on field mouseenter', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        expect(overlay.opened).to.be.true;
      });

      it('should close overlay on field mouseleave', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        field.dispatchEvent(new CustomEvent('mouseleave'));
        expect(overlay.opened).to.be.false;
      });

      it('should not close overlay on field mouseleave after focusin', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        field.dispatchEvent(new CustomEvent('focusin'));
        field.dispatchEvent(new CustomEvent('mouseleave'));
        expect(overlay.opened).to.be.true;
      });

      it('should not close overlay on field focusout after mouseenter', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('focusin'));
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        field.dispatchEvent(new CustomEvent('focusout'));
        expect(overlay.opened).to.be.true;
      });

      it('should not close overlay on field mouseleave to overlay', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        const leave = new CustomEvent('mouseleave');
        leave.relatedTarget = overlay;
        field.dispatchEvent(leave);
        expect(overlay.opened).to.be.true;
      });

      it('should close overlay on overlay mouseleave', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        overlay.dispatchEvent(new CustomEvent('mouseleave'));
        expect(overlay.opened).to.be.false;
      });

      it('should not close overlay on overlay mouseleave to field', async () => {
        addUser(user1);
        await nextFrame();
        field.dispatchEvent(new CustomEvent('mouseenter'));
        highlighter.observer._mouseDebouncer.flush();
        const leave = new CustomEvent('mouseleave');
        leave.relatedTarget = field;
        overlay.dispatchEvent(leave);
        expect(overlay.opened).to.be.true;
      });

      it('should close overlay when users set to empty while opened', async () => {
        field.dispatchEvent(new CustomEvent('focusin'));
        setUsers([user1, user2]);
        await nextFrame();
        expect(overlay.opened).to.be.true;
        setUsers([]);
        await nextFrame();
        expect(overlay.opened).to.be.false;
      });
    });

    describe('announcements', () => {
      let clock;
      let region;

      before(() => {
        region = document.querySelector('[aria-live]');
      });

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should announce adding a new user', () => {
        addUser(user1);

        clock.tick(150);

        expect(region.textContent).to.equal(`${user1.name} started editing`);
      });

      it('should announce field label, if any', () => {
        field.label = 'Username';
        addUser(user1);

        clock.tick(150);

        expect(region.textContent).to.equal(`${user1.name} started editing ${field.label}`);
      });
    });
  });
});
