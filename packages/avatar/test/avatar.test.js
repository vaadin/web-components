import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusin, focusout, mousedown, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-avatar.js';

describe('vaadin-avatar', () => {
  let avatar, imgElement, iconElement, abbrElement;

  beforeEach(() => {
    avatar = fixtureSync('<vaadin-avatar></vaadin-avatar>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = avatar.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('properties', () => {
    beforeEach(() => {
      imgElement = avatar.shadowRoot.querySelector('img');
      iconElement = avatar.shadowRoot.querySelector('#avatar-icon');
      abbrElement = avatar.shadowRoot.querySelector('#avatar-abbr');
    });

    const validImageSrc =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzAyMDIwMSIgZD0iTTQ1NC40MjYgMzkyLjU4MmMtNS40MzktMTYuMzItMTUuMjk4LTMyLjc4Mi0yOS44MzktNDIuMzYyLTI3Ljk3OS0xOC41NzItNjAuNTc4LTI4LjQ3OS05Mi4wOTktMzkuMDg1LTcuNjA0LTIuNjY0LTE1LjMzLTUuNTY4LTIyLjI3OS05LjctNi4yMDQtMy42ODYtOC41MzMtMTEuMjQ2LTkuOTc0LTE3Ljg4Ni0uNjM2LTMuNTEyLTEuMDI2LTcuMTE2LTEuMjI4LTEwLjY2MSAyMi44NTctMzEuMjY3IDM4LjAxOS04Mi4yOTUgMzguMDE5LTEyNC4xMzYgMC02NS4yOTgtMzYuODk2LTgzLjQ5NS04Mi40MDItODMuNDk1LTQ1LjUxNSAwLTgyLjQwMyAxOC4xNy04Mi40MDMgODMuNDY4IDAgNDMuMzM4IDE2LjI1NSA5Ni41IDQwLjQ4OSAxMjcuMzgzLS4yMjEgMi40MzgtLjUxMSA0Ljg3Ni0uOTUgNy4zMDMtMS40NDQgNi42MzktMy43NyAxNC4wNTgtOS45NyAxNy43NDMtNi45NTcgNC4xMzMtMTQuNjgyIDYuNzU2LTIyLjI4NyA5LjQyLTMxLjUyMSAxMC42MDUtNjQuMTE5IDE5Ljk1Ny05Mi4wOTEgMzguNTI5LTE0LjU0OSA5LjU4LTI0LjQwMyAyNy4xNTktMjkuODM4IDQzLjQ3OS01LjU5NyAxNi45MzgtNy44ODYgMzcuOTE3LTcuNTQxIDU0LjkxN2g0MTEuOTMyYy4zNDgtMTYuOTk5LTEuOTQ2LTM3Ljk3OC03LjUzOS01NC45MTd6Ii8+PC9zdmc+Cg==';
    const invalidImageSrc = 'thisisnotavalidimagesource';

    describe('"img" property', () => {
      it('should have undefined "img" prop by default', () => {
        expect(avatar.img).to.be.undefined;
      });

      it('should reflect "img" prop to the attribute', () => {
        avatar.img = validImageSrc;
        expect(avatar.getAttribute('img')).to.equal(validImageSrc);
      });

      it('icon should be hidden when "img" property is provided', () => {
        expect(iconElement.hasAttribute('hidden')).to.be.false;

        avatar.img = validImageSrc;
        expect(iconElement.hasAttribute('hidden')).to.be.true;
      });

      it('abbr should be hidden when "img" property is provided', () => {
        avatar.abbr = 'YY';
        expect(abbrElement.hasAttribute('hidden')).to.be.false;

        avatar.img = validImageSrc;
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
      });

      it('should set title when both "img" and "name" are set', () => {
        avatar.img = validImageSrc;
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

    describe('img fallback', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should display abbr as fallback if image can not be loaded and an abbreviation was provided', async () => {
        avatar.abbr = 'YY';
        avatar.img = invalidImageSrc;
        await oneEvent(imgElement, 'error');
        expect(imgElement.hasAttribute('hidden')).to.be.true;
        expect(abbrElement.hasAttribute('hidden')).to.be.false;
      });

      it('should display abbr as fallback if image can not be loaded and a name was provided', async () => {
        avatar.name = 'Foo Bar';
        avatar.img = invalidImageSrc;
        await oneEvent(imgElement, 'error');
        expect(imgElement.hasAttribute('hidden')).to.be.true;
        expect(abbrElement.hasAttribute('hidden')).to.be.false;
      });

      it('should display icon as fallback if image can not be loaded and no other data was provided', async () => {
        avatar.img = invalidImageSrc;
        await oneEvent(imgElement, 'error');
        expect(imgElement.hasAttribute('hidden')).to.be.true;
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
        expect(iconElement.hasAttribute('hidden')).to.be.false;
      });

      it('should log a warning if image can not be loaded', async () => {
        avatar.img = invalidImageSrc;
        await oneEvent(imgElement, 'error');
        expect(console.warn.calledOnce).to.be.true;
      });

      it('should display img when setting a valid source after setting an invalid source', async () => {
        avatar.abbr = 'YY';
        avatar.img = invalidImageSrc;
        await oneEvent(imgElement, 'error');
        avatar.img = validImageSrc;
        await oneEvent(imgElement, 'load');
        expect(imgElement.hasAttribute('hidden')).to.be.false;
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
      });
    });
  });

  describe('focus', () => {
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
      tabKeyDown(document.body);
      focusin(avatar);
      expect(avatar.hasAttribute('focus-ring')).to.be.true;
      focusout(avatar);
      expect(avatar.hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set the focus-ring attribute on avatar mousedown', () => {
      tabKeyDown(document.body);
      mousedown(document.body);
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
      const imgElement = avatar.shadowRoot.querySelector('img');
      expect(imgElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the icon element', () => {
      const iconElement = avatar.shadowRoot.querySelector('#avatar-icon');
      expect(iconElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the abbr element', () => {
      const abbrElement = avatar.shadowRoot.querySelector('#avatar-abbr');
      expect(abbrElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should not override custom role set on the avatar', () => {
      const custom = fixtureSync('<vaadin-avatar role="image"></vaadin-avatar>');
      expect(custom.getAttribute('role')).to.equal('image');
    });
  });
});
