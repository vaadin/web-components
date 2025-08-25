import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, focusin, focusout, mousedown, nextUpdate, oneEvent, tabKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-avatar.js';
import { Tooltip } from '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('vaadin-avatar', () => {
  let avatar, imgElement, iconElement, abbrElement;

  beforeEach(async () => {
    avatar = fixtureSync('<vaadin-avatar></vaadin-avatar>');
    await nextUpdate(avatar);
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
      iconElement = avatar.shadowRoot.querySelector('[part=icon]');
      abbrElement = avatar.shadowRoot.querySelector('[part=abbr]');
    });

    const validImageSrc =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzAyMDIwMSIgZD0iTTQ1NC40MjYgMzkyLjU4MmMtNS40MzktMTYuMzItMTUuMjk4LTMyLjc4Mi0yOS44MzktNDIuMzYyLTI3Ljk3OS0xOC41NzItNjAuNTc4LTI4LjQ3OS05Mi4wOTktMzkuMDg1LTcuNjA0LTIuNjY0LTE1LjMzLTUuNTY4LTIyLjI3OS05LjctNi4yMDQtMy42ODYtOC41MzMtMTEuMjQ2LTkuOTc0LTE3Ljg4Ni0uNjM2LTMuNTEyLTEuMDI2LTcuMTE2LTEuMjI4LTEwLjY2MSAyMi44NTctMzEuMjY3IDM4LjAxOS04Mi4yOTUgMzguMDE5LTEyNC4xMzYgMC02NS4yOTgtMzYuODk2LTgzLjQ5NS04Mi40MDItODMuNDk1LTQ1LjUxNSAwLTgyLjQwMyAxOC4xNy04Mi40MDMgODMuNDY4IDAgNDMuMzM4IDE2LjI1NSA5Ni41IDQwLjQ4OSAxMjcuMzgzLS4yMjEgMi40MzgtLjUxMSA0Ljg3Ni0uOTUgNy4zMDMtMS40NDQgNi42MzktMy43NyAxNC4wNTgtOS45NyAxNy43NDMtNi45NTcgNC4xMzMtMTQuNjgyIDYuNzU2LTIyLjI4NyA5LjQyLTMxLjUyMSAxMC42MDUtNjQuMTE5IDE5Ljk1Ny05Mi4wOTEgMzguNTI5LTE0LjU0OSA5LjU4LTI0LjQwMyAyNy4xNTktMjkuODM4IDQzLjQ3OS01LjU5NyAxNi45MzgtNy44ODYgMzcuOTE3LTcuNTQxIDU0LjkxN2g0MTEuOTMyYy4zNDgtMTYuOTk5LTEuOTQ2LTM3Ljk3OC03LjUzOS01NC45MTd6Ii8+PC9zdmc+Cg==';
    const invalidImageSrc = 'thisisnotavalidimagesource';

    describe('"img" property', () => {
      it('should have undefined "img" prop by default', () => {
        expect(avatar.img).to.be.undefined;
      });

      it('should reflect "img" prop to the attribute', async () => {
        avatar.img = validImageSrc;
        await nextUpdate(avatar);
        expect(avatar.getAttribute('img')).to.equal(validImageSrc);
      });

      it('icon should be hidden when "img" property is provided', async () => {
        expect(iconElement.hasAttribute('hidden')).to.be.false;

        avatar.img = validImageSrc;
        await nextUpdate(avatar);
        expect(iconElement.hasAttribute('hidden')).to.be.true;
      });

      it('abbr should be hidden when "img" property is provided', async () => {
        avatar.abbr = 'YY';
        await nextUpdate(avatar);
        expect(abbrElement.hasAttribute('hidden')).to.be.false;

        avatar.img = validImageSrc;
        await nextUpdate(avatar);
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
      });
    });

    describe('"abbr" property', () => {
      it('should have undefined "abbr" prop by default', () => {
        expect(avatar.abbr).to.be.undefined;
      });

      it('should reflect "abbr" prop to the attribute', async () => {
        avatar.abbr = 'YY';
        await nextUpdate(avatar);
        expect(avatar.getAttribute('abbr')).to.equal('YY');
      });

      it('abbr should be visible when "abbr" property is provided', async () => {
        expect(abbrElement.hasAttribute('hidden')).to.be.true;
        avatar.abbr = 'YY';
        await nextUpdate(avatar);

        expect(abbrElement.hasAttribute('hidden')).to.be.false;
      });

      it('icon should be hidden when "abbr" property is provided', async () => {
        expect(iconElement.hasAttribute('hidden')).to.be.false;

        avatar.abbr = 'YY';
        await nextUpdate(avatar);
        expect(iconElement.hasAttribute('hidden')).to.be.true;
      });

      it('should generate abbreviation from name if none provided', async () => {
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('FB');
      });

      it('should not generate abbreviation from name if it is provided', async () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('BB');
      });

      it('should re-generate abbreviation from name if abbr was unset', async () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('BB');

        avatar.abbr = '';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('FB');
      });

      it('should clean up abbreviation if name and abbr was unset', async () => {
        avatar.abbr = 'BB';
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);

        avatar.abbr = '';
        avatar.name = '';
        await nextUpdate(avatar);

        expect(avatar.abbr).to.be.undefined;
      });

      it('should re-generate abbreviation from name if it was changed', async () => {
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('FB');

        avatar.name = 'Bar Baz';
        await nextUpdate(avatar);
        expect(avatar.abbr).to.equal('BB');
      });
    });

    describe('"name" property', () => {
      it('should have undefined "name" prop by default', () => {
        expect(avatar.name).to.be.undefined;
      });
    });

    describe('i18n property', () => {
      it('should set default value for i18n property', () => {
        expect(avatar.i18n).to.deep.equal({ anonymous: 'anonymous' });
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

    describe('tooltip', () => {
      let tooltip;

      before(() => {
        Tooltip.setDefaultFocusDelay(0);
        Tooltip.setDefaultHoverDelay(0);
        Tooltip.setDefaultHideDelay(0);
      });

      beforeEach(async () => {
        avatar.withTooltip = true;
        await nextUpdate(avatar);
        tooltip = avatar.querySelector('[slot="tooltip"]');
      });

      it('should set tooltip text to "anonymous" by default', () => {
        expect(tooltip.text).to.equal('anonymous');
      });

      it('should use "name" property for setting tooltip text', async () => {
        avatar.name = 'Foo Bar';
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('Foo Bar');
      });

      it('should use "abbr" property for setting tooltip text', async () => {
        avatar.abbr = 'FB';
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('FB');
      });

      it('should set tooltip text when both "abbr" and "name" are set', async () => {
        avatar.abbr = 'GG';
        avatar.name = 'Well played';
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('Well played (GG)');
      });

      it('should update tooltip text when i18n object is set', async () => {
        avatar.i18n = { anonymous: 'someone' };
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('someone');
      });

      it('should not update tooltip text when empty object is set', async () => {
        avatar.i18n = {};
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('anonymous');
      });

      it('should not update tooltip text when empty value is set', async () => {
        avatar.i18n = null;
        await nextUpdate(avatar);
        expect(tooltip.text).to.equal('anonymous');
      });

      it('should cleanup tooltip target when withTooltip is set to false', async () => {
        avatar.withTooltip = false;
        await nextUpdate(avatar);
        expect(tooltip.target).to.be.null;
      });

      it('should remove tooltip element when withTooltip is set to false', async () => {
        avatar.withTooltip = false;
        await nextUpdate(avatar);
        expect(tooltip.parentNode).to.be.null;
      });

      it('should show tooltip when avatar is at the edge of a scroll container', () => {
        const container = fixtureSync('<div></div>');
        container.setAttribute('style', 'width: 100px; height: 100px; overflow: auto;');
        container.appendChild(avatar);

        const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
        tabKeyDown(avatar);
        avatar.focus();
        expect(overlay.opened).to.be.true;
      });

      it('should set has-tooltip attribute on the avatar', () => {
        expect(avatar.hasAttribute('has-tooltip')).to.be.true;
      });

      it('should remove has-tooltip attribute from the avata when withTooltip is set to false ', async () => {
        avatar.withTooltip = false;
        await nextUpdate(avatar);
        expect(avatar.hasAttribute('has-tooltip')).to.be.false;
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

      it('should set border color based on color index', async () => {
        avatar.colorIndex = 0;
        await nextUpdate(avatar);
        const { borderColor } = getComputedStyle(avatar, '::before');
        expect(['rgb(255, 0, 0)', 'red'].some((v) => borderColor.indexOf(v) > -1)).to.be.true;
      });

      it('should set attribute based on color index', async () => {
        avatar.colorIndex = 0;
        await nextUpdate(avatar);
        expect(avatar.hasAttribute('has-color-index')).to.be.true;

        avatar.colorIndex = null;
        await nextUpdate(avatar);
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

      it('should not set attribute for invalid index', async () => {
        avatar.colorIndex = 99;
        await nextUpdate(avatar);
        expect(avatar.hasAttribute('has-color-index')).to.be.false;
      });

      it('should warn about invalid css property used', async () => {
        avatar.colorIndex = 99;
        await nextUpdate(avatar);
        expect(console.warn.called).to.be.true;
      });
    });
  });

  describe('a11y', () => {
    it('should set role="img" on the avatar', () => {
      expect(avatar.getAttribute('role')).to.equal('img');
    });

    it('should set aria-hidden="true" on the img element', () => {
      const imgElement = avatar.shadowRoot.querySelector('img');
      expect(imgElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the icon element', () => {
      const iconElement = avatar.shadowRoot.querySelector('[part=icon]');
      expect(iconElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should set aria-hidden="true" on the abbr element', () => {
      const abbrElement = avatar.shadowRoot.querySelector('[part=abbr]');
      expect(abbrElement.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should not override custom role set on the avatar', () => {
      const custom = fixtureSync('<vaadin-avatar role="button"></vaadin-avatar>');
      expect(custom.getAttribute('role')).to.equal('button');
    });

    it('should set aria-label attribute to abbr value by default', async () => {
      avatar.abbr = 'JD';
      await nextUpdate(avatar);
      expect(avatar.getAttribute('aria-label')).to.equal('JD');
    });

    it('should add name to aria-label attribute when tooltip is not set', async () => {
      avatar.name = 'John Doe';
      await nextUpdate(avatar);
      expect(avatar.getAttribute('aria-label')).to.equal('John Doe (JD)');
    });

    it('should not add name to aria-label attribute when tooltip is set', async () => {
      avatar.name = 'John Doe';
      avatar.withTooltip = true;
      await nextUpdate(avatar);
      expect(avatar.getAttribute('aria-label')).to.equal('JD');
    });

    it('should remove aria-label attribute when abbr property is removed', async () => {
      avatar.abbr = 'JD';
      await nextUpdate(avatar);

      avatar.abbr = null;
      await nextUpdate(avatar);
      expect(avatar.hasAttribute('aria-label')).to.be.false;
    });
  });
});
