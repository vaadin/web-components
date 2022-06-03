import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-select.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-select', () => {
  let select;

  beforeEach(() => {
    resetUniqueId();
    select = fixtureSync('<vaadin-select></vaadin-select>');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      select.disabled = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      select.readonly = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      select.invalid = true;
      await expect(select).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      select.setAttribute('theme', 'align-right');
      await expect(select).shadowDom.to.equalSnapshot();
    });
  });

  describe('slots', () => {
    it('default', async () => {
      await expect(select).lightDom.to.equalSnapshot();
    });

    it('helper', async () => {
      select.helperText = 'Helper';
      await expect(select).lightDom.to.equalSnapshot();
    });
  });
});
