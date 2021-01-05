import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-avatar.js';

describe('vaadin-avatar', () => {
  let avatar, imgElement, iconElement, abbrElement;

  beforeEach(() => {
    avatar = fixtureSync('<vaadin-avatar></vaadin-avatar>');
    imgElement = avatar.shadowRoot.querySelector('img');
    iconElement = avatar.shadowRoot.querySelector('#avatar-icon');
    abbrElement = avatar.shadowRoot.querySelector('#avatar-abbr');
  });

  describe('custom element definition', () => {
    it('should be defined with correct tag name', () => {
      expect(customElements.get('vaadin-avatar')).to.be.ok;
    });

    it('should not expose class name globally', () => {
      expect(window.AvatarElement).not.to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(avatar.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
    });
  });

  describe('properties', () => {
    describe('"img" property', () => {
      const imgSrc = 'https://vaadin.com/';

      it('should have undefined "img" prop by default', () => {
        expect(avatar.img).to.be.undefined;
      });

      it('should reflect "img" prop to the attribute', () => {
        avatar.img = imgSrc;
        expect(avatar.getAttribute('img')).to.equal(imgSrc);
      });

      it('should propagate "img" to the internal img', () => {
        avatar.img = imgSrc;
        expect(imgElement.src).to.equal(imgSrc);
      });

      it('img should be visible when "img" property is provided', () => {
        expect(imgElement.hasAttribute('hidden')).to.be.true;

        avatar.img = imgSrc;
        expect(imgElement.hasAttribute('hidden')).to.be.false;
      });

      it('icon should be hidden when "img" property is provided', () => {
        expect(iconElement.hasAttribute('hidden')).to.be.false;

        avatar.img = imgSrc;
        expect(iconElement.hasAttribute('hidden')).to.be.true;
      });

      it('abbr should be hidden when "img" property is provided', () => {
        avatar.abbr = 'YY';
        expect(abbrElement.hasAttribute('hidden')).to.be.false;

        avatar.img = imgSrc;
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
      });

      it('should set title when both "img" and "name" are set', () => {
        avatar.img = imgSrc;
        avatar.name = 'Foo Bar';
        expect(avatar.getAttribute('title')).to.equal('Foo Bar');
      });
    });

    describe('"abbr" property', () => {
      it('should have undefined "abbr" prop by default', () => {
        expect(avatar.abbr).to.be.undefined;
      });

      it('should reflect "abbr" prop to the attribute', () => {
        avatar.abbr = 'YY';
        expect(avatar.getAttribute('abbr')).to.equal('YY');
      });

      it('abbr should be visible when "abbr" property is provided', () => {
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
        avatar.abbr = 'YY';

        expect(abbrElement.hasAttribute('hidden')).to.be.false;
      });

      it('icon should be hidden when "abbr" property is provided', () => {
        expect(iconElement.hasAttribute('hidden')).to.be.false;

        avatar.abbr = 'YY';
        expect(iconElement.hasAttribute('hidden')).to.be.true;
      });

      it('should generate abbreviation from name if none provided', () => {
        avatar.name = 'Foo Bar';
        expect(avatar.abbr).to.equal('FB');
      });

      it('should not generate abbreviation from name if it is provided', () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';
        expect(avatar.abbr).to.equal('BB');
      });

      it('should re-generate abbreviation from name if abbr was unset', () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';
        expect(avatar.abbr).to.equal('BB');

        avatar.abbr = '';
        expect(avatar.abbr).to.equal('FB');
      });

      it('should clean up abbreviation if name and abbr was unset', () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';

        avatar.abbr = '';
        avatar.name = '';

        expect(avatar.abbr).to.be.undefined;
      });

      it('should re-generate abbreviation from name if it was changed', () => {
        avatar.name = 'Foo Bar';
        expect(avatar.abbr).to.equal('FB');

        avatar.name = 'Bar Baz';
        expect(avatar.abbr).to.equal('BB');
      });

      it('should use "abbr" prop for setting title', () => {
        avatar.abbr = 'FB';
        expect(avatar.getAttribute('title')).to.equal('FB');
      });

      it('should set title when both "abbr" and "name" are set', () => {
        avatar.abbr = 'GG';
        avatar.name = 'Well played';
        expect(avatar.getAttribute('title')).to.equal('Well played (GG)');
      });
    });

    describe('"name" property', () => {
      it('should have undefined "name" prop by default', () => {
        expect(avatar.name).to.be.undefined;
      });

      it('should use "name" prop for setting title', () => {
        avatar.name = 'Foo Bar';
        expect(avatar.getAttribute('title')).to.equal('Foo Bar');
      });

      it('if "name" is not provided title should be "anonymous"', () => {
        expect(avatar.getAttribute('title')).to.equal('anonymous');
      });
    });

    describe('i18n property', () => {
      it('should set default value for i18n property', () => {
        expect(avatar.i18n).to.deep.equal({ anonymous: 'anonymous' });
      });

      it('should update title when i18n object is set', () => {
        avatar.i18n = { anonymous: 'someone' };
        expect(avatar.getAttribute('title')).to.equal('someone');
      });

      it('should update title when sub-property is set', () => {
        avatar.set('i18n.anonymous', 'someone');
        expect(avatar.getAttribute('title')).to.equal('someone');
      });

      it('should not update title when empty object is set', () => {
        avatar.i18n = {};
        expect(avatar.getAttribute('title')).to.equal('anonymous');
      });

      it('should not update title when empty value is set', () => {
        avatar.i18n = null;
        expect(avatar.getAttribute('title')).to.equal('anonymous');
      });
    });
  });

  describe('focus', () => {
    function focusin(node) {
      node.dispatchEvent(new CustomEvent('focusin', { bubbles: true, composed: true }));
    }

    function focusout(node) {
      const event = new CustomEvent('focusout', { bubbles: true, composed: true });
      node.dispatchEvent(event);
    }

    it('should set tabindex="0" on the avatar', () => {
      expect(avatar.getAttribute('tabindex')).to.equal('0');
    });

    it('should set focused attribute on avatar focusin', () => {
      focusin(avatar);
      expect(avatar.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on avatar focusout', () => {
      focusin(avatar);
      focusout(avatar);
      expect(avatar.hasAttribute('focused')).to.be.false;
    });

    it('should set focus-ring attribute on avatar focusin after Tab', () => {
      keyDownOn(document.body, 9);
      focusin(avatar);
      expect(avatar.hasAttribute('focus-ring')).to.be.true;
      focusout(avatar);
      expect(avatar.hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set the focus-ring attribute on avatar mousedown', () => {
      keyDownOn(document.body, 9);
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      focusin(avatar);
      expect(avatar.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('color index', () => {
    describe('correct index', () => {
      before(() => {
        document.documentElement.style.setProperty('--vaadin-user-color-0', 'red');
      });

      it('should set box-shadow based on color index', () => {
        avatar.colorIndex = 0;
        const { boxShadow } = getComputedStyle(avatar, '::before');
        expect(['rgb(255, 0, 0)', 'red'].some((v) => boxShadow.indexOf(v) > -1)).to.be.true;
      });

      it('should set attribute based on color index', () => {
        avatar.colorIndex = 0;
        expect(avatar.hasAttribute('has-color-index')).to.be.true;
        avatar.colorIndex = null;
        expect(avatar.hasAttribute('has-color-index')).to.be.false;
      });
    });

    describe('incorrect index', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should not set attribute for invalid index', () => {
        avatar.colorIndex = 99;
        expect(avatar.hasAttribute('has-color-index')).to.be.false;
      });

      it('should warn about invalid css property used', () => {
        avatar.colorIndex = 99;
        expect(console.warn.called).to.be.true;
      });
    });
  });

  describe('a11y', () => {
    it('should set role="button" on the avatar', () => {
      expect(avatar.getAttribute('role')).to.equal('button');
    });

    it('should set aria-hidden="true" on the img element', () => {
      expect(imgElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the icon element', () => {
      expect(iconElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the abbr element', () => {
      expect(abbrElement.getAttribute('aria-hidden')).to.equal('true');
    });
  });
});
